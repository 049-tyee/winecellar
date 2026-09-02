// 静态导出模式下的本地持久化层（localStorage）
// 后续接入 Supabase 时仅需替换本文件的实现

export interface BookingRecord {
  id: string;
  serviceKey: string;
  tier?: string;
  quantity: number;
  totalPrice: number;
  gameId: string;
  wechat: string;
  description: string;
  preferredTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'PAID' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface ScheduleSlot {
  id: string;
  date: string; // YYYY-MM-DD
  hour: number; // 0-23
  available: boolean;
  bookingId?: string;
}

export interface AssessmentRecord {
  id: string;
  date: string; // ISO
  mouseControl: number; // 0-100
  leftPrecision: number;
  rightPrecision: number;
  ergonomics: number;
  reaction: number;
  reactionMs: number;
}

const KEYS = {
  bookings: 'wc_bookings',
  schedule: 'wc_schedule',
  assessments: 'wc_assessments',
  membership: 'wc_membership_emails',
  inquiries: 'wc_inquiries',
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// ---------- Bookings ----------
export function getBookings(): BookingRecord[] {
  return read<BookingRecord[]>(KEYS.bookings, []);
}

export function addBooking(b: Omit<BookingRecord, 'id' | 'status' | 'createdAt'>): BookingRecord {
  const record: BookingRecord = {
    ...b,
    id: uid(),
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };
  write(KEYS.bookings, [record, ...getBookings()]);
  return record;
}

export function updateBookingStatus(id: string, status: BookingRecord['status']) {
  write(
    KEYS.bookings,
    getBookings().map((b) => (b.id === id ? { ...b, status } : b))
  );
}

// ---------- Coach Schedule ----------
export function getSchedule(): ScheduleSlot[] {
  return read<ScheduleSlot[]>(KEYS.schedule, []);
}

export function toggleSlot(date: string, hour: number): ScheduleSlot[] {
  const slots = getSchedule();
  const idx = slots.findIndex((s) => s.date === date && s.hour === hour);
  if (idx >= 0) {
    if (slots[idx].bookingId) return slots; // 已预约时段不可取消
    slots.splice(idx, 1);
  } else {
    slots.push({ id: uid(), date, hour, available: true });
  }
  write(KEYS.schedule, slots);
  return slots;
}

export function isSlotOpen(date: string, hour: number): boolean {
  return getSchedule().some((s) => s.date === date && s.hour === hour && s.available && !s.bookingId);
}

export function occupySlot(date: string, hour: number, bookingId: string) {
  write(
    KEYS.schedule,
    getSchedule().map((s) =>
      s.date === date && s.hour === hour ? { ...s, bookingId } : s
    )
  );
}

// ---------- Assessments ----------
export function getAssessments(): AssessmentRecord[] {
  return read<AssessmentRecord[]>(KEYS.assessments, []);
}

export function addAssessment(a: Omit<AssessmentRecord, 'id' | 'date'>): AssessmentRecord {
  const record: AssessmentRecord = { ...a, id: uid(), date: new Date().toISOString() };
  write(KEYS.assessments, [...getAssessments(), record]);
  return record;
}

// ---------- Membership emails ----------
export function subscribeMembership(email: string) {
  const list = read<string[]>(KEYS.membership, []);
  if (!list.includes(email)) write(KEYS.membership, [...list, email]);
}

// ---------- Inquiries (about page) ----------
export function addInquiry(content: { name: string; contact: string; message: string }) {
  const list = read<Array<typeof content & { id: string; createdAt: string }>>(KEYS.inquiries, []);
  write(KEYS.inquiries, [{ ...content, id: uid(), createdAt: new Date().toISOString() }, ...list]);
}
