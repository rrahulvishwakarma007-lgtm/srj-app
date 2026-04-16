// Shekhar Raja Jewellers — Auth with AsyncStorage as Database
import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = 'srj_users';
const SESSION_KEY = 'srj_session';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string; // In real backend this would be hashed — stored locally here
}

export interface Session {
  userId: number;
  email: string;
  name: string;
}

async function readUsers(): Promise<User[]> {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function writeUsers(users: User[]): Promise<void> {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function register(name: string, email: string, password: string): Promise<{ ok: true; user: User } | { ok: false; error: string }> {
  const users = await readUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, error: 'Email already registered' };
  }
  const user: User = { id: Date.now(), name: name.trim(), email: email.trim(), password };
  users.push(user);
  await writeUsers(users);
  return { ok: true, user };
}

export async function login(email: string, password: string): Promise<{ ok: true; session: Session } | { ok: false; error: string }> {
  const users = await readUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) return { ok: false, error: 'Invalid email or password' };
  const session: Session = { userId: user.id, email: user.email, name: user.name };
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { ok: true, session };
}

export async function getSession(): Promise<Session | null> {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function logout(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}

// Helper to check if any account exists (for skipping login on return visits if desired)
export async function hasAnyUser(): Promise<boolean> {
  const users = await readUsers();
  return users.length > 0;
}