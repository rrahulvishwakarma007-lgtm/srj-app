import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'srj_gold_rates';
const RATES_URL = 'https://nxtgenailabs.work/gold-rates.json';

export interface GoldRateData {
  rate24k:     number;
  rate22k:     number;
  rate20k:     number;
  rate18k:     number;
  silverRate:  number;
  updatedDate: string;
}

const DEFAULT_RATES: GoldRateData = {
  rate24k:     0,
  rate22k:     0,
  rate20k:     0,
  rate18k:     0,
  silverRate:  0,
  updatedDate: '',
};

// ── Fetch from website (shared for ALL users) ─────────────────────────────────
async function fetchFromWebsite(): Promise<GoldRateData | null> {
  try {
    const res = await fetch(RATES_URL, {
      headers: { 'Cache-Control': 'no-cache' }, // always get fresh data
    });
    if (!res.ok) return null;
    const data: GoldRateData = await res.json();
    // Cache it locally so app works offline too
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  } catch {
    return null; // network error → fall through to AsyncStorage
  }
}

// ── Load gold rates — URL first, AsyncStorage fallback ────────────────────────
export async function loadGoldRates(): Promise<GoldRateData | null> {
  // 1. Try website first (live shared rates)
  const fromWeb = await fetchFromWebsite();
  if (fromWeb) return fromWeb;

  // 2. Fall back to locally cached rates (offline support)
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as GoldRateData;
  } catch {}

  return DEFAULT_RATES;
}

// ── Save rates locally (used by admin GoldRatesScreen) ───────────────────────
export async function saveGoldRates(data: GoldRateData): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}
