import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator,
  Animated, Linking, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, Radius } from '../lib/theme';

const STORAGE_KEY = 'SRJ_GOLD_RATES';

// ── Types ─────────────────────────────────────
interface GoldRate {
  label: string;
  purity: string;
  price: number;
}

interface StoredData {
  fields: {
    gold24k: string;
    gold22k: string;
    gold20k: string;
    gold18k: string;
    note: string;
  };
  time: string;
}

// ── Build rates ───────────────────────────────
function buildRates(data: StoredData['fields']): GoldRate[] {
  return [
    { label: '24K Gold', purity: '999', price: Number(data.gold24k) || 0 },
    { label: '22K Gold', purity: '916', price: Number(data.gold22k) || 0 },
    { label: '20K Gold', purity: '833', price: Number(data.gold20k) || 0 },
    { label: '18K Gold', purity: '750', price: Number(data.gold18k) || 0 },
  ].filter(r => r.price > 0);
}

// ── Rate Card ─────────────────────────────────
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
      <Text style={styles.ratePrice}>
        ₹{rate.price.toLocaleString('en-IN')}
      </Text>
    </View>
  );
}

// ── Main Screen ───────────────────────────────
export default function GoldRatesScreen() {
  const [rates, setRates] = useState<GoldRate[]>([]);
  const [note, setNote] = useState('');
  const [lastSaved, setLastSaved] = useState('');
  const [loading, setLoading] = useState(true);

  const fade = useRef(new Animated.Value(0)).current;

  // 🔥 LOAD FROM LOCAL STORAGE
  useEffect(() => {
    const load = async () => {
      try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);

        if (data) {
          const parsed: StoredData = JSON.parse(data);
          setRates(buildRates(parsed.fields));
          setNote(parsed.fields.note || '');
          setLastSaved(parsed.time);
        }
      } catch (e) {
        console.log('Load error', e);
      }

      setLoading(false);
      Animated.timing(fade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true
      }).start();
    };

    load();
  }, []);

  const openWhatsApp = () => {
    const msg = 'Hello! Share gold rate & making charges';
    Linking.openURL(`https://wa.me/918377911745?text=${encodeURIComponent(msg)}`);
  };

  const dateStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Today's Gold Rates</Text>
        <Text style={styles.date}>{dateStr}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        {loading ? (
          <ActivityIndicator size="large" color={Theme.purple} />
        ) : rates.length === 0 ? (
          <Text style={styles.empty}>No rates saved yet</Text>
        ) : (
          <Animated.View style={{ opacity: fade }}>

            {/* Last updated */}
            {!!lastSaved && (
              <Text style={styles.updated}>Updated at {lastSaved}</Text>
            )}

            {/* Note */}
            {!!note && (
              <Text style={styles.note}>{note}</Text>
            )}

            {/* Rates */}
            {rates.map((r, i) => (
              <RateCard key={i} rate={r} />
            ))}

            {/* WhatsApp */}
            <TouchableOpacity style={styles.btn} onPress={openWhatsApp}>
              <Text style={styles.btnText}>Ask on WhatsApp</Text>
            </TouchableOpacity>

          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.bgPrimary },

  header: { padding: 20, backgroundColor: Theme.bgPurple },
  title: { color: '#fff', fontSize: 22, fontWeight: '900' },
  date: { color: '#ccc', marginTop: 4 },

  scroll: { padding: 16 },

  updated: { marginBottom: 10, color: Theme.success },
  note: { marginBottom: 14, color: Theme.textMuted },

  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: Radius.lg,
    marginBottom: 10,
  },

  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },

  purityBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.bgCardPurple,
    alignItems: 'center',
    justifyContent: 'center',
  },

  purityTxt: { fontWeight: '900', color: Theme.purple },

  rateLabel: { fontWeight: '800' },
  rateUnit: { fontSize: 11, color: '#777' },

  ratePrice: { fontWeight: '900', fontSize: 18 },

  btn: {
    backgroundColor: '#25D366',
    padding: 16,
    borderRadius: Radius.lg,
    alignItems: 'center',
    marginTop: 20,
  },

  btnText: { color: '#fff', fontWeight: '900' },

  empty: { textAlign: 'center', marginTop: 40 },
});