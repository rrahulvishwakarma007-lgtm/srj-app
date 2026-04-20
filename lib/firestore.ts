import {
  collection, getDocs, addDoc, onSnapshot,
  query, orderBy, serverTimestamp, Timestamp,
  DocumentData,
} from 'firebase/firestore';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface FireProduct {
  id:          string;
  name:        string;
  category:    string;
  price:       number;
  purity:      string;
  weight:      number;
  description: string;
  imageUrl?:   string;
  color:       string;
  icon:        string;
  inStock:     boolean;
  featured:    boolean;
  createdAt?:  Timestamp;
}

export interface FireReel {
  id:        string;
  title:     string;
  videoUrl:  string;
  thumbUrl?: string;
  likes:     number;
  createdAt?: Timestamp;
}

export interface FireEnquiry {
  name:      string;
  phone:     string;
  email?:    string;
  type:      string;
  message?:  string;
  createdAt: any;
}

export interface FireAppointment {
  name:      string;
  date:      string;
  time:      string;
  service:   string;
  phone?:    string;
  createdAt: any;
}

// ─────────────────────────────────────────────
// PRODUCTS — fetch all from Firestore
// ─────────────────────────────────────────────

export async function fetchProducts(): Promise<FireProduct[]> {
  try {
    const snap = await getDocs(
      query(collection(db, 'products'), orderBy('createdAt', 'desc'))
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as FireProduct));
  } catch (e) {
    console.warn('fetchProducts error:', e);
    return [];
  }
}

// Real-time listener for products (auto-updates app when you add products in Firebase)
export function listenProducts(cb: (products: FireProduct[]) => void) {
  return onSnapshot(
    query(collection(db, 'products'), orderBy('createdAt', 'desc')),
    snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as FireProduct))),
    err  => console.warn('listenProducts error:', err)
  );
}

// ─────────────────────────────────────────────
// REELS — fetch from Firestore metadata
// ─────────────────────────────────────────────

export async function fetchReels(): Promise<FireReel[]> {
  try {
    const snap = await getDocs(
      query(collection(db, 'reels'), orderBy('createdAt', 'desc'))
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as FireReel));
  } catch (e) {
    console.warn('fetchReels error:', e);
    return [];
  }
}

// Real-time listener for reels (auto-updates when you upload new reel)
export function listenReels(cb: (reels: FireReel[]) => void) {
  return onSnapshot(
    query(collection(db, 'reels'), orderBy('createdAt', 'desc')),
    snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as FireReel))),
    err  => console.warn('listenReels error:', err)
  );
}

// ─────────────────────────────────────────────
// ENQUIRIES — save contact form to Firestore
// ─────────────────────────────────────────────

export async function saveEnquiry(data: Omit<FireEnquiry, 'createdAt'>): Promise<boolean> {
  try {
    await addDoc(collection(db, 'enquiries'), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return true;
  } catch (e) {
    console.warn('saveEnquiry error:', e);
    return false;
  }
}

// ─────────────────────────────────────────────
// APPOINTMENTS — save booking to Firestore
// ─────────────────────────────────────────────

export async function saveAppointment(data: Omit<FireAppointment, 'createdAt'>): Promise<boolean> {
  try {
    await addDoc(collection(db, 'appointments'), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return true;
  } catch (e) {
    console.warn('saveAppointment error:', e);
    return false;
  }
}

// ─────────────────────────────────────────────
// BANNERS — fetch promotional banners remotely
// ─────────────────────────────────────────────

export interface FireBanner {
  id:      string;
  title:   string;
  sub:     string;
  btn:     string;
  imageUrl: string;
  order:   number;
}

export async function fetchBanners(): Promise<FireBanner[]> {
  try {
    const snap = await getDocs(
      query(collection(db, 'banners'), orderBy('order', 'asc'))
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as FireBanner));
  } catch (e) {
    console.warn('fetchBanners error:', e);
    return [];
  }
}
