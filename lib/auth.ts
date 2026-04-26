// ─── Local Auth System (no Firebase) ─────────────────────────────────────────
// Uses AsyncStorage to persist user session across app restarts

import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = 'srj_user';

export interface SRJUser {
  name:      string;
  email:     string;
  phone?:    string;
  joinedAt:  string;
}

// Save user after signup/login
export async function saveUser(user: SRJUser): Promise<void> {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

// Get current logged-in user (null = not logged in)
export async function getUser(): Promise<SRJUser | null> {
  try {
    const raw = await AsyncStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

// Logout — clear saved user
export async function logoutUser(): Promise<void> {
  await AsyncStorage.removeItem(USER_KEY);
}

// Simple local "login" — just validate format and save
export async function loginUser(email: string, password: string, name?: string): Promise<{ success: boolean; error?: string }> {
  if (!email.trim()) return { success:false, error:'Please enter your email.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return { success:false, error:'Please enter a valid email.' };
  if (!password || password.length < 6) return { success:false, error:'Password must be at least 6 characters.' };

  const user: SRJUser = {
    name:     name?.trim() || email.split('@')[0],
    email:    email.trim().toLowerCase(),
    phone:    '',
    joinedAt: new Date().toISOString(),
  };
  await saveUser(user);
  return { success:true };
}
