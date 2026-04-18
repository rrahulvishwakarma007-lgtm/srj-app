import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, FlatList, Dimensions, Image, Animated, Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { products } from '../lib/data';
import { Product } from '../lib/types';

const { width: W } = Dimensions.get('window');

const GOLD        = '#C9A84C';
const GOLD_LIGHT  = '#F0D080';
const PURPLE_DARK = '#2D1B5E';
const PURPLE_MID  = '#4A2080';
const PURPLE_HERO = '#3D1A6E';
const BG          = '#F0EBFF';
const BG_CARD     = '#FFFFFF';
const BORDER      = '#DDD5F0';
const TEXT_DARK   = '#1A0A3E';
const TEXT_MID    = '#4A3570';
const TEXT_LIGHT  = '#8B7BAF';
const WHATSAPP    = '#25D366';

const BANNERS = [
  {
    id: '1',
    image: require('../assets/images/jewellery_banner_1920x1080 (1).png'),
    title: 'Bridal\nCollection',
    sub: 'Discover Your Perfect Look',
    btn: 'Explore Collection',
  },
  {
    id: '2',
    image: require('../assets/images/ChatGPT-Image-Apr-5-2026-01_09-1.png'),
    title: 'Fine\nJewellery',
    sub: '22K & 24K Gold · Hallmarked',
    btn: 'View Catalogue',
  },
];

const CATEGORIES = [
  { id: '1', image: require('../assets/images/IMG-20250924-WA0035-300x300.png'),                                          label: 'Gold'    },
  { id: '2', image: require('../assets/images/IMG_20260121_163734-300x295.jpg'),                                          label: 'Silver'  },
  { id: '3', image: require('../assets/images/Screenshot_2026-03-08-19-44-13-385_com.facebook.lite_-300x300.png'),        label: 'Bridal'  },
  { id: '4', image: require('../assets/images/Screenshot_2026-03-08-19-44-26-303_com.facebook.lite_-300x300.png'),        label: 'Rings'   },
  { id: '5', image: require('../assets/images/Screenshot_2026-03-08-19-44-34-003_com.facebook.lite_-300x300.png'),        label: 'Chains'  },
  { id: '6', image: require('../assets/images/Screenshot_2026-03-08-19-46-18-172_com.facebook.lite_-300x300.png'),        label: 'Daily W' },
  { id: '7', image: require('../assets/images/Screenshot_2026-03-11-02-28-27-301_com.facebook.lite_-300x300.png'),        label: 'Special' },
];

const TRUST = [
  { icon: 'shield-checkmark', label: '100%\nHallmarked' },
  { icon: 'ribbon',           label: 'Certified\nJewellery' },
  { icon: 'swap-horizontal',  label: 'Easy\nExchange' },
];

interface Props {
  onOpenProduct?: (p: Product) => void;
  wishlist?: Product[];
}

