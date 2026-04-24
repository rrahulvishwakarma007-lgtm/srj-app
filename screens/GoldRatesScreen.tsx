import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, RefreshControl, ActivityIndicator,
  Animated, Linking, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Theme, Radius } from '../lib/theme';

// ── Types ─────────────────────────────────────────────────────────────────
interface GoldRate {
  label: string;
  purity: string;
  price: number;
  metal: 'gold' | 'silver' | 'platinum';
}

interface FirestoreRates {
  gold24k: number;
  gold22k: number;
  gold18k: number;
  gold20k: number;
  gold14k: number;
  silver: number;
  platinum: number;
  updatedAt: any;   // Firestore Timestamp
  updatedBy: string;
  note: string;
}

function buildRates(data: FirestoreRates): GoldRate[] {
  return [
    { label: '24K Gold', purity: '999', price: data.gold24k || 0, metal: 'gold' },
    { label: '22K Gold', purity: '916', price: data.gold22k || 0, metal: 'gold' },
    { label: '20K Gold', purity: '833', price: data.gold20k || 0, metal: 'gold' },
    { label: '18K Gold', purity: '750', price: data.gold18k || 0, metal: 'gold' },
  ].filter(r => r.price > 0);
}

// ── Format timestamp ──────────────────────────────────────────────────────
function formatTime(ts: any): string {
  if (!ts) return '';
  try {
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleString('en-IN', {
      day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit',
      hour12: true,
    });
  } catch { return ''; }
}

// ── Rate Card ─────────────────────────────────────────────────────────────
function RateCard({ rate }: { rate: GoldRate }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={styles.purityBadge}>
          <Text style={styles.purityTxt}>{rate.purity}</Text>
        </View>
        <View>
          <Text style={styles.rateLabel}>{rate.label}</Text>
          <Text style={styles.rateUnit}>per 10 grams</Text>
        </View>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.ratePrice}>
          ₹{rate.price.toLocaleString('en-IN')}
        </Text>
        <Text style={styles.rateNote}>incl. duty & GST</Text>
      </View>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────
export default function GoldRatesScreen() {
  const [rates, setRates]       = useState<GoldRate[]>([]);
  const [firestoreData, setFSD] = useState<FirestoreRates | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Real-time listener on goldRates/today document
    const unsubscribe = onSnapshot(
      doc(db, 'goldRates', 'today'),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as FirestoreRates;
          setFSD(data);
          setRates(buildRates(data));
          setError('');
        } else {
          setError('Rates not updated yet. Please check back soon.');
        }
        setLoading(false);
        Animated.timing(fade, { toValue: 1, duration: 400, useNativeDriver: true }).start();
      },
      (err) => {
        console.error('Firestore error:', err);
        setError('Could not fetch rates. Please check your connection.');
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const openWhatsApp = () => {
    const msg = 'Hello Shekhar Raja Jewellers! Could you share today\'s gold rate and making charges?';
    Linking.openURL(`https://wa.me/918377911745?text=${encodeURIComponent(msg)}`).catch(() =>
      Alert.alert('WhatsApp', '+918377911745')
    );
  };

  const dateStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>SHEKHAR RAJA JEWELLERS</Text>
          <Text style={styles.title}>Today's Gold Rates</Text>
          <Text style={styles.date}>{dateStr}</Text>
        </View>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveTxt}>LIVE</Text>
        </View>
      </View>
      <View style={styles.goldLine} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {loading ? (
          <View style={styles.centerWrap}>
            <ActivityIndicator size="large" color={Theme.purple} />
            <Text style={styles.loadingTxt}>Fetching today's rates…</Text>
          </View>
        ) : error ? (
          <View style={styles.centerWrap}>
            <Ionicons name="time-outline" size={52} color={Theme.border} />
            <Text style={styles.errorTxt}>{error}</Text>
            <TouchableOpacity style={styles.waSmallBtn} onPress={openWhatsApp}>
              <Ionicons name="logo-whatsapp" size={16} color="#FFFFFF" />
              <Text style={styles.waSmallTxt}>Ask on WhatsApp</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Animated.View style={{ opacity: fade }}>

            {/* Updated timestamp */}
            {firestoreData?.updatedAt && (
              <View style={styles.updatedStrip}>
                <Ionicons name="checkmark-circle" size={15} color={Theme.success} />
                <Text style={styles.updatedTxt}>
                  Updated {formatTime(firestoreData.updatedAt)}
                  {firestoreData.updatedBy ? `  ·  ${firestoreData.updatedBy}` : ''}
                </Text>
              </View>
            )}

            {/* Note from jeweller */}
            {!!firestoreData?.note && (
              <View style={styles.noteCard}>
                <Ionicons name="information-circle-outline" size={16} color={Theme.purple} />
                <Text style={styles.noteText}>{firestoreData.note}</Text>
              </View>
            )}

            {/* Gold rates */}
            <Text style={styles.sectionLabel}>GOLD RATES</Text>
            {rates.filter(r => r.metal === 'gold').map((r, i) => (
              <RateCard key={i} rate={r} />
            ))}

            {/* Silver & Platinum */}
            {rates.filter(r => r.metal !== 'gold').length > 0 && (
              <>
                <Text style={[styles.sectionLabel, { marginTop: 20 }]}>SILVER & PLATINUM</Text>
                {rates.filter(r => r.metal !== 'gold').map((r, i) => (
                  <RateCard key={i} rate={r} />
                ))}
              </>
            )}

            {/* Making charges info */}
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>About These Rates</Text>
              {[
                'Rates shown are as per IBJA / local Jabalpur market rates',
                'Making charges are additional and vary by design',
                'Prices include 15% import duty + 3% GST',
                'Rates updated every morning by our team',
              ].map((line, i) => (
                <View key={i} style={styles.infoRow}>
                  <View style={styles.infoDot} />
                  <Text style={styles.infoLine}>{line}</Text>
                </View>
              ))}
            </View>

            {/* WhatsApp CTA */}
            <TouchableOpacity style={styles.waCard} onPress={openWhatsApp} activeOpacity={0.88}>
              <View style={styles.waLeft}>
                <Ionicons name="logo-whatsapp" size={24} color="#FFFFFF" />
                <View>
                  <Text style={styles.waTitle}>Get Exact Quote</Text>
                  <Text style={styles.waSub}>WhatsApp us for rate + making charges</Text>
                </View>
              </View>
              <Ionicons name="arrow-forward" size={18} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              Rates are indicative and set by Shekhar Raja Jewellers each morning.
              Final price may vary based on design and making charges.
            </Text>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.bgPrimary },

  header: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 18, paddingBottom: 16,
    backgroundColor: Theme.bgPurple,
  },
  eyebrow:  { color: Theme.gold, fontSize: 10, fontWeight: '800', letterSpacing: 2.5, marginBottom: 4 },
  title:    { color: '#FFFFFF', fontSize: 26, fontWeight: '900' },
  date:     { color: Theme.textLightMuted, fontSize: 11, marginTop: 3 },
  liveBadge:{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(46,125,50,0.25)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full, borderWidth: 1, borderColor: 'rgba(46,125,50,0.5)' },
  liveDot:  { width: 7, height: 7, borderRadius: 4, backgroundColor: Theme.success },
  liveTxt:  { color: Theme.success, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  goldLine: { height: 3, backgroundColor: Theme.gold },

  scroll: { padding: 16, paddingBottom: 50 },

  centerWrap:  { alignItems: 'center', paddingVertical: 80 },
  loadingTxt:  { color: Theme.textMuted, marginTop: 16, fontSize: 14, fontWeight: '600' },
  errorTxt:    { color: Theme.textMuted, marginTop: 16, fontSize: 14, textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 },

  updatedStrip: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 14 },
  updatedTxt:   { color: Theme.success, fontSize: 12, fontWeight: '700' },

  noteCard: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    backgroundColor: Theme.bgCardPurple, borderRadius: Radius.md, padding: 14,
    borderWidth: 1, borderColor: Theme.purpleBorder, marginBottom: 16,
  },
  noteText: { flex: 1, color: Theme.textDark, fontSize: 13, lineHeight: 19 },

  sectionLabel: { color: Theme.purple, fontSize: 11, fontWeight: '800', letterSpacing: 3, marginBottom: 10 },

  card: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFFFFF', borderRadius: Radius.lg, padding: 18, marginBottom: 10,
    borderWidth: 1, borderColor: Theme.border,
    elevation: 2, shadowColor: Theme.shadow, shadowOpacity: 0.08, shadowRadius: 8,
  },
  cardLeft:    { flexDirection: 'row', alignItems: 'center', gap: 14 },
  purityBadge: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: Theme.bgCardPurple,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: Theme.purpleBorder,
  },
  purityTxt:  { color: Theme.purple, fontSize: 11, fontWeight: '900', letterSpacing: 0.5 },
  rateLabel:  { color: Theme.textDark, fontSize: 17, fontWeight: '800' },
  rateUnit:   { color: Theme.textMuted, fontSize: 11, marginTop: 2 },
  ratePrice:  { color: Theme.purple, fontSize: 22, fontWeight: '900', letterSpacing: 0.3 },
  rateNote:   { color: Theme.textMuted, fontSize: 10, marginTop: 3 },

  infoCard: {
    backgroundColor: '#FFFFFF', borderRadius: Radius.lg, padding: 18,
    borderWidth: 1, borderColor: Theme.border, marginTop: 20, marginBottom: 14,
  },
  infoTitle: { color: Theme.textDark, fontSize: 14, fontWeight: '800', marginBottom: 12 },
  infoRow:   { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  infoDot:   { width: 6, height: 6, borderRadius: 3, backgroundColor: Theme.gold, marginTop: 6 },
  infoLine:  { flex: 1, color: Theme.textMuted, fontSize: 12, lineHeight: 18 },

  waCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#25D366', borderRadius: Radius.lg, padding: 18, marginBottom: 16,
    elevation: 4, shadowColor: '#25D366', shadowOpacity: 0.3, shadowRadius: 10,
  },
  waLeft:  { flexDirection: 'row', alignItems: 'center', gap: 14 },
  waTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  waSub:   { color: 'rgba(255,255,255,0.85)', fontSize: 11, marginTop: 2 },

  waSmallBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#25D366', paddingVertical: 12, paddingHorizontal: 20,
    borderRadius: Radius.full, marginTop: 16,
  },
  waSmallTxt: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },

  disclaimer: { color: Theme.textMuted, fontSize: 11, textAlign: 'center', lineHeight: 17 },
});
