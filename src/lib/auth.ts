// Supabase Auth 封装 —— 教练/管理员登录与角色查询
'use client';

import { supabase } from './supabase';

export type StaffRole = 'COACH' | 'ADMIN';

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

// 按 auth 用户 email 查 public."User" 的角色；非员工返回 null
export async function getMyRole(): Promise<StaffRole | null> {
  const session = await getSession();
  if (!session?.user?.email) return null;
  const { data, error } = await supabase
    .from('User')
    .select('role')
    .eq('email', session.user.email)
    .maybeSingle();
  if (error || !data) return null;
  return data.role === 'COACH' || data.role === 'ADMIN' ? (data.role as StaffRole) : null;
}

export function onAuthChange(callback: (loggedIn: boolean) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => callback(!!session));
}
