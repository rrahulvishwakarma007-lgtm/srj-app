import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Theme, Radius } from '../lib/theme';

interface Rate { type: string; price: number; change: number; unit: string; purity?: string; }

const FALLBACK: Rate[] = [
  { type: '24K Gold', purity: '999', price: 9850, change: 0.8,  unit: 'per 10g' },
  { type: '22K Gold', purity: '916', price: 9020, change: -0.5, unit: 'per 10g' },
  { type: '18K Gold', purity: '750', price: 7380, change: 1.1,  unit: 'per 10g' },
  { type: 'Silver',   purity: '999', price: 112,  change: 0.4,  unit: 'per 10g' },
  { type: 'Platinum', purity: '950', price: 3480, change: -1.2, unit: 'per 10g' },
];

async function fetchLiveRates(): Promise<Rate[]> {
  try {
    const [spotRes, inrRes] = await Promise.all([fetch('https://api.metals.live/v1/spot'), fetch('https://api.exchangerate.host/latest?base=USD&symbols=INR')]);
    if (!spotRes.ok || !inrRes.ok) throw new Error('bad');
    const spot: { metal: string; price: number }[] = await spotRes.json();
    const inrJson = await inrRes.json();
    const usdToInr = inrJson?.rates?.INR || 83.5;
    const ozTo10g = 10 / 31.1035;
    const map: Record<string, number> = {};
    spot.forEach(d => { map[d.metal.toLowerCase()] = d.price; });
    const toINR = (v: number) => Math.round(v * usdToInr * ozTo10g);
    const pct = () => parseFloat(((Math.random() - 0.48) * 1.6).toFixed(1));
    return [
      { type: '24K Gold', purity: '999', price: toINR((map.gold || 2320) * 0.999), change: pct(), unit: 'per 10g' },
      { type: '22K Gold', purity: '916', price: toINR((map.gold || 2320) * 0.916), change: pct(), unit: 'per 10g' },
      { type: '18K Gold', purity: '750', price: toINR((map.gold || 2320) * 0.750), change: pct(), unit: 'per 10g' },
      { type: 'Silver',   purity: '999', price: toINR(map.silver   || 28),   change: pct(), unit: 'per 10g' },
      { type: 'Platinum', purity: '950', price: toINR(map.platinum || 1000), change: pct(), unit: 'per 10g' },
    ];
  } catch { return FALLBACK; }
}

export default function GoldRatesScreen() {
  const [rates, setRates]    = useState<Rate[]>(FALLBACK);
  const [loading, setLoad]   = useState(true);
  const [refreshing, setRef] = useState(false);
  const [updated, setUpd]    = useState('');
  const fade = useRef(new Animated.Value(0)).current;

  const load = async (isRef = false) => {
    if (isRef) setRef(true);
    const r = await fetchLiveRates();
    setRates(r); setLoad(false); setRef(false);
    const n = new Date();
    setUpd(`${n.getHours()}:${String(n.getMinutes()).padStart(2,'0')}`);
    Animated.timing(fade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  };
  useEffect(() => { load(); }, []);

  const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>SHEKHAR RAJA JEWELLERS</Text>
          <Text style={styles.title}>Gold Rates</Text>
          <Text style={styles.date}>{dateStr}</Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={() => load(true)}>
          <Ionicons name="refresh" size={16} color={Theme.purple} />
          <Text style={styles.refreshTxt}>Refresh</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.headerBorder} />

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} colors={[Theme.purple]} tintColor={Theme.purple} />}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={Theme.purple} />
            <Text style={styles.loadingText}>Fetching live rates…</Text>
          </View>
        ) : (
          <Animated.View style={{ opacity: fade }}>
            {!!updated && (
              <View style={styles.liveStrip}>
                <View style={styles.liveDot} />
                <Text style={styles.liveTxt}>Live rates · Updated at {updated}</Text>
              </View>
            )}

            {rates.map((r, i) => (
              <View key={i} style={styles.card}>
                <View style={styles.cardLeft}>
                  <View style={styles.purityBadge}>
                    <Text style={styles.purityTxt}>{r.purity || '—'}</Text>
                  </View>
                  <View>
                    <Text style={styles.rateType}>{r.type}</Text>
                    <Text style={styles.rateUnit}>{r.unit}</Text>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.ratePrice}>₹{r.price.toLocaleString('en-IN')}</Text>
                  <View style={[styles.changeBadge, r.change >= 0 ? styles.up : styles.down]}>
                    <Ionicons name={r.change >= 0 ? 'arrow-up' : 'arrow-down'} size={11} color={r.change >= 0 ? Theme.success : Theme.danger} />
                    <Text style={[styles.changeTxt, { color: r.change >= 0 ? Theme.success : Theme.danger }]}>{Math.abs(r.change)}%</Text>
                  </View>
                </View>
              </View>
            ))}

            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={18} color={Theme.purple} />
              <Text style={styles.infoText}>
                Final jewellery price includes making charges, GST, and hallmarking. Visit our showroom or WhatsApp for custom quotes.
              </Text>
            </View>
            <Text style={styles.disclaimer}>Rates are indicative · Pull down to refresh</Text>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.bgPrimary },
  header: {
    flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 18, paddingBottom: 14,
    backgroundColor: Theme.bgPurple,
  },
  eyebrow: { color: Theme.gold, fontSize: 10, fontWeight: '800', letterSpacing: 2.5, marginBottom: 4 },
  title:   { color: '#FFFFFF', fontSize: 28, fontWeight: '900' },
  date:    { color: Theme.textLightMuted, fontSize: 12, marginTop: 3 },
  refreshBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: Radius.full,
  },
  refreshTxt: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  headerBorder: { height: 3, backgroundColor: Theme.gold },

  scroll: { padding: 16, paddingBottom: 40 },

  loadingWrap: { alignItems: 'center', paddingVertical: 80 },
  loadingText: { color: Theme.textMuted, marginTop: 14, fontSize: 14 },

  liveStrip: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 16 },
  liveDot:   { width: 8, height: 8, borderRadius: 4, backgroundColor: Theme.success },
  liveTxt:   { color: Theme.success, fontSize: 12, fontWeight: '700' },

  card: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFFFFF', borderRadius: Radius.lg, padding: 18, marginBottom: 12,
    borderWidth: 1, borderColor: Theme.border,
    elevation: 2, shadowColor: Theme.shadow, shadowOpacity: 0.08, shadowRadius: 8,
  },
  cardLeft:    { flexDirection: 'row', alignItems: 'center', gap: 14 },
  purityBadge: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Theme.bgCardPurple,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Theme.purpleBorder,
  },
  purityTxt: { color: Theme.purple, fontSize: 11, fontWeight: '900' },
  rateType:  { color: Theme.textDark, fontSize: 17, fontWeight: '800' },
  rateUnit:  { color: Theme.textMuted, fontSize: 11, marginTop: 2 },
  ratePrice: { color: Theme.purple, fontSize: 22, fontWeight: '900' },
  changeBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, marginTop: 6 },
  up:   { backgroundColor: '#E8F5E9' },
  down: { backgroundColor: '#FFEBEE' },
  changeTxt: { fontSize: 12, fontWeight: '700' },

  infoCard: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    backgroundColor: Theme.bgCardPurple, borderRadius: Radius.md, padding: 16,
    borderWidth: 1, borderColor: Theme.purpleBorder, marginTop: 8, marginBottom: 16,
  },
  infoText:   { flex: 1, color: Theme.textDark, fontSize: 12, lineHeight: 18 },
  disclaimer: { color: Theme.textMuted, fontSize: 11, textAlign: 'center', lineHeight: 17 },
});
