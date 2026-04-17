import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, CartItem } from './types';

const WISHLIST_KEY = 'srj_wishlist';
const CART_KEY = 'srj_cart';
const REF_KEY = 'srj_ref_prices'; // { [productId]: originalPrice }

export const loadWishlist = async (): Promise<Product[]> => {
  try {
    const data = await AsyncStorage.getItem(WISHLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveWishlist = async (items: Product[]): Promise<void> => {
  await AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
};

export const loadCart = async (): Promise<CartItem[]> => {
  try {
    const data = await AsyncStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveCart = async (items: CartItem[]): Promise<void> => {
  await AsyncStorage.setItem(CART_KEY, JSON.stringify(items));
};

// Reference prices (price when item was added to wishlist)
export const loadRefPrices = async (): Promise<Record<number, number>> => {
  try { const d = await AsyncStorage.getItem(REF_KEY); return d ? JSON.parse(d) : {}; } catch { return {}; }
};
export const saveRefPrices = async (refs: Record<number, number>): Promise<void> => {
  await AsyncStorage.setItem(REF_KEY, JSON.stringify(refs));
};
export const setRefPrice = async (id: number, price: number): Promise<void> => {
  const refs = await loadRefPrices(); refs[id] = price; await saveRefPrices(refs);
};