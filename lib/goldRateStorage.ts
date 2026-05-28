import AsyncStorage from '@react-native-async-storage/async-storage';

// ── These keys must match exactly what GoldRatesScreen writes ─────────────────
const KEY_24K   = '@srj_gold_rate_24k';
const KEY_DATE  = '@srj_gold_rate_date';
const KEY_SILV  = '@srj_silver_rate';

export interface GoldRateData {
  rate24k:     number;
  rate22k:     number;
  rate20k:     number;
  rate18k:     number;
  silverRate:  number;
  updatedDate: string;
}

// ── Load gold rates — reads the same keys GoldRatesScreen saves ───────────────
export async function loadGoldRates(): Promise<GoldRateData | null> {
  try {
    const [s24k, sDate, sSilv] = await Promise.all([
      AsyncStorage.getItem(KEY_24K),
      AsyncStorage.getItem(KEY_DATE),
      AsyncStorage.getItem(KEY_SILV),
    ]);

    const rate24k = s24k ? parseInt(s24k, 10) : 0;

    return {
      rate24k,
      rate22k:     rate24k > 0 ? Math.round(rate24k * 22 / 24) : 0,
      rate20k:     rate24k > 0 ? Math.round(rate24k * 20 / 24) : 0,
      rate18k:     rate24k > 0 ? Math.round(rate24k * 18 / 24) : 0,
      silverRate:  sSilv ? parseInt(sSilv, 10) : 0,
      updatedDate: sDate || '',
    };
  } catch {
    return null;
  }
}

// ── Save rates — writes the same keys so GoldRatesScreen stays in sync ────────
export async function saveGoldRates(data: GoldRateData): Promise<void> {
  try {
    await Promise.all([
      AsyncStorage.setItem(KEY_24K,  String(data.rate24k)),
      AsyncStorage.setItem(KEY_DATE, data.updatedDate),
      AsyncStorage.setItem(KEY_SILV, String(data.silverRate)),
    ]);
  } catch {}
}
