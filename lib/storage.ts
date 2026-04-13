import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, CartItem } from './types';

const WISHLIST_KEY = 'srj_wishlist';
const CART_KEY = 'srj_cart';

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