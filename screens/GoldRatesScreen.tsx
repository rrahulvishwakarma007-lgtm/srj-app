import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Animated, Alert, Platform,
  KeyboardAvoidingView, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: W } = Dimensions.get('window');

const STORAGE_KEY  = '@srj_gold_rate_24k';
const DATE_KEY     = '@srj_gold_rate_date';
const SILVER_KEY   = '@srj_silver_rate';
const ADMIN_SECRET = 5;
const ADMIN_PIN    = '1234';
const RATES_URL    = 'https://nxtgenailabs.work/gold-rates.json';

const GOLD        = '#C9A84C';
const GOLD_LIGHT  = '#F0D080';
const GOLD_DIM    = 'rgba(201,168,76,0.25)';
const PURPLE_DARK = '#2D1B5E';
const PURPLE_MID  = '#4A2080';
const BG          = '#F0EBFF';
const BG_CARD     = '#FFFFFF';
const BORDER      = '#DDD5F0';
const TEXT_DARK   = '#1A0A3E';
const TEXT_MID    = '#4A3570';
const TEXT_LIGHT  = '#8B7BAF';
const GREEN       = '#16a34a';
const RED         = '#dc2626';

const KARATS = [
  { k: '24K', purity: '999.9', mul: 1,     featured: false, color: '#b8892a' },
  { k: '22K', purity: '916',   mul: 22/24, featured: true,  color: GOLD      },
  { k: '20K', purity: '833',   mul: 20/24, featured: false, color: '#a07820' },
  { k: '18K', purity: '750',   mul: 18/24, featured: false, color: '#8a6818' },
];

// ── Ticker item ───────────────────────────────────────────────────────────────
function TickerItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={tickerStyles.item}>
      <Text style={tickerStyles.label}>{label}</Text>
      <Text style={tickerStyles.sep}>·</Text>
      <Text style={tickerStyles.value}>{value}</Text>
    </View>
  );
}
const tickerStyles = StyleSheet.create({
  item:  { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 },
  label: { color: '#6a4a18', fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },
  sep:   { color: '#3a2200', marginHorizontal: 6, fontSize: 12 },
  value: { color: '#e8c84a', fontSize: 13, fontWeight: '800', letterSpacing: 0.5 },
});

// ── PIN Dots ──────────────────────────────────────────────────────────────────
function PinDots({ length, filled }: { length: number; filled: number }) {
  return (
    <View style={pinStyles.dotsRow}>
      {Array.from({ length }).map((_, i) => (
        <View key={i} style={[pinStyles.dot, i < filled ? pinStyles.dotFilled : pinStyles.dotEmpty]} />
      ))}
    </View>
  );
}

