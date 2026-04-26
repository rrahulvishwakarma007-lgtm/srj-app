import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Animated, Easing, Alert, Platform,
  KeyboardAvoidingView, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: W } = Dimensions.get('window');

// ── Constants ─────────────────────────────────────────────────────────────────
const STORAGE_KEY  = '@srj_gold_rate_24k';
const DATE_KEY     = '@srj_gold_rate_date';
const SILVER_KEY   = '@srj_silver_rate';
const ADMIN_SECRET = 5; // tap logo 5 times to open admin

const GOLD        = '#C9A84C';
const GOLD_LIGHT  = '#F0D080';
const GOLD_DIM    = 'rgba(201,168,76,0.25)';
const PURPLE_DARK = '#2D1B5E';
const PURPLE_MID  = '#4A2080';
const PURPLE_HERO = '#3D1A6E';
const BG          = '#F0EBFF';
const BG_CARD     = '#FFFFFF';
const BORDER      = '#DDD5F0';
const TEXT_DARK   = '#1A0A3E';
const TEXT_MID    = '#4A3570';
const TEXT_LIGHT  = '#8B7BAF';
const GREEN       = '#16a34a';
const RED         = '#dc2626';

// ── Karat purity multipliers ──────────────────────────────────────────────────
const KARATS = [
  { k: '24K', purity: '999.9', mul: 1,          featured: false, color: '#b8892a' },
  { k: '22K', purity: '916',   mul: 22/24,       featured: true,  color: GOLD      },
  { k: '20K', purity: '833',   mul: 20/24,       featured: false, color: '#a07820' },
  { k: '18K', purity: '750',   mul: 18/24,       featured: false, color: '#8a6818' },
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

// ── Rate card ─────────────────────────────────────────────────────────────────
function RateCard({ k, purity, price, featured, color }: {
  k: string; purity: string; price: number; featured: boolean; color: string;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.03, duration: 200, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
  }, [price]);

  return (
    <Animated.View style={[
      styles.rateCard,
      featured && styles.rateCardFeatured,
      { transform: [{ scale }] },
    ]}>
      {featured && (
        <View style={styles.popularTag}>
          <Text style={styles.popularText}>MOST POPULAR</Text>
        </View>
      )}
      <View style={styles.rateCardLeft}>
        <View style={[styles.karatBadge, { borderColor: color + '60', backgroundColor: color + '15' }]}>
          <Text style={[styles.karatNum, { color }]}>{k.replace('K','')}</Text>
          <Text style={[styles.karatK, { color }]}>K</Text>
        </View>
        <View>
          <Text style={styles.rateCardTitle}>{k} Gold</Text>
          <Text style={styles.rateCardPurity}>{purity} Fineness</Text>
        </View>
      </View>
      <View style={styles.rateCardRight}>
        <Text style={styles.ratePerGram}>per gram</Text>
        <Text style={[styles.ratePrice, { color }]}>
          ₹{price.toLocaleString('en-IN')}
        </Text>
        <Text style={styles.rateTax}>incl. taxes</Text>
      </View>
    </Animated.View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function GoldRatesScreen() {
  const insets = useSafeAreaInsets();

  const [rate24k, setRate24k]     = useState(0);
  const [silverRate, setSilverRate] = useState(0);
  const [updatedDate, setUpdatedDate] = useState('');
  const [adminOpen, setAdminOpen] = useState(false);
  const [inputRate, setInputRate] = useState('');
  const [inputSilver, setInputSilver] = useState('');
  const [inputDate, setInputDate] = useState('');
  const [tapCount, setTapCount]   = useState(0);
  const [saving, setSaving]       = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const tapTimer = useRef<any>(null);
  const tickerX  = useRef(new Animated.Value(0)).current;
  const adminAnim = useRef(new Animated.Value(0)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;

  // ── Load saved rates from AsyncStorage on mount ───────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const saved24k  = await AsyncStorage.getItem(STORAGE_KEY);
        const savedDate = await AsyncStorage.getItem(DATE_KEY);
        const savedSilver = await AsyncStorage.getItem(SILVER_KEY);
        if (saved24k)    setRate24k(parseInt(saved24k));
        if (savedDate)   setUpdatedDate(savedDate);
        if (savedSilver) setSilverRate(parseInt(savedSilver));
      } catch (e) {
        console.warn('GoldRates: load error', e);
      }
    })();
  }, []);

  // ── JS-driven ticker scroll (works on Android WebView / APK) ─────────────
  useEffect(() => {
    let pos = 0;
    let raf: any;
    const step = () => {
      pos += 0.6;
      // tickerWidth is approx — will loop smoothly
      if (pos > W * 4) pos = 0;
      tickerX.setValue(-pos);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [rate24k]);

  // ── Secret admin unlock (tap logo 5 times) ────────────────────────────────
  const handleLogoTap = () => {
    const next = tapCount + 1;
    setTapCount(next);
    clearTimeout(tapTimer.current);
    if (next >= ADMIN_SECRET) {
      setTapCount(0);
      openAdmin();
    } else {
      // Reset tap count after 2s of inactivity
      tapTimer.current = setTimeout(() => setTapCount(0), 2000);
    }
  };

  const openAdmin = () => {
    const today = new Date().toLocaleDateString('en-IN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
    setInputRate(rate24k > 0 ? String(rate24k) : '');
    setInputSilver(silverRate > 0 ? String(silverRate) : '');
    setInputDate(updatedDate || today);
    setAdminOpen(true);
    Animated.spring(adminAnim, { toValue: 1, friction: 7, tension: 50, useNativeDriver: true }).start();
  };

  const closeAdmin = () => {
    Animated.timing(adminAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => {
      setAdminOpen(false);
    });
  };

  // ── Save rates to AsyncStorage ────────────────────────────────────────────
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

      // Flash success
      setSavedFlash(true);
      Animated.sequence([
        Animated.timing(flashAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.delay(1200),
        Animated.timing(flashAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => setSavedFlash(false));

      setTimeout(closeAdmin, 400);
    } catch (e) {
      Alert.alert('Error', 'Could not save rate. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── Calculated rates ──────────────────────────────────────────────────────
  const rates = KARATS.map(k => ({
    ...k,
    price: rate24k > 0 ? Math.round(rate24k * k.mul) : 0,
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

      {/* ── GOLD TICKER ── */}
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

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >

        {/* ── DATE & UPDATE INFO ── */}
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

        {/* ── RATE CARDS ── */}
        {rate24k > 0 ? (
          <View style={styles.cardsWrap}>
            {rates.map(r => (
              <RateCard key={r.k} k={r.k} purity={r.purity} price={r.price} featured={r.featured} color={r.color} />
            ))}

            {/* Silver */}
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
                  <Text style={[styles.ratePrice, { color: '#7070b0' }]}>
                    ₹{silverRate.toLocaleString('en-IN')}
                  </Text>
                  <Text style={styles.rateTax}>incl. taxes</Text>
                </View>
              </View>
            )}
          </View>
        ) : (
          /* ── Empty state ── */
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIcon}>
              <Ionicons name="trending-up" size={36} color={GOLD} />
            </View>
            <Text style={styles.emptyTitle}>Rates Not Set</Text>
            <Text style={styles.emptyText}>
              Tap the header icon 5 times to open the admin panel and set today's gold rate.
            </Text>
          </View>
        )}

        {/* ── PURITY INFO ── */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>◆ About Gold Purity</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoK}>24K</Text>
            <Text style={styles.infoDesc}>99.9% pure — investment grade gold</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoK}>22K</Text>
            <Text style={styles.infoDesc}>91.6% pure — BIS 916 hallmark jewellery</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoK}>20K</Text>
            <Text style={styles.infoDesc}>83.3% pure — traditional ornaments</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoK}>18K</Text>
            <Text style={styles.infoDesc}>75.0% pure — diamond-set jewellery</Text>
          </View>
        </View>

        {/* ── DISCLAIMER ── */}
        <Text style={styles.disclaimer}>
          ⚠️ Rates are indicative and updated daily. Final price may vary based on making charges, wastage and GST. Contact us for exact pricing.
        </Text>

        {/* Hint to open admin */}
        <TouchableOpacity onPress={handleLogoTap} style={styles.adminHint} activeOpacity={0.6}>
          <Ionicons name="settings-outline" size={13} color={TEXT_LIGHT} />
          <Text style={styles.adminHintText}>
            {tapCount > 0
              ? `Tap ${ADMIN_SECRET - tapCount} more time${ADMIN_SECRET - tapCount > 1 ? 's' : ''} to open admin`
              : 'Tap here to update rates'}
          </Text>
        </TouchableOpacity>

      </ScrollView>

      {/* ── ADMIN PANEL MODAL ── */}
      {adminOpen && (
        <KeyboardAvoidingView
          style={StyleSheet.absoluteFill}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity style={styles.adminBackdrop} onPress={closeAdmin} activeOpacity={1} />
          <Animated.View
            style={[styles.adminSheet, {
              transform: [{
                translateY: adminAnim.interpolate({ inputRange: [0, 1], outputRange: [500, 0] }),
              }],
            }]}
          >
            {/* Handle */}
            <View style={styles.sheetHandle} />

            <View style={styles.adminHeader}>
              <View>
                <Text style={styles.adminTitle}>◆ Update Gold Rates</Text>
                <Text style={styles.adminSub}>Changes save locally on this device</Text>
              </View>
              <TouchableOpacity onPress={closeAdmin} style={styles.adminClose}>
                <Ionicons name="close" size={20} color={TEXT_DARK} />
              </TouchableOpacity>
            </View>

            <View style={styles.goldTopBar} />

            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.adminBody} keyboardShouldPersistTaps="handled">

              {/* 24K input */}
              <Text style={styles.fieldLabel}>24K GOLD RATE (₹ per gram) *</Text>
              <View style={styles.fieldRow}>
                <Text style={styles.rupee}>₹</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="e.g. 7500"
                  placeholderTextColor={TEXT_LIGHT}
                  keyboardType="numeric"
                  value={inputRate}
                  onChangeText={setInputRate}
                  autoFocus
                />
                <Text style={styles.perGramLabel}>/gram</Text>
              </View>

              {/* Live preview of all karats */}
              {parseInt(inputRate) > 0 && (
                <View style={styles.previewBox}>
                  <Text style={styles.previewTitle}>Preview — Auto-calculated</Text>
                  <View style={styles.previewGrid}>
                    {KARATS.map(k => {
                      const p = Math.round(parseInt(inputRate.replace(/,/g, '')) * k.mul);
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

              {/* Silver input */}
              <Text style={[styles.fieldLabel, { marginTop: 16 }]}>SILVER RATE (₹ per gram) — Optional</Text>
              <View style={styles.fieldRow}>
                <Text style={styles.rupee}>₹</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="e.g. 95"
                  placeholderTextColor={TEXT_LIGHT}
                  keyboardType="numeric"
                  value={inputSilver}
                  onChangeText={setInputSilver}
                />
                <Text style={styles.perGramLabel}>/gram</Text>
              </View>

              {/* Date input */}
              <Text style={[styles.fieldLabel, { marginTop: 16 }]}>RATE DATE</Text>
              <View style={styles.fieldRow}>
                <Ionicons name="calendar-outline" size={16} color={TEXT_LIGHT} style={{ marginRight: 8 }} />
                <TextInput
                  style={[styles.fieldInput, { flex: 1 }]}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor={TEXT_LIGHT}
                  value={inputDate}
                  onChangeText={setInputDate}
                />
              </View>

              {/* Save button */}
              <TouchableOpacity
                style={[styles.saveBtn, saving && { opacity: 0.6 }]}
                onPress={saveRates}
                disabled={saving}
                activeOpacity={0.85}
              >
                <Ionicons name="checkmark-circle" size={20} color={PURPLE_DARK} />
                <Text style={styles.saveBtnText}>
                  {saving ? 'SAVING...' : 'SAVE & PUBLISH RATES'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.adminNote}>
                💾 Rates are stored on this device using AsyncStorage. Update daily before opening the app. No internet required.
              </Text>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      )}

      {/* ── SUCCESS FLASH ── */}
      {savedFlash && (
        <Animated.View style={[styles.flash, { opacity: flashAnim }]}>
          <Ionicons name="checkmark-circle" size={18} color={GOLD} />
          <Text style={styles.flashText}>RATES UPDATED ✓</Text>
        </Animated.View>
      )}

    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: PURPLE_DARK },
  scroll: { flex: 1, backgroundColor: BG },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: PURPLE_DARK, paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: 'rgba(201,168,76,0.25)',
  },
  headerLeft:    { flexDirection: 'row', alignItems: 'center' },
  headerIconWrap:{ position: 'relative', width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(201,168,76,0.15)', alignItems: 'center', justifyContent: 'center' },
  tapHint: {
    position: 'absolute', top: -4, right: -4,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: GOLD, alignItems: 'center', justifyContent: 'center',
  },
  tapHintText:   { color: PURPLE_DARK, fontSize: 9, fontWeight: '900' },
  headerTitle:   { color: '#fff', fontSize: 20, fontWeight: '900', marginLeft: 0 },
  headerSub:     { color: GOLD, fontSize: 8, fontWeight: '700', letterSpacing: 2.5, marginTop: 1 },
  liveDot: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(22,163,74,0.15)', borderRadius: 99,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: 'rgba(22,163,74,0.3)',
  },
  livePulse: { width: 7, height: 7, borderRadius: 4, backgroundColor: GREEN },
  liveText:  { color: GREEN, fontSize: 10, fontWeight: '800', letterSpacing: 2 },

  // Ticker
  tickerWrap: {
    backgroundColor: '#160d00',
    paddingLeft: 80,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212,175,55,0.12)',
    height: 36,
    overflow: 'hidden',
    position: 'relative',
  },
  tickerBadge: {
    position: 'absolute', left: 0, top: 0, bottom: 0,
    backgroundColor: '#1e1000', borderRightWidth: 1,
    borderRightColor: 'rgba(212,175,55,0.25)',
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 10, zIndex: 2,
  },
  tickerBadgeText: { color: GOLD, fontSize: 8, fontWeight: '900', letterSpacing: 1.5 },
  tickerViewport:  { flex: 1, overflow: 'hidden' },
  tickerTrack:     { flexDirection: 'row', alignItems: 'center', height: 36 },

  // Date row
  dateRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: BG_CARD, borderBottomWidth: 1, borderBottomColor: BORDER,
  },
  dateLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateText: { color: TEXT_MID, fontSize: 12, fontWeight: '600' },
  updatedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#dcfce7', borderRadius: 99,
    paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: 'rgba(22,163,74,0.3)',
  },
  updatedText: { color: GREEN, fontSize: 10, fontWeight: '700' },

  // Rate cards
  cardsWrap: { padding: 14, gap: 10 },
  rateCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: BG_CARD, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: BORDER,
    shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  rateCardFeatured: {
    borderColor: GOLD_DIM,
    backgroundColor: '#fffef7',
    shadowColor: GOLD, shadowOpacity: 0.15, shadowRadius: 12, elevation: 6,
  },
  popularTag: {
    position: 'absolute', top: -1, right: 14,
    backgroundColor: GOLD, borderRadius: 99,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  popularText:     { color: PURPLE_DARK, fontSize: 8, fontWeight: '900', letterSpacing: 1.5 },
  rateCardLeft:    { flexDirection: 'row', alignItems: 'center', gap: 12 },
  karatBadge: {
    width: 52, height: 52, borderRadius: 10,
    borderWidth: 1.5, alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: 1,
  },
  karatNum:        { fontSize: 20, fontWeight: '900' },
  karatK:          { fontSize: 11, fontWeight: '700', marginTop: 6 },
  rateCardTitle:   { color: TEXT_DARK, fontSize: 15, fontWeight: '800' },
  rateCardPurity:  { color: TEXT_LIGHT, fontSize: 11, marginTop: 2 },
  rateCardRight:   { alignItems: 'flex-end' },
  ratePerGram:     { color: TEXT_LIGHT, fontSize: 10, letterSpacing: 0.5 },
  ratePrice:       { fontSize: 22, fontWeight: '900', letterSpacing: 0.5 },
  rateTax:         { color: TEXT_LIGHT, fontSize: 9, marginTop: 2 },

  // Empty state
  emptyWrap: {
    alignItems: 'center', paddingVertical: 48, paddingHorizontal: 32,
    backgroundColor: BG_CARD, margin: 16, borderRadius: 20,
    borderWidth: 1, borderColor: BORDER,
  },
  emptyIcon: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(201,168,76,0.1)', borderWidth: 2,
    borderColor: GOLD_DIM, alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  emptyTitle: { color: TEXT_DARK, fontSize: 18, fontWeight: '800', marginBottom: 8 },
  emptyText:  { color: TEXT_LIGHT, fontSize: 13, textAlign: 'center', lineHeight: 20 },

  // Info card
  infoCard: {
    margin: 14, marginTop: 4, backgroundColor: BG_CARD,
    borderRadius: 16, padding: 16, borderWidth: 1, borderColor: BORDER,
  },
  infoTitle: { color: TEXT_MID, fontSize: 11, fontWeight: '800', letterSpacing: 2, marginBottom: 12 },
  infoRow:   { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  infoK:     { color: GOLD, fontSize: 13, fontWeight: '900', width: 32 },
  infoDesc:  { color: TEXT_MID, fontSize: 12, flex: 1 },

  disclaimer: {
    marginHorizontal: 14, marginTop: 4,
    color: TEXT_LIGHT, fontSize: 11, lineHeight: 17,
    textAlign: 'center',
  },

  adminHint: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, marginTop: 16, paddingVertical: 8,
  },
  adminHintText: { color: TEXT_LIGHT, fontSize: 11, letterSpacing: 0.5 },

  // Admin sheet
  adminBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  adminSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: BG_CARD, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: '90%',
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 20, elevation: 20,
  },
  sheetHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: BORDER, alignSelf: 'center', marginTop: 10,
  },
  adminHeader: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    padding: 20, paddingBottom: 12,
  },
  adminTitle:  { color: TEXT_DARK, fontSize: 17, fontWeight: '900' },
  adminSub:    { color: TEXT_LIGHT, fontSize: 12, marginTop: 2 },
  adminClose: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: BG, alignItems: 'center', justifyContent: 'center',
  },
  goldTopBar:  { height: 2, backgroundColor: GOLD, marginHorizontal: 20, borderRadius: 1, marginBottom: 4 },
  adminBody:   { padding: 20, paddingBottom: 40 },

  fieldLabel:  { color: PURPLE_MID, fontSize: 10, fontWeight: '800', letterSpacing: 2, marginBottom: 8 },
  fieldRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: BG, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1.5, borderColor: BORDER, marginBottom: 4,
  },
  rupee:        { color: GOLD, fontSize: 18, fontWeight: '900', marginRight: 4 },
  fieldInput:   { flex: 1, fontSize: 20, fontWeight: '800', color: TEXT_DARK },
  perGramLabel: { color: TEXT_LIGHT, fontSize: 12, fontWeight: '600' },

  // Live preview
  previewBox: {
    backgroundColor: '#fffef0', borderRadius: 12,
    borderWidth: 1, borderColor: GOLD_DIM,
    padding: 12, marginTop: 8,
  },
  previewTitle: { color: TEXT_MID, fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: 10 },
  previewGrid:  { flexDirection: 'row', justifyContent: 'space-between' },
  previewItem:  { alignItems: 'center', flex: 1 },
  previewK:     { fontSize: 12, fontWeight: '800', marginBottom: 3 },
  previewPrice: { color: TEXT_DARK, fontSize: 13, fontWeight: '700' },

  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, backgroundColor: GOLD, borderRadius: 50,
    paddingVertical: 16, marginTop: 20,
    shadowColor: GOLD, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  saveBtnText: { color: PURPLE_DARK, fontSize: 14, fontWeight: '900', letterSpacing: 2 },
  adminNote:   { color: TEXT_LIGHT, fontSize: 11, textAlign: 'center', marginTop: 14, lineHeight: 17 },

  // Flash
  flash: {
    position: 'absolute', bottom: 36, alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: PURPLE_DARK, paddingVertical: 12, paddingHorizontal: 22,
    borderRadius: 50, borderWidth: 1, borderColor: GOLD,
    shadowColor: GOLD, shadowOpacity: 0.3, shadowRadius: 10, elevation: 10,
  },
  flashText: { color: GOLD, fontSize: 13, fontWeight: '800', letterSpacing: 1.5 },
});
