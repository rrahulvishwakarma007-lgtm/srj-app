/**
 * goldRateStorage.ts
 * Shared AsyncStorage keys & helpers used by both
 * GoldRatesScreen (admin write) and HomeScreen (read).
 *
 * Import these constants/functions in both screens so
 * they always read/write the exact same storage keys.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEY_24K   = '@srj_gold_rate_24k';
export const STORAGE_KEY_DATE  = '@srj_gold_rate_date';
export const STORAGE_KEY_SILVER = '@srj_silver_rate';

export interface GoldRateData {
  rate24k:    number;   // ₹ per gram for 24K
  rate22k:    number;   // auto-calculated  (24K × 22/24)
  silverRate: number;   // ₹ per gram for silver (0 if not set)
  updatedDate: string;  // "DD/MM/YYYY" string
}

/** Read all rates saved by the admin screen. Returns null if never set. */
export async function loadGoldRates(): Promise<GoldRateData | null> {
  try {
    const [r24, rDate, rSilver] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEY_24K),
      AsyncStorage.getItem(STORAGE_KEY_DATE),
      AsyncStorage.getItem(STORAGE_KEY_SILVER),
    ]);

    if (!r24) return null;

    const rate24k = parseInt(r24, 10);
    return {
      rate24k,
      rate22k:     Math.round(rate24k * (22 / 24)),
      silverRate:  rSilver ? parseInt(rSilver, 10) : 0,
      updatedDate: rDate ?? '',
    };
  } catch (e) {
    console.warn('goldRateStorage: read error', e);
    return null;
  }
}

/** Save all rates (called by admin screen). */
export async function saveGoldRates(
  rate24k: number,
  silverRate: number,
  date: string,
): Promise<void> {
  await AsyncStorage.multiSet([
    [STORAGE_KEY_24K,    String(rate24k)],
    [STORAGE_KEY_DATE,   date],
    [STORAGE_KEY_SILVER, String(silverRate)],
  ]);
}