// ── PIN Pad ───────────────────────────────────────────────────────────────────
function PinPad({ onSuccess, onClose, shake }: {
  onSuccess: () => void; onClose: () => void; shake: Animated.Value;
}) {
  const [pin, setPin]           = useState('');
  const [error, setError]       = useState(false);
  const [attempts, setAttempts] = useState(0);

  const press = (digit: string) => {
    if (pin.length >= 4) return;
    const next = pin + digit;
    setPin(next);
    setError(false);
    if (next.length === 4) {
      setTimeout(() => {
        if (next === ADMIN_PIN) {
          onSuccess();
        } else {
          setAttempts(a => a + 1);
          setError(true);
          setPin('');
          Animated.sequence([
            Animated.timing(shake, { toValue: 10,  duration: 60, useNativeDriver: true }),
            Animated.timing(shake, { toValue: -10, duration: 60, useNativeDriver: true }),
            Animated.timing(shake, { toValue: 8,   duration: 50, useNativeDriver: true }),
            Animated.timing(shake, { toValue: -8,  duration: 50, useNativeDriver: true }),
            Animated.timing(shake, { toValue: 0,   duration: 40, useNativeDriver: true }),
          ]).start();
        }
      }, 120);
    }
  };

  const del = () => { setPin(p => p.slice(0, -1)); setError(false); };
  const KEYS = [['1','2','3'],['4','5','6'],['7','8','9'],['','0','⌫']];

  return (
    <View style={pinStyles.wrap}>
      <View style={pinStyles.lockCircle}>
        <Ionicons name="lock-closed" size={28} color={GOLD} />
      </View>
      <Text style={pinStyles.title}>Admin Access</Text>
      <Text style={pinStyles.subtitle}>Enter your 4-digit PIN to continue</Text>
      <Animated.View style={{ transform: [{ translateX: shake }] }}>
        <PinDots length={4} filled={pin.length} />
        {error && <Text style={pinStyles.errorText}>Incorrect PIN{attempts > 1 ? ` (${attempts} attempts)` : ''}</Text>}
      </Animated.View>
      <View style={pinStyles.padWrap}>
        {KEYS.map((row, ri) => (
          <View key={ri} style={pinStyles.padRow}>
            {row.map((key, ki) => {
              if (key === '') return <View key={ki} style={pinStyles.keyEmpty} />;
              const isBack = key === '⌫';
              return (
                <TouchableOpacity key={ki} style={[pinStyles.key, isBack && pinStyles.keyBack]} onPress={() => isBack ? del() : press(key)} activeOpacity={0.65}>
                  {isBack ? <Ionicons name="backspace-outline" size={22} color={TEXT_MID} /> : <Text style={pinStyles.keyText}>{key}</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
      <TouchableOpacity onPress={onClose} style={pinStyles.cancelBtn}>
        <Text style={pinStyles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const pinStyles = StyleSheet.create({
  wrap:       { alignItems: 'center', paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16 },
  lockCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: GOLD_DIM, borderWidth: 1.5, borderColor: GOLD + '60', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  title:      { fontSize: 20, fontWeight: '800', color: TEXT_DARK, letterSpacing: 0.5, marginBottom: 4 },
  subtitle:   { fontSize: 13, color: TEXT_LIGHT, marginBottom: 24 },
  dotsRow:    { flexDirection: 'row', gap: 16, justifyContent: 'center', marginBottom: 8 },
  dot:        { width: 16, height: 16, borderRadius: 8, borderWidth: 2 },
  dotEmpty:   { borderColor: BORDER, backgroundColor: 'transparent' },
  dotFilled:  { borderColor: GOLD, backgroundColor: GOLD },
  errorText:  { color: RED, fontSize: 12, textAlign: 'center', marginTop: 6, fontWeight: '600' },
  padWrap:    { marginTop: 20, gap: 10, width: '100%', alignItems: 'center' },
  padRow:     { flexDirection: 'row', gap: 16 },
  key:        { width: 72, height: 56, borderRadius: 14, backgroundColor: BG, borderWidth: 1, borderColor: BORDER, alignItems: 'center', justifyContent: 'center' },
  keyBack:    { backgroundColor: '#FFF0F0', borderColor: '#FFCCCC' },
  keyEmpty:   { width: 72, height: 56 },
  keyText:    { fontSize: 22, fontWeight: '700', color: TEXT_DARK },
  cancelBtn:  { marginTop: 20, paddingVertical: 8, paddingHorizontal: 24 },
  cancelText: { color: TEXT_LIGHT, fontSize: 14, fontWeight: '600' },
});

// ── Rate Card with live fluctuation ──────────────────────────────────────────
function RateCard({ k, purity, price, featured, color, change }: {
  k: string; purity: string; price: number;
  featured: boolean; color: string; change: number;
}) {
  const scale    = useRef(new Animated.Value(1)).current;
  const flashClr = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse scale on every price tick
    Animated.sequence([
      Animated.timing(scale,    { toValue: 1.025, duration: 160, useNativeDriver: true }),
      Animated.spring(scale,    { toValue: 1,     friction: 5,   useNativeDriver: true }),
    ]).start();
    // Flash card bg green or red briefly
    Animated.sequence([
      Animated.timing(flashClr, { toValue: 1, duration: 150, useNativeDriver: false }),
      Animated.timing(flashClr, { toValue: 0, duration: 700, useNativeDriver: false }),
    ]).start();
  }, [price]);

  const flashBg = flashClr.interpolate({
    inputRange:  [0, 1],
    outputRange: ['rgba(0,0,0,0)', change >= 0 ? 'rgba(22,163,74,0.07)' : 'rgba(220,38,38,0.07)'],
  });

  return (
    <Animated.View style={[
      styles.rateCard,
      featured && styles.rateCardFeatured,
      { transform: [{ scale }], backgroundColor: flashBg as any },
    ]}>
      {featured && (
        <View style={styles.popularTag}>
          <Text style={styles.popularText}>MOST POPULAR</Text>
        </View>
      )}
      <View style={styles.rateCardLeft}>
        <View style={[styles.karatBadge, { borderColor: color + '60', backgroundColor: color + '15' }]}>
          <Text style={[styles.karatNum, { color }]}>{k.replace('K','')}</Text>
          <Text style={[styles.karatK,  { color }]}>K</Text>
        </View>
        <View>
          <Text style={styles.rateCardTitle}>{k} Gold</Text>
          <Text style={styles.rateCardPurity}>{purity} Fineness</Text>
        </View>
      </View>
      <View style={styles.rateCardRight}>
        <Text style={styles.ratePerGram}>per gram</Text>
        <Text style={[styles.ratePrice, { color }]}>₹{price.toLocaleString('en-IN')}</Text>
        {/* ── Live change indicator ── */}
        <View style={styles.changeRow}>
          <Ionicons
            name={change >= 0 ? 'caret-up' : 'caret-down'}
            size={10}
            color={change >= 0 ? GREEN : RED}
          />
          <Text style={[styles.changeText, { color: change >= 0 ? GREEN : RED }]}>
            {change >= 0 ? '+' : ''}{change}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function GoldRatesScreen() {
  const insets = useSafeAreaInsets();

  const [rate24k,     setRate24k]     = useState(0);
  const [silverRate,  setSilverRate]  = useState(0);
  const [updatedDate, setUpdatedDate] = useState('');
  const [adminOpen,   setAdminOpen]   = useState(false);
  const [adminStep,   setAdminStep]   = useState<'pin' | 'form'>('pin');
  const [inputRate,   setInputRate]   = useState('');
  const [inputSilver, setInputSilver] = useState('');
  const [inputDate,   setInputDate]   = useState('');
  const [tapCount,    setTapCount]    = useState(0);
  const [saving,      setSaving]      = useState(false);
  const [savedFlash,  setSavedFlash]  = useState(false);

  // ── FLUCTUATION: ±1 or ±2 per karat, updated every 3 seconds ─────────────
  const [fluctuation, setFluctuation] = useState<Record<string, number>>({
    '24K': 0, '22K': 0, '20K': 0, '18K': 0,
  });

  const tapTimer  = useRef<any>(null);
  const tickerX   = useRef(new Animated.Value(0)).current;
  const adminAnim = useRef(new Animated.Value(0)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // ── Load rates: website first, AsyncStorage fallback ─────────────────────
  useEffect(() => {
    const loadRates = async () => {
      try {
        const res = await fetch(RATES_URL, { headers: { 'Cache-Control': 'no-cache' } });
        if (res.ok) {
          const data = await res.json();
          if (data.rate24k) {
            setRate24k(data.rate24k);
            setSilverRate(data.silverRate || 0);
            setUpdatedDate(data.updatedDate || '');
            await AsyncStorage.setItem(STORAGE_KEY, String(data.rate24k));
            await AsyncStorage.setItem(DATE_KEY,    data.updatedDate || '');
            await AsyncStorage.setItem(SILVER_KEY,  String(data.silverRate || 0));
            return;
          }
        }
      } catch (_) {}
      try {
        const s24k   = await AsyncStorage.getItem(STORAGE_KEY);
        const sDate  = await AsyncStorage.getItem(DATE_KEY);
        const sSilv  = await AsyncStorage.getItem(SILVER_KEY);
        if (s24k)  setRate24k(parseInt(s24k));
        if (sDate) setUpdatedDate(sDate);
        if (sSilv) setSilverRate(parseInt(sSilv));
      } catch (e) { console.warn('GoldRates load error', e); }
    };
    loadRates();
    const refresh = setInterval(loadRates, 5 * 60 * 1000);
    return () => clearInterval(refresh);
  }, []);

  // ── LIVE FLUCTUATION ENGINE ───────────────────────────────────────────────
  // Runs every 3s. Each karat moves ±1 or ±2 independently.
  // No rebuild needed — this runs in JS on the device.
  useEffect(() => {
    if (rate24k === 0) return; // don't flicker before rates load
    const interval = setInterval(() => {
      const next: Record<string, number> = {};
      KARATS.forEach(k => {
        const sign   = Math.random() > 0.5 ? 1 : -1;
        const amount = Math.random() > 0.65 ? 2 : 1;
        next[k.k] = sign * amount;
      });
      setFluctuation(next);
    }, 3000);
    return () => clearInterval(interval);
  }, [rate24k]);

  // ── Ticker scroll (JS-driven, works on Android APK) ──────────────────────
  useEffect(() => {
    let pos = 0; let raf: any;
    const step = () => {
      pos += 0.6;
      if (pos > W * 4) pos = 0;
      tickerX.setValue(-pos);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [rate24k]);

  // ── Secret tap unlock ─────────────────────────────────────────────────────
  const handleLogoTap = () => {
    const next = tapCount + 1;
    setTapCount(next);
    clearTimeout(tapTimer.current);
    if (next >= ADMIN_SECRET) { setTapCount(0); openAdmin(); }
    else tapTimer.current = setTimeout(() => setTapCount(0), 2000);
  };

  const openAdmin = () => {
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    setInputRate(rate24k > 0 ? String(rate24k) : '');
    setInputSilver(silverRate > 0 ? String(silverRate) : '');
    setInputDate(updatedDate || today);
    setAdminStep('pin');
    setAdminOpen(true);
    Animated.spring(adminAnim, { toValue: 1, friction: 7, tension: 50, useNativeDriver: true }).start();
  };

  const closeAdmin = () => {
    Animated.timing(adminAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => {
      setAdminOpen(false); setAdminStep('pin');
    });
  };

  const onPinSuccess = () => setAdminStep('form');

  const saveRates = async () => {
    const parsed = parseInt(inputRate.replace(/,/g, ''));
    if (!parsed || parsed < 1000 || parsed > 20000) {
      Alert.alert('Invalid Rate', 'Please enter a valid 24K rate (₹1,000 – ₹20,000 per gram).');
      return;
    }
    setSaving(true);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, String(parsed));
      await AsyncStorage.setItem(DATE_KEY, inputDate || new Date().toLocaleDateString('en-IN'));
      const parsedSilver = parseInt(inputSilver.replace(/,/g, ''));
      if (parsedSilver > 0) await AsyncStorage.setItem(SILVER_KEY, String(parsedSilver));
      setRate24k(parsed);
      setUpdatedDate(inputDate);
      if (parsedSilver > 0) setSilverRate(parsedSilver);
      setSavedFlash(true);
      Animated.sequence([
        Animated.timing(flashAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.delay(1200),
        Animated.timing(flashAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => setSavedFlash(false));
      setTimeout(closeAdmin, 400);
    } catch {
      Alert.alert('Error', 'Could not save rate. Please try again.');
    } finally { setSaving(false); }
  };

  // ── Rates with fluctuation applied ───────────────────────────────────────
  const rates = KARATS.map(k => ({
    ...k,
    price:  rate24k > 0 ? Math.round(rate24k * k.mul) + (fluctuation[k.k] || 0) : 0,
    change: fluctuation[k.k] || 0,
  }));

  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLogoTap} activeOpacity={0.8} style={styles.headerLeft}>
          <View style={styles.headerIconWrap}>
            <Ionicons name="trending-up" size={20} color={GOLD} />
            {tapCount > 0 && tapCount < ADMIN_SECRET && (
              <View style={styles.tapHint}>
                <Text style={styles.tapHintText}>{ADMIN_SECRET - tapCount}</Text>
              </View>
            )}
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.headerTitle}>Gold Rates</Text>
            <Text style={styles.headerSub}>SHEKHAR RAJA JEWELLERS</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.liveDot}>
          <View style={styles.livePulse} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      {/* ── TICKER ── */}
      {rate24k > 0 && (
        <View style={styles.tickerWrap}>
          <View style={styles.tickerBadge}>
            <Text style={styles.tickerBadgeText}>◆ TODAY</Text>
          </View>
          <View style={styles.tickerViewport}>
            <Animated.View style={[styles.tickerTrack, { transform: [{ translateX: tickerX }] }]}>
              {[...rates, ...rates, ...rates].map((r, i) => (
                <TickerItem key={i} label={r.k + ' GOLD'} value={`₹${r.price.toLocaleString('en-IN')}/g`} />
              ))}
              {silverRate > 0 && [...Array(3)].map((_, i) => (
                <TickerItem key={`s${i}`} label="SILVER" value={`₹${silverRate.toLocaleString('en-IN')}/g`} />
              ))}
            </Animated.View>
          </View>
        </View>
      )}

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">

        {/* DATE ROW */}
        <View style={styles.dateRow}>
          <View style={styles.dateLeft}>
            <Ionicons name="calendar-outline" size={14} color={PURPLE_MID} />
            <Text style={styles.dateText}>{todayFormatted}</Text>
          </View>
          {updatedDate ? (
            <View style={styles.updatedBadge}>
              <Ionicons name="checkmark-circle" size={12} color={GREEN} />
              <Text style={styles.updatedText}>Updated {updatedDate}</Text>
            </View>
          ) : (
            <View style={[styles.updatedBadge, { borderColor: '#fca5a5', backgroundColor: '#fef2f2' }]}>
              <Ionicons name="alert-circle" size={12} color={RED} />
              <Text style={[styles.updatedText, { color: RED }]}>Not updated yet</Text>
            </View>
          )}
        </View>

        {/* RATE CARDS */}
        {rate24k > 0 ? (
          <View style={styles.cardsWrap}>
            {rates.map(r => (
              <RateCard key={r.k} k={r.k} purity={r.purity} price={r.price} featured={r.featured} color={r.color} change={r.change} />
            ))}
            {silverRate > 0 && (
              <View style={[styles.rateCard, { borderColor: 'rgba(150,150,180,0.3)' }]}>
                <View style={styles.rateCardLeft}>
                  <View style={[styles.karatBadge, { borderColor: '#9090b060', backgroundColor: '#9090b015' }]}>
                    <Text style={[styles.karatNum, { color: '#6060a0', fontSize: 14 }]}>Ag</Text>
                  </View>
                  <View>
                    <Text style={styles.rateCardTitle}>Silver</Text>
                    <Text style={styles.rateCardPurity}>999 Fine</Text>
                  </View>
                </View>
                <View style={styles.rateCardRight}>
                  <Text style={styles.ratePerGram}>per gram</Text>
                  <Text style={[styles.ratePrice, { color: '#7070b0' }]}>₹{silverRate.toLocaleString('en-IN')}</Text>
                  <Text style={styles.rateTax}>incl. taxes</Text>
                </View>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIcon}>
              <Ionicons name="trending-up" size={36} color={GOLD} />
            </View>
            <Text style={styles.emptyTitle}>Loading Rates...</Text>
            <Text style={styles.emptyText}>Fetching live gold rates. Please check your internet connection.</Text>
          </View>
        )}

        {/* PURITY INFO */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>◆ About Gold Purity</Text>
          {[
            { k:'24K', desc:'99.9% pure — investment grade gold' },
            { k:'22K', desc:'91.6% pure — BIS 916 hallmark jewellery' },
            { k:'20K', desc:'83.3% pure — traditional ornaments' },
            { k:'18K', desc:'75.0% pure — diamond-set jewellery' },
          ].map(item => (
            <View key={item.k} style={styles.infoRow}>
              <Text style={styles.infoK}>{item.k}</Text>
              <Text style={styles.infoDesc}>{item.desc}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.disclaimer}>
          ⚠️ Rates shown include minor live fluctuations for display. Final price may vary based on making charges, wastage and GST.
        </Text>

        <TouchableOpacity onPress={handleLogoTap} style={styles.adminHint} activeOpacity={1} />

      </ScrollView>

      {/* ADMIN PANEL */}
      {adminOpen && (
        <KeyboardAvoidingView style={StyleSheet.absoluteFill} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TouchableOpacity style={styles.adminBackdrop} onPress={closeAdmin} activeOpacity={1} />
          <Animated.View style={[styles.adminSheet, { transform: [{ translateY: adminAnim.interpolate({ inputRange:[0,1], outputRange:[600,0] }) }] }]}>
            <View style={styles.sheetHandle} />

            {adminStep === 'pin' && <PinPad onSuccess={onPinSuccess} onClose={closeAdmin} shake={shakeAnim} />}

            {adminStep === 'form' && (
              <>
                <View style={styles.adminHeader}>
                  <View>
                    <Text style={styles.adminTitle}>◆ Update Gold Rates</Text>
                    <Text style={styles.adminSub}>Saves locally + fetched from nxtgenailabs.work</Text>
                  </View>
                  <TouchableOpacity onPress={closeAdmin} style={styles.adminClose}>
                    <Ionicons name="close" size={20} color={TEXT_DARK} />
                  </TouchableOpacity>
                </View>
                <View style={styles.goldTopBar} />
                <ScrollView style={{ flex:1 }} contentContainerStyle={styles.adminBody} keyboardShouldPersistTaps="handled">

                  <Text style={styles.fieldLabel}>24K GOLD RATE (₹ per gram) *</Text>
                  <View style={styles.fieldRow}>
                    <Text style={styles.rupee}>₹</Text>
                    <TextInput style={styles.fieldInput} placeholder="e.g. 7500" placeholderTextColor={TEXT_LIGHT} keyboardType="numeric" value={inputRate} onChangeText={setInputRate} autoFocus />
                    <Text style={styles.perGramLabel}>/gram</Text>
                  </View>

                  {parseInt(inputRate) > 0 && (
                    <View style={styles.previewBox}>
                      <Text style={styles.previewTitle}>Preview — Auto-calculated</Text>
                      <View style={styles.previewGrid}>
                        {KARATS.map(k => {
                          const p = Math.round(parseInt(inputRate.replace(/,/g,'')) * k.mul);
                          return (
                            <View key={k.k} style={styles.previewItem}>
                              <Text style={[styles.previewK, { color: k.color }]}>{k.k}</Text>
                              <Text style={styles.previewPrice}>₹{p.toLocaleString('en-IN')}</Text>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  )}

                  <Text style={[styles.fieldLabel, { marginTop: 16 }]}>SILVER RATE (₹ per gram) — Optional</Text>
                  <View style={styles.fieldRow}>
                    <Text style={styles.rupee}>₹</Text>
                    <TextInput style={styles.fieldInput} placeholder="e.g. 95" placeholderTextColor={TEXT_LIGHT} keyboardType="numeric" value={inputSilver} onChangeText={setInputSilver} />
                    <Text style={styles.perGramLabel}>/gram</Text>
                  </View>

                  <Text style={[styles.fieldLabel, { marginTop: 16 }]}>RATE DATE</Text>
                  <View style={styles.fieldRow}>
                    <Ionicons name="calendar-outline" size={16} color={TEXT_LIGHT} style={{ marginRight: 8 }} />
                    <TextInput style={[styles.fieldInput, { flex:1 }]} placeholder="DD/MM/YYYY" placeholderTextColor={TEXT_LIGHT} value={inputDate} onChangeText={setInputDate} />
                  </View>

                  <TouchableOpacity style={[styles.saveBtn, saving && { opacity:0.6 }]} onPress={saveRates} disabled={saving} activeOpacity={0.85}>
                    <Ionicons name="checkmark-circle" size={20} color={PURPLE_DARK} />
                    <Text style={styles.saveBtnText}>{saving ? 'SAVING...' : 'SAVE & PUBLISH RATES'}</Text>
                  </TouchableOpacity>

                  <Text style={styles.adminNote}>
                    🌐 Live rates fetched from nxtgenailabs.work/gold-rates.json — edit on GitHub to update all users instantly without rebuilding the APK.
                  </Text>
                </ScrollView>
              </>
            )}
          </Animated.View>
        </KeyboardAvoidingView>
      )}

      {/* SUCCESS FLASH */}
      {savedFlash && (
        <Animated.View style={[styles.flash, { opacity: flashAnim }]}>
          <Ionicons name="checkmark-circle" size={18} color={GOLD} />
          <Text style={styles.flashText}>RATES UPDATED ✓</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex:1, backgroundColor:BG },

  header:         { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:18, paddingVertical:12, backgroundColor:PURPLE_DARK, borderBottomWidth:1, borderBottomColor:PURPLE_MID },
  headerLeft:     { flexDirection:'row', alignItems:'center' },
  headerIconWrap: { position:'relative', width:36, height:36, borderRadius:18, backgroundColor:'rgba(201,168,76,0.15)', alignItems:'center', justifyContent:'center' },
  headerTitle:    { fontSize:17, fontWeight:'800', color:'#fff', letterSpacing:0.3 },
  headerSub:      { fontSize:9, color:GOLD, letterSpacing:2, fontWeight:'700', marginTop:1 },
  tapHint:        { position:'absolute', top:-4, right:-4, backgroundColor:RED, borderRadius:8, width:16, height:16, alignItems:'center', justifyContent:'center' },
  tapHintText:    { color:'#fff', fontSize:9, fontWeight:'800' },
  liveDot:        { flexDirection:'row', alignItems:'center', gap:5, backgroundColor:'rgba(22,163,74,0.12)', borderRadius:99, paddingHorizontal:10, paddingVertical:4 },
  livePulse:      { width:7, height:7, borderRadius:4, backgroundColor:GREEN },
  liveText:       { color:GREEN, fontSize:10, fontWeight:'800', letterSpacing:1.5 },

  tickerWrap:      { flexDirection:'row', alignItems:'center', backgroundColor:'#1A0A00', height:36, overflow:'hidden' },
  tickerBadge:     { backgroundColor:GOLD, paddingHorizontal:10, height:'100%', alignItems:'center', justifyContent:'center' },
  tickerBadgeText: { color:'#1A0A00', fontSize:9, fontWeight:'900', letterSpacing:1.5 },
  tickerViewport:  { flex:1, overflow:'hidden' },
  tickerTrack:     { flexDirection:'row', alignItems:'center', height:36 },

  scroll: { flex:1 },

  dateRow:      { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:16, paddingVertical:10 },
  dateLeft:     { flexDirection:'row', alignItems:'center', gap:5 },
  dateText:     { fontSize:12, color:TEXT_MID, fontWeight:'500' },
  updatedBadge: { flexDirection:'row', alignItems:'center', gap:4, backgroundColor:'#f0fdf4', borderWidth:1, borderColor:'#bbf7d0', borderRadius:20, paddingHorizontal:8, paddingVertical:3 },
  updatedText:  { fontSize:11, color:GREEN, fontWeight:'600' },

  cardsWrap:        { paddingHorizontal:14, gap:10, marginTop:4 },
  rateCard:         { borderRadius:16, borderWidth:1, borderColor:BORDER, padding:14, flexDirection:'row', alignItems:'center', justifyContent:'space-between', backgroundColor:BG_CARD },
  rateCardFeatured: { borderColor:GOLD+'80', backgroundColor:'#FFFDF5', shadowColor:GOLD, shadowOffset:{width:0,height:2}, shadowOpacity:0.15, shadowRadius:8, elevation:3 },
  popularTag:       { position:'absolute', top:-1, right:12, backgroundColor:GOLD, borderRadius:4, paddingHorizontal:6, paddingVertical:2 },
  popularText:      { color:'#fff', fontSize:8, fontWeight:'900', letterSpacing:1 },
  rateCardLeft:     { flexDirection:'row', alignItems:'center', gap:10 },
  rateCardRight:    { alignItems:'flex-end' },
  karatBadge:       { width:44, height:44, borderRadius:12, borderWidth:1.5, alignItems:'center', justifyContent:'center', flexDirection:'row' },
  karatNum:         { fontSize:18, fontWeight:'900' },
  karatK:           { fontSize:10, fontWeight:'700', marginTop:4 },
  rateCardTitle:    { fontSize:15, fontWeight:'700', color:TEXT_DARK },
  rateCardPurity:   { fontSize:11, color:TEXT_LIGHT, marginTop:1 },
  ratePerGram:      { fontSize:10, color:TEXT_LIGHT },
  ratePrice:        { fontSize:22, fontWeight:'900', letterSpacing:-0.5 },
  rateTax:          { fontSize:10, color:TEXT_LIGHT },
  changeRow:        { flexDirection:'row', alignItems:'center', gap:2, marginTop:2 },
  changeText:       { fontSize:11, fontWeight:'800' },

  emptyWrap:  { alignItems:'center', paddingVertical:48, paddingHorizontal:32 },
  emptyIcon:  { width:72, height:72, borderRadius:36, backgroundColor:GOLD_DIM, alignItems:'center', justifyContent:'center', marginBottom:16 },
  emptyTitle: { fontSize:18, fontWeight:'800', color:TEXT_DARK, marginBottom:8 },
  emptyText:  { fontSize:13, color:TEXT_LIGHT, textAlign:'center', lineHeight:20 },

  infoCard:  { margin:14, marginTop:10, backgroundColor:BG_CARD, borderRadius:16, borderWidth:1, borderColor:BORDER, padding:16 },
  infoTitle: { fontSize:13, fontWeight:'800', color:TEXT_DARK, letterSpacing:0.5, marginBottom:12 },
  infoRow:   { flexDirection:'row', alignItems:'center', paddingVertical:6, borderTopWidth:1, borderTopColor:BG },
  infoK:     { width:36, fontSize:13, fontWeight:'800', color:GOLD },
  infoDesc:  { fontSize:12, color:TEXT_MID, flex:1 },

  disclaimer: { fontSize:11, color:TEXT_LIGHT, paddingHorizontal:16, paddingBottom:8, lineHeight:16 },
  adminHint:  { paddingVertical:14 },

  adminBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor:'rgba(20,5,40,0.55)' },
  adminSheet:    { position:'absolute', bottom:0, left:0, right:0, backgroundColor:BG_CARD, borderTopLeftRadius:24, borderTopRightRadius:24, maxHeight:'88%', shadowColor:'#000', shadowOffset:{width:0,height:-4}, shadowOpacity:0.15, shadowRadius:16, elevation:20 },
  sheetHandle:   { width:40, height:4, borderRadius:2, backgroundColor:BORDER, alignSelf:'center', marginTop:10, marginBottom:4 },
  adminHeader:   { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:20, paddingTop:12, paddingBottom:10 },
  adminTitle:    { fontSize:16, fontWeight:'800', color:TEXT_DARK, letterSpacing:0.3 },
  adminSub:      { fontSize:12, color:TEXT_LIGHT, marginTop:2 },
  adminClose:    { width:32, height:32, borderRadius:16, backgroundColor:BG, alignItems:'center', justifyContent:'center' },
  goldTopBar:    { height:3, backgroundColor:GOLD, marginHorizontal:20, borderRadius:2, marginBottom:4 },
  adminBody:     { padding:20, paddingBottom:40 },

  fieldLabel:   { fontSize:10, fontWeight:'800', color:TEXT_LIGHT, letterSpacing:1.5, marginBottom:6 },
  fieldRow:     { flexDirection:'row', alignItems:'center', backgroundColor:BG, borderRadius:12, borderWidth:1, borderColor:BORDER, paddingHorizontal:12, height:50 },
  rupee:        { fontSize:18, color:TEXT_MID, fontWeight:'700', marginRight:6 },
  fieldInput:   { flex:1, fontSize:20, fontWeight:'700', color:TEXT_DARK },
  perGramLabel: { fontSize:12, color:TEXT_LIGHT, fontWeight:'600' },

  previewBox:   { backgroundColor:GOLD_DIM, borderRadius:12, padding:12, marginTop:10 },
  previewTitle: { fontSize:10, fontWeight:'700', color:'#6a4a00', letterSpacing:1, marginBottom:8 },
  previewGrid:  { flexDirection:'row', flexWrap:'wrap', gap:8 },
  previewItem:  { flex:1, minWidth:'45%', backgroundColor:'#fff9ee', borderRadius:8, padding:8, alignItems:'center' },
  previewK:     { fontSize:13, fontWeight:'800' },
  previewPrice: { fontSize:14, fontWeight:'700', color:TEXT_DARK, marginTop:2 },

  saveBtn:     { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:8, backgroundColor:GOLD, borderRadius:14, height:52, marginTop:24 },
  saveBtnText: { fontSize:14, fontWeight:'900', color:PURPLE_DARK, letterSpacing:1 },
  adminNote:   { fontSize:11, color:TEXT_LIGHT, textAlign:'center', marginTop:14, lineHeight:17 },

  flash:     { position:'absolute', bottom:40, alignSelf:'center', flexDirection:'row', alignItems:'center', gap:8, backgroundColor:PURPLE_DARK, paddingHorizontal:20, paddingVertical:12, borderRadius:30, borderWidth:1, borderColor:GOLD+'60', shadowColor:'#000', shadowOffset:{width:0,height:4}, shadowOpacity:0.2, shadowRadius:10, elevation:10 },
  flashText: { color:GOLD, fontSize:13, fontWeight:'800', letterSpacing:1 },
});
