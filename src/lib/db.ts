// Supabase 云端数据层 —— 失败时自动回退 localStorage（storage.ts）
import { supabase } from './supabase';
import * as local from './storage';

export interface SlotInfo {
  date: string; // YYYY-MM-DD
  hour: number;
  bookingId?: string | null;
}

// ---------- 服务映射（name_key → id） ----------
let serviceIdCache: Record<string, string> | null = null;

export async function getServiceIds(): Promise<Record<string, string>> {
  if (serviceIdCache) return serviceIdCache;
  const { data, error } = await supabase.from('Service').select('id,name_key').eq('is_active', true);
  if (error) throw error;
  // 种子数据的 name_key 形如 "services.list.coaching_1on1.name"，归一化为短键
  serviceIdCache = Object.fromEntries(
    (data ?? []).map((s) => [s.name_key.replace(/^services\.list\./, '').replace(/\.name$/, ''), s.id])
  );
  return serviceIdCache!;
}

// ---------- 预约 ----------
export interface NewBooking {
  serviceKey: string;
  tier?: string;
  quantity: number;
  totalPrice: number;
  gameId: string;
  wechat: string;
  description: string;
  preferredTime: string;
  slot?: SlotInfo | null;
}

export async function createBooking(b: NewBooking): Promise<string> {
  const ids = await getServiceIds();
  // 匿名插入受 RLS 保护：不能用 RETURNING（需要 SELECT 权限），故 id 在客户端生成
  const id = crypto.randomUUID();
  const { error } = await supabase
    .from('Booking')
    .insert({
      id,
      user_id: null,
      service_id: ids[b.serviceKey],
      tier_level: b.tier ?? null,
      quantity: b.quantity,
      total_price: b.totalPrice,
      scheduled_at: b.slot ? slotToISO(b.slot.date, b.slot.hour) : null,
      notes: b.preferredTime,
      contact_info: { gameId: b.gameId, wechat: b.wechat, description: b.description },
    });
  if (error) throw error;
  if (b.slot) await occupySlotRemote(b.slot.date, b.slot.hour, id);
  return id;
}

export interface BookingRow {
  id: string;
  serviceKey: string;
  tier?: string | null;
  quantity: number;
  totalPrice: number;
  gameId: string;
  wechat: string;
  description: string;
  preferredTime: string;
  scheduledAt?: string | null;
  status: local.BookingRecord['status'];
  createdAt: string;
}

export async function fetchBookings(): Promise<BookingRow[]> {
  const ids = await getServiceIds();
  const reverse = Object.fromEntries(Object.entries(ids).map(([k, v]) => [v, k]));
  const { data, error } = await supabase
    .from('Booking')
    .select('id,service_id,tier_level,quantity,total_price,status,notes,contact_info,created_at,scheduled_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => {
    const ci = (r.contact_info ?? {}) as { gameId?: string; wechat?: string; description?: string };
    return {
      id: r.id,
      serviceKey: reverse[r.service_id] ?? r.service_id,
      tier: r.tier_level,
      quantity: r.quantity,
      totalPrice: r.total_price,
      gameId: ci.gameId ?? '',
      wechat: ci.wechat ?? '',
      description: ci.description ?? '',
      preferredTime: r.notes ?? '',
      scheduledAt: r.scheduled_at,
      status: r.status,
      createdAt: r.created_at,
    };
  });
}

export async function setBookingStatus(id: string, status: local.BookingRecord['status']) {
  const { error } = await supabase
    .from('Booking')
    .update({ status, paid_at: status === 'PAID' ? new Date().toISOString() : null })
    .eq('id', id);
  if (error) throw error;
}

// ---------- 教练日程 ----------
function slotToISO(date: string, hour: number) {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, m - 1, d, hour, 0, 0, 0).toISOString();
}

export async function fetchSchedule(): Promise<SlotInfo[]> {
  const { data, error } = await supabase
    .from('CoachSchedule')
    .select('date,start_time,is_available,booking_id')
    .eq('is_available', true)
    .gte('date', new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10));
  if (error) throw error;
  return (data ?? []).map((r) => ({
    date: r.date,
    hour: new Date(r.start_time).getHours(),
    bookingId: r.booking_id,
  }));
}

export async function toggleSlotRemote(date: string, hour: number): Promise<void> {
  const { data: existing, error: qErr } = await supabase
    .from('CoachSchedule')
    .select('id,booking_id')
    .eq('date', date)
    .eq('start_time', slotToISO(date, hour))
    .maybeSingle();
  if (qErr) throw qErr;
  if (existing) {
    if (existing.booking_id) return; // 已预约不可取消
    const { error } = await supabase.from('CoachSchedule').delete().eq('id', existing.id);
    if (error) throw error;
  } else {
    const start = slotToISO(date, hour);
    const end = slotToISO(date, hour + 1);
    const { error } = await supabase
      .from('CoachSchedule')
      .insert({ date, start_time: start, end_time: end, is_available: true });
    if (error) throw error;
  }
}

async function occupySlotRemote(date: string, hour: number, bookingId: string) {
  // RLS 下游客无权直接 update CoachSchedule，走 SECURITY DEFINER RPC
  const { error } = await supabase.rpc('occupy_slot', {
    p_date: date,
    p_start: slotToISO(date, hour),
    p_booking_id: bookingId,
  });
  if (error) throw error;
}

// ---------- 天赋测评 ----------
export async function saveAssessmentRemote(a: Omit<local.AssessmentRecord, 'id' | 'date'>): Promise<void> {
  const { error } = await supabase.from('TalentAssessment').insert({
    mouse_control_score: a.mouseControl,
    left_precision_score: a.leftPrecision,
    right_precision_score: a.rightPrecision,
    ergonomics_score: a.ergonomics,
    reaction_speed_score: a.reaction,
    raw_data_json: { reactionMs: a.reactionMs },
    report_json: {},
  });
  if (error) throw error;
}

// ---------- 会员订阅 / 合作洽谈 ----------
export async function subscribeRemote(email: string): Promise<void> {
  const { error } = await supabase.from('MembershipSubscriber').insert({ email });
  if (error && error.code !== '23505') throw error; // 忽略重复订阅
}

export async function sendInquiryRemote(content: { name: string; contact: string; message: string }): Promise<void> {
  const { error } = await supabase.from('Inquiry').insert(content);
  if (error) throw error;
}