export default function HomeScreen({ onOpenProduct, wishlist = [] }: Props) {
  const insets = useSafeAreaInsets();
  const [search, setSearch]       = useState('');
  const [bannerIdx, setBannerIdx] = useState(0);
  const [goldRates, setGoldRates] = useState<{ k22: number; k24: number } | null>(null);
  const bannerRef = useRef<FlatList>(null);
  const scrollX   = useRef(new Animated.Value(0)).current;

  // Auto-scroll banner every 4 s
  useEffect(() => {
    const t = setInterval(() => {
      const next = (bannerIdx + 1) % BANNERS.length;
      bannerRef.current?.scrollToIndex({ index: next, animated: true });
      setBannerIdx(next);
    }, 4000);
    return () => clearInterval(t);
  }, [bannerIdx]);

  // Live gold rates
  useEffect(() => {
    (async () => {
      try {
        const r    = await fetch('https://api.metals.live/v1/spot');
        const data = await r.json();
        const goldUSD = data.find((d: any) => d.gold)?.gold ?? 2350;
        const fxR  = await fetch('https://api.frankfurter.app/latest?from=USD&to=INR');
        const fx   = await fxR.json();
        const inr  = fx.rates.INR ?? 83.5;
        const base = (goldUSD * inr / 31.1035) * 10 * 1.15 * 1.03;
        setGoldRates({ k24: Math.round(base), k22: Math.round(base * 0.9166) });
      } catch {
        setGoldRates({ k24: 7420, k22: 6800 });
      }
    })();
  }, []);

  const whatsapp  = () => Linking.openURL('https://wa.me/918377911745');
  const bookVisit = () => Linking.openURL('https://wa.me/918377911745?text=I%20would%20like%20to%20book%20a%20store%20visit');

  const featured = products.slice(0, 6);
  const filtered = search
    ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    : featured;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="diamond" size={22} color={GOLD} />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.headerBrand}>Shekhar Raja</Text>
            <Text style={styles.headerSub}>JEWELLERS</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="heart-outline" size={20} color={GOLD} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="cart-outline" size={20} color={GOLD} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        {/* ── SEARCH ── */}
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={16} color={TEXT_LIGHT} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Jewellery..."
            placeholderTextColor={TEXT_LIGHT}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={TEXT_LIGHT} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── BANNER CAROUSEL ── */}
        {!search && (
          <View style={styles.bannerWrap}>
            <Animated.FlatList
              ref={bannerRef}
              data={BANNERS}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={b => b.id}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false }
              )}
              onMomentumScrollEnd={e =>
                setBannerIdx(Math.round(e.nativeEvent.contentOffset.x / W))
              }
              renderItem={({ item }) => (
                <View style={styles.bannerSlide}>
                  <Image source={item.image} style={styles.bannerImage} resizeMode="cover" />
                  <View style={styles.bannerOverlay} />
                  <View style={styles.bannerContent}>
                    <Text style={styles.bannerTitle}>{item.title}</Text>
                    <Text style={styles.bannerSub}>{item.sub}</Text>
                    <TouchableOpacity style={styles.bannerBtn}>
                      <Text style={styles.bannerBtnText}>◆ {item.btn} ◆</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
            {/* Dot indicators */}
            <View style={styles.dots}>
              {BANNERS.map((_, i) => (
                <View key={i} style={[styles.dot, i === bannerIdx && styles.dotActive]} />
              ))}
            </View>
          </View>
        )}

        {/* ── CATEGORIES ── */}
        {!search && (
          <View style={styles.section}>
            <FlatList
              data={CATEGORIES}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={c => c.id}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.catItem} activeOpacity={0.8}>
                  <View style={styles.catCircle}>
                    <Image source={item.image} style={styles.catImage} resizeMode="cover" />
                  </View>
                  <Text style={styles.catLabel}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* ── FEATURED / SEARCH RESULTS ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {search ? `Results for "${search}"` : 'Featured Products'}
            </Text>
            {!search && <View style={styles.sectionLine} />}
          </View>

          {filtered.length === 0 ? (
            <Text style={styles.noResult}>No products found</Text>
          ) : (
            <FlatList
              data={filtered}
              horizontal={!search}
              numColumns={search ? 2 : undefined}
              key={search ? 'grid' : 'list'}
              showsHorizontalScrollIndicator={false}
              keyExtractor={p => String(p.id)}
              contentContainerStyle={
                search ? styles.gridContent : { paddingHorizontal: 16, gap: 12 }
              }
              renderItem={({ item }) => {
                const wishlisted = wishlist.some(w => w.id === item.id);
                return (
                  <TouchableOpacity
                    style={search ? styles.productGridCard : styles.productCard}
                    onPress={() => onOpenProduct?.(item)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.productImgWrap}>
                      <View style={[styles.productIconBg, { backgroundColor: item.color + '22' }]}>
                        <Ionicons name={item.icon as any} size={38} color={item.color} />
                      </View>
                      <View style={styles.heartBadge}>
                        <Ionicons
                          name={wishlisted ? 'heart' : 'heart-outline'}
                          size={15}
                          color={wishlisted ? '#E55' : '#AAA'}
                        />
                      </View>
                    </View>
                    <View style={styles.productInfo}>
                      <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                      <View style={styles.productBottom}>
                        <Text style={styles.productPrice}>
                          ₹{item.price.toLocaleString('en-IN')}
                        </Text>
                        <View style={styles.heartBtnSmall}>
                          <Ionicons name="heart" size={13} color={GOLD} />
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>

        {/* ── GOLD RATES ── */}
        {!search && (
          <View style={styles.section}>
            <View style={[styles.sectionHeader, { justifyContent: 'center' }]}>
              <View style={styles.sectionLine} />
              <Text style={[styles.sectionTitle, { marginHorizontal: 10 }]}>◆ Gold Rates ◆</Text>
              <View style={styles.sectionLine} />
            </View>
            <View style={styles.goldCard}>
              <View style={styles.goldRow}>
                <View style={styles.goldItem}>
                  <Text style={styles.goldKarat}>22K</Text>
                  <Text style={styles.goldPrice}>
                    ₹{goldRates ? goldRates.k22.toLocaleString('en-IN') : '---'}
                  </Text>
                  <Ionicons name="arrow-up" size={13} color="#22c55e" />
                </View>
                <View style={styles.goldDivider} />
                <View style={styles.goldItem}>
                  <Text style={styles.goldKarat}>24K</Text>
                  <Text style={styles.goldPrice}>
                    ₹{goldRates ? goldRates.k24.toLocaleString('en-IN') : '---'}
                  </Text>
                  <Ionicons name="arrow-down" size={13} color="#ef4444" />
                </View>
              </View>
            </View>
          </View>
        )}

        {/* ── TRUST BADGES ── */}
        {!search && (
          <View style={styles.trustRow}>
            {TRUST.map((t, i) => (
              <View key={i} style={styles.trustItem}>
                <Ionicons name={t.icon as any} size={26} color={GOLD} />
                <Text style={styles.trustLabel}>{t.label}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── CTA BUTTONS ── */}
        {!search && (
          <View style={styles.ctaWrap}>
            <TouchableOpacity style={styles.bookBtn} onPress={bookVisit} activeOpacity={0.85}>
              <Text style={styles.bookBtnText}>Book Store Visit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.waBtn} onPress={whatsapp} activeOpacity={0.85}>
              <Ionicons name="logo-whatsapp" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.waBtnText}>Chat on WhatsApp</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: PURPLE_DARK },
  scroll: { flex: 1, backgroundColor: BG },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: PURPLE_DARK, paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(201,168,76,0.3)',
  },
  headerLeft:  { flexDirection: 'row', alignItems: 'center' },
  headerBrand: { color: GOLD, fontSize: 18, fontWeight: '800', letterSpacing: 0.5 },
  headerSub:   { color: GOLD_LIGHT, fontSize: 9, letterSpacing: 4, marginTop: -2 },
  headerRight: { flexDirection: 'row', gap: 8 },
  headerBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(201,168,76,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },

  // Search
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: BG_CARD, borderRadius: 24,
    marginHorizontal: 16, marginTop: 14, marginBottom: 4,
    paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: BORDER,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  searchInput: { flex: 1, fontSize: 14, color: TEXT_DARK },

  // Banner
  bannerWrap:    { marginTop: 12 },
  bannerSlide:   { width: W, height: 220, position: 'relative' },
  bannerImage:   { width: '100%', height: '100%' },
  bannerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(40,10,80,0.42)' },
  bannerContent: { position: 'absolute', left: 20, bottom: 28, right: W * 0.42 },
  bannerTitle: {
    color: '#fff', fontSize: 28, fontWeight: '900', fontStyle: 'italic',
    lineHeight: 32, letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 4,
  },
  bannerSub: { color: 'rgba(255,255,255,0.88)', fontSize: 12, marginTop: 4, marginBottom: 10 },
  bannerBtn: {
    backgroundColor: 'rgba(201,168,76,0.9)', paddingVertical: 8, paddingHorizontal: 14,
    borderRadius: 20, alignSelf: 'flex-start',
  },
  bannerBtnText: { color: PURPLE_DARK, fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  dots:          { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 8 },
  dot:           { width: 6, height: 6, borderRadius: 3, backgroundColor: '#C8B8E8' },
  dotActive:     { width: 18, backgroundColor: GOLD },

  // Section
  section: { marginTop: 18 },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, marginBottom: 12,
  },
  sectionTitle: { color: TEXT_DARK, fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
  sectionLine:  { flex: 1, height: 1, backgroundColor: BORDER, marginLeft: 8 },
  noResult:     { color: TEXT_MID, textAlign: 'center', marginTop: 20, fontSize: 14 },

  // Categories — image circles
  catItem:   { alignItems: 'center', width: 68 },
  catCircle: {
    width: 58, height: 58, borderRadius: 29, overflow: 'hidden',
    borderWidth: 2, borderColor: GOLD,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  catImage:  { width: '100%', height: '100%' },
  catLabel:  { color: TEXT_MID, fontSize: 11, fontWeight: '600', marginTop: 5, textAlign: 'center' },

  // Products
  productCard: {
    width: 148, backgroundColor: BG_CARD, borderRadius: 14,
    borderWidth: 1, borderColor: BORDER, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  productGridCard: {
    flex: 1, margin: 6, backgroundColor: BG_CARD, borderRadius: 14,
    borderWidth: 1, borderColor: BORDER, overflow: 'hidden',
  },
  gridContent:    { paddingHorizontal: 10 },
  productImgWrap: { position: 'relative' },
  productIconBg:  { height: 110, alignItems: 'center', justifyContent: 'center' },
  heartBadge: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 12,
    width: 26, height: 26, alignItems: 'center', justifyContent: 'center',
  },
  productInfo:   { padding: 10 },
  productName:   { color: TEXT_DARK, fontSize: 12, fontWeight: '700' },
  productBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  productPrice:  { color: PURPLE_MID, fontSize: 13, fontWeight: '800' },
  heartBtnSmall: {
    backgroundColor: 'rgba(201,168,76,0.12)', borderRadius: 10,
    width: 24, height: 24, alignItems: 'center', justifyContent: 'center',
  },

  // Gold rates
  goldCard: {
    marginHorizontal: 16, backgroundColor: PURPLE_HERO,
    borderRadius: 16, borderWidth: 1.5, borderColor: GOLD, padding: 16,
  },
  goldRow:    { flexDirection: 'row', alignItems: 'center' },
  goldItem:   { flex: 1, alignItems: 'center', gap: 4 },
  goldKarat:  { color: GOLD_LIGHT, fontSize: 13, fontWeight: '700', letterSpacing: 1 },
  goldPrice:  { color: '#fff', fontSize: 22, fontWeight: '900' },
  goldDivider:{ width: 1, height: 50, backgroundColor: 'rgba(201,168,76,0.4)' },

  // Trust
  trustRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    marginHorizontal: 16, marginTop: 18,
    backgroundColor: BG_CARD, borderRadius: 14,
    borderWidth: 1, borderColor: BORDER, paddingVertical: 14,
  },
  trustItem:  { alignItems: 'center', gap: 6 },
  trustLabel: { color: TEXT_MID, fontSize: 11, fontWeight: '600', textAlign: 'center', lineHeight: 15 },

  // CTA
  ctaWrap: { paddingHorizontal: 16, marginTop: 18, gap: 10 },
  bookBtn: {
    backgroundColor: GOLD, borderRadius: 28, paddingVertical: 15, alignItems: 'center',
    shadowColor: GOLD, shadowOpacity: 0.4, shadowRadius: 8, elevation: 4,
  },
  bookBtnText: { color: PURPLE_DARK, fontSize: 15, fontWeight: '900', letterSpacing: 0.5 },
  waBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: WHATSAPP, borderRadius: 28, paddingVertical: 14,
  },
  waBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
tems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  heroEst: { color: Theme.gold, fontSize: 11, fontWeight: '700', letterSpacing: 3, marginBottom: 8 },
  heroTitle: { color: '#FFFFFF', fontSize: 32, fontWeight: '900', letterSpacing: 2, textAlign: 'center' },
  heroClaim: { color: Theme.textLightMuted, fontSize: 12, marginTop: 8, textAlign: 'center', letterSpacing: 0.3 },
  heroWaBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#25D366',
    paddingVertical: 12, paddingHorizontal: 22, borderRadius: Radius.full, marginTop: 18,
  },
  heroWaText: { color: '#fff', fontSize: 13, fontWeight: '800' },

  // Search
  searchWrap: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Theme.border },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Theme.bgPrimary,
    borderRadius: Radius.full, paddingHorizontal: 16, paddingVertical: 11,
    borderWidth: 1, borderColor: Theme.border,
  },
  searchPlaceholder: { color: Theme.textMuted, fontSize: 14 },

  // Chips
  chipRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 8,
    backgroundColor: '#FFFFFF', borderRadius: Radius.full,
    borderWidth: 1, borderColor: Theme.border,
  },
  chipActive: { backgroundColor: Theme.bgPurple, borderColor: Theme.bgPurple },
  chipText: { color: Theme.textMuted, fontSize: 12, fontWeight: '700' },
  chipTextActive: { color: '#FFFFFF' },

  // Section
  section: { marginTop: 20, paddingHorizontal: 16 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  sectionTitle: { color: Theme.textDark, fontSize: 18, fontWeight: '800', letterSpacing: 0.3 },
  sectionSub: { color: Theme.textMuted, fontSize: 11, fontWeight: '600' },

  // Live tag
  liveTag: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Theme.success },
  liveTxt: { color: Theme.success, fontSize: 10, fontWeight: '800', letterSpacing: 1 },

  // Gold card
  goldCard: {
    backgroundColor: '#FFFFFF', borderRadius: Radius.lg, borderWidth: 1,
    borderColor: Theme.border, paddingHorizontal: 18, paddingTop: 4, paddingBottom: 12,
    elevation: 2, shadowColor: Theme.shadow, shadowOpacity: 0.08, shadowRadius: 8,
  },
  goldRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14 },
  goldDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Theme.gold },
  goldType: { color: Theme.textDark, fontSize: 15, fontWeight: '700' },
  goldPrice: { color: Theme.purple, fontSize: 17, fontWeight: '900' },
  goldUnit: { color: Theme.textMuted, fontSize: 10, marginTop: 2 },
  goldNote: { color: Theme.textMuted, fontSize: 10, fontWeight: '600', textAlign: 'center', marginTop: 6 },

  // Trending
  trendCard: {
    width: 148, marginRight: 12, backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg, padding: 14,
    borderWidth: 1, borderColor: Theme.border,
    elevation: 2, shadowColor: Theme.shadow, shadowOpacity: 0.06, shadowRadius: 6,
  },
  trendImg: {
    height: 90, backgroundColor: Theme.bgCardPurple,
    borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  trendName: { color: Theme.textDark, fontSize: 13, fontWeight: '800', lineHeight: 17 },
  trendDesc: { color: Theme.textMuted, fontSize: 11, marginTop: 3 },
  trendCta: { color: Theme.purple, fontSize: 11, fontWeight: '700' },

  // Occasion
  occasionGrid: { flexDirection: 'row', gap: 10, marginTop: 12 },
  occasionCard: {
    flex: 1, alignItems: 'center', backgroundColor: '#FFFFFF',
    borderRadius: Radius.md, paddingVertical: 16,
    borderWidth: 1, borderColor: Theme.border,
    elevation: 1, shadowColor: Theme.shadow, shadowOpacity: 0.05, shadowRadius: 4,
  },
  occasionIcon: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  occasionLabel: { color: Theme.textDark, fontSize: 11, fontWeight: '700', textAlign: 'center' },

  // Featured
  featCard: {
    width: 160, marginRight: 12, backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg, overflow: 'hidden',
    borderWidth: 1, borderColor: Theme.border,
    elevation: 2, shadowColor: Theme.shadow, shadowOpacity: 0.06, shadowRadius: 6,
  },
  featImg: { height: 96, backgroundColor: Theme.bgCardPurple, alignItems: 'center', justifyContent: 'center' },
  featName: { color: Theme.textDark, fontSize: 13, fontWeight: '800', lineHeight: 17 },
  featDesc: { color: Theme.textMuted, fontSize: 11, marginTop: 3 },

  // Store strip
  storeStrip: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Theme.bgPurple,
    marginHorizontal: 16, marginTop: 24, borderRadius: Radius.lg, padding: 16,
  },
  storeLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  storeIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(201,168,76,0.18)', alignItems: 'center', justifyContent: 'center',
  },
  storeTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  storeSub: { color: Theme.textLightMuted, fontSize: 11, marginTop: 2 },
  storeBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Theme.gold, alignItems: 'center', justifyContent: 'center',
  },
});
