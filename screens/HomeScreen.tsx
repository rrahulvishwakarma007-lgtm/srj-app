import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, FlatList, Dimensions, Image, Animated, Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../lib/types';

// ── Shared storage helper (same keys as GoldRatesScreen) ─────────────────────
import { loadGoldRates, GoldRateData } from '../lib/goldRateStorage';
// ↑ Adjust the import path to wherever you place goldRateStorage.ts in your project.
//   e.g. '../utils/goldRateStorage' or '../services/goldRateStorage'

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
const GREEN       = '#16a34a';
const RED         = '#dc2626';

const WP = 'https://shekharrajajewellers.com/wp-content/uploads/2026/03';

// ── BANNERS ───────────────────────────────────────────────────────────────────
const BANNERS = [
  {
    id: '1',
    image: 'https://shekharrajajewellers.com/wp-content/uploads/2026/04/jewellery_banner_1920x1080.png',
    title: 'Bridal\nCollection',
    sub: 'Discover Your Perfect Look',
    btn: 'Explore Collection',
  },
  {
    id: '2',
    image: 'https://shekharrajajewellers.com/wp-content/uploads/2026/04/ChatGPT-Image-Apr-5-2026-01_09-1.png',
    title: 'Fine\nJewellery',
    sub: '22K & 24K Gold · Hallmarked',
    btn: 'View Catalogue',
  },
];

// ── CATEGORIES ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: '1', image: `${WP}/Screenshot_2026-03-11-02-43-01-295_com.facebook.lite_.png`, label: 'Gold' },
  { id: '2', image: `${WP}/Screenshot_2026-03-11-02-36-37-183_com.facebook.lite_.png`, label: 'Silver' },
  { id: '3', image: `${WP}/Screenshot_2026-03-08-19-44-40-125_com.facebook.lite_.png`, label: 'Bridal' },
  { id: '4', image: `${WP}/Screenshot_2026-03-11-02-37-35-489_com.facebook.lite_.png`, label: 'Rings' },
  { id: '5', image: `${WP}/file_00000000d1a071fab06fbf048655557e.png`,                 label: 'Chains' },
  { id: '6', image: `${WP}/file_0000000016a4720bb922e408d0fb4532.png`,                 label: 'Daily W' },
  { id: '7', image: `${WP}/Screenshot_2026-03-11-02-37-24-543_com.facebook.lite_.png`, label: 'Special' },
];

// ── FEATURED PRODUCTS ─────────────────────────────────────────────────────────
interface StaticProduct {
  id: string; name: string; category: string;
  description: string; purity: string;
  imageUrl: string; color: string; icon: string;
}

const FEATURED_PRODUCTS: StaticProduct[] = [
  {
    id: '1', name: 'Gold Ring', category: 'Rings',
    description: 'Classic 22K gold ring with intricate design',
    imageUrl: `${WP}/Screenshot_2026-03-11-02-37-35-489_com.facebook.lite_.png`,
    color: '#C9A84C', icon: 'diamond-outline',
  },
  {
    id: '2', name: 'Gold Necklace', category: 'Necklaces',
    description: 'Traditional 22K gold necklace, BIS hallmarked',
    imageUrl: `${WP}/Screenshot_2026-03-08-19-44-44-723_com.facebook.lite_.png`,
    color: '#C9A84C', icon: 'diamond-outline',
  },
  {
    id: '3', name: 'Diamond Earrings', category: 'Earrings',
    description: 'Elegant 18K gold diamond earrings',
    imageUrl: `${WP}/Screenshot_2026-03-11-02-44-02-271_com.facebook.lite-1.png`,
    color: '#9B6ED4', icon: 'diamond-outline',
  },
  {
    id: '4', name: 'Gold Bangles', category: 'Bangles',
    description: 'Set of 4 traditional 22K gold bangles',
    imageUrl: `${WP}/Screenshot_2026-03-11-02-32-56-418_com.facebook.lite_.png`,
    color: '#E8A838', icon: 'diamond-outline',
  },
  {
    id: '5', name: 'Gold Chain', category: 'Chains',
    description: 'Everyday wear 22K gold chain, 916 certified',
    imageUrl: `${WP}/file_00000000d1a071fab06fbf048655557e.png`,
    color: '#C9A84C', icon: 'diamond-outline',
  },
  {
    id: '6', name: 'Bridal Set', category: 'Bridal',
    description: 'Complete bridal jewellery set — necklace, earrings & maang tikka',
    imageUrl: `${WP}/Screenshot_2026-03-08-19-44-40-125_com.facebook.lite_.png`,
    color: '#D4608A', icon: 'diamond-outline',
  },
  {
    id: '7', name: 'Elegant Ring', category: 'Silver',
    description: '999 pure silver anklets, BIS hallmarked',
    imageUrl: `${WP}/Screenshot_2026-03-11-02-36-37-183_com.facebook.lite_.png`,
    color: '#A0A0B8', icon: 'diamond-outline',
  },
  {
    id: '8', name: 'Luxury Ring', category: 'Special',
    description: 'SRJ Premium Collection',
    imageUrl: `${WP}/Screenshot_2026-03-11-02-37-24-543_com.facebook.lite_.png`,
    color: '#C9A84C', icon: 'diamond-outline',
  },
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

  // ── Gold rates — loaded from AsyncStorage (set by GoldRatesScreen admin) ──
  const [goldData, setGoldData]   = useState<GoldRateData | null>(null);
  const [ratesLoading, setRatesLoading] = useState(true);

  const bannerRef = useRef<FlatList>(null);
  const scrollX   = useRef(new Animated.Value(0)).current;

  // ── Auto-scroll banner ────────────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => {
      const next = (bannerIdx + 1) % BANNERS.length;
      bannerRef.current?.scrollToIndex({ index: next, animated: true });
      setBannerIdx(next);
    }, 4000);
    return () => clearInterval(t);
  }, [bannerIdx]);

  // ── Load gold rates from AsyncStorage (shared with GoldRatesScreen) ───────
  useEffect(() => {
    let mounted = true;

    const fetchRates = async () => {
      setRatesLoading(true);
      const data = await loadGoldRates();
      if (mounted) {
        setGoldData(data);
        setRatesLoading(false);
      }
    };

    fetchRates();

    // Re-fetch every time the screen comes into focus.
    // If you're using React Navigation, replace this with useFocusEffect.
    // For a simple interval refresh every 30 s (catches admin updates):
    const interval = setInterval(fetchRates, 30_000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const whatsapp  = () => Linking.openURL('https://wa.me/918377911745');
  const bookVisit = () => Linking.openURL('https://wa.me/918377911745?text=I%20would%20like%20to%20book%20a%20store%20visit');

  // ── Filter products by search ─────────────────────────────────────────────
  const filteredProducts = search
    ? FEATURED_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      )
    : FEATURED_PRODUCTS;

  const getCatColor = (cat: string) => {
    const map: Record<string, string> = {
      Rings: '#9B6ED4', Necklaces: '#C9A84C', Chains: '#C9A84C',
      Earrings: '#D4608A', Bracelets: '#7B8ED4', Bangles: '#E8A838',
      Gold: '#C9A84C', Silver: '#A0A0B8', Bridal: '#D4608A', Special: '#C9A84C',
    };
    return map[cat] || '#C9A84C';
  };

  // ── Helpers for gold rate display ─────────────────────────────────────────
  const ratesSet    = !!goldData && goldData.rate24k > 0;
  const k22Display  = ratesSet ? goldData!.rate22k.toLocaleString('en-IN') : '---';
  const k24Display  = ratesSet ? goldData!.rate24k.toLocaleString('en-IN') : '---';
  const dateDisplay = goldData?.updatedDate || null;

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
                  <Image source={{ uri: item.image }} style={styles.bannerImage} resizeMode="cover" />
                </View>
              )}
            />
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
                    <Image source={{ uri: item.image }} style={styles.catImage} resizeMode="cover" />
                  </View>
                  <Text style={styles.catLabel}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* ── FEATURED PRODUCTS ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {search ? `Results for "${search}"` : 'Featured Products'}
            </Text>
            {!search && <View style={styles.sectionLine} />}
          </View>

          {filteredProducts.length === 0 ? (
            <Text style={styles.noResult}>No products found</Text>
          ) : (
            <FlatList
              data={filteredProducts}
              horizontal={!search}
              numColumns={search ? 2 : undefined}
              key={search ? 'grid' : 'list'}
              showsHorizontalScrollIndicator={false}
              keyExtractor={p => p.id}
              contentContainerStyle={
                search ? styles.gridContent : { paddingHorizontal: 16, gap: 12 }
              }
              renderItem={({ item }) => {
                const color = getCatColor(item.category);
                return (
                  <TouchableOpacity
                    style={search ? styles.productGridCard : styles.productCard}
                    onPress={() => onOpenProduct?.({
                    id:          parseInt(item.id),
                    name:        item.name,
                    category:    item.category,
                    description: item.description,
                    purity:      '',
                    image:       item.imageUrl,
                    imageUrl:    item.imageUrl,
                  } as any)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.productImgWrap}>
                      <Image
                        source={{ uri: item.imageUrl }}
                        style={styles.productImg}
                        resizeMode="cover"
                      />
                      <View style={styles.heartBadge}>
                        <Ionicons name="heart-outline" size={15} color="#AAA" />
                      </View>
                      <View style={[styles.catBadge, { backgroundColor: color + 'DD' }]}>
                        <Text style={styles.catBadgeText}>{item.category}</Text>
                      </View>
                    </View>
                    <View style={styles.productInfo}>
                      <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                      <Text style={styles.productDesc} numberOfLines={1}>{item.description}</Text>
                      <View style={styles.productBottom}>
                      <Text style={styles.productPurity}>{item.category}</Text>
                      <View style={styles.heartBtnSmall}>
                      <Ionicons name="heart" size={13} color={GOLD} />
                        </View>
                       </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>

        {/* ── GOLD RATES ────────────────────────────────────────────────────── */}
        {/* Now reads from AsyncStorage — same data the admin sets in GoldRatesScreen */}
        {!search && (
          <View style={styles.section}>
            <View style={[styles.sectionHeader, { justifyContent: 'center' }]}>
              <View style={styles.sectionLine} />
              <Text style={[styles.sectionTitle, { marginHorizontal: 10 }]}>◆ Gold Rates ◆</Text>
              <View style={styles.sectionLine} />
            </View>

            <View style={styles.goldCard}>
              {/* 22K / 24K prices */}
              <View style={styles.goldRow}>
                <View style={styles.goldItem}>
                  <Text style={styles.goldKarat}>22K</Text>
                  <Text style={styles.goldPrice}>₹{k22Display}</Text>
                  <Text style={styles.goldSubLabel}>per gram</Text>
                </View>
                <View style={styles.goldDivider} />
                <View style={styles.goldItem}>
                  <Text style={styles.goldKarat}>24K</Text>
                  <Text style={styles.goldPrice}>₹{k24Display}</Text>
                  <Text style={styles.goldSubLabel}>per gram</Text>
                </View>
              </View>

              {/* Status row */}
              <View style={styles.goldStatusRow}>
                {ratesLoading ? (
                  <Text style={styles.goldStatusText}>Loading rates…</Text>
                ) : ratesSet ? (
                  <>
                    <Ionicons name="checkmark-circle" size={12} color={GREEN} />
                    <Text style={[styles.goldStatusText, { color: GREEN }]}>
                      Updated {dateDisplay}
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="alert-circle" size={12} color={RED} />
                    <Text style={[styles.goldStatusText, { color: RED }]}>
                      Rates not set — open Gold Rates tab to update
                    </Text>
                  </>
                )}
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

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: PURPLE_DARK },
  scroll: { flex: 1, backgroundColor: BG },

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

  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: BG_CARD, borderRadius: 24,
    marginHorizontal: 16, marginTop: 14, marginBottom: 4,
    paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: BORDER,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  searchInput: { flex: 1, fontSize: 14, color: TEXT_DARK },

  bannerWrap:  { marginTop: 12 },
  bannerSlide: { width: W, height: 220 },
  bannerImage: { width: '100%', height: '100%' },
  dots:        { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 8 },
  dot:         { width: 6, height: 6, borderRadius: 3, backgroundColor: '#C8B8E8' },
  dotActive:   { width: 18, backgroundColor: GOLD },

  section: { marginTop: 18 },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, marginBottom: 12, gap: 8,
  },
  sectionTitle: { color: TEXT_DARK, fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
  sectionLine:  { flex: 1, height: 1, backgroundColor: BORDER },
  noResult:     { color: TEXT_MID, textAlign: 'center', marginTop: 20, fontSize: 14 },

  catItem:   { alignItems: 'center', width: 68 },
  catCircle: {
    width: 58, height: 58, borderRadius: 29, overflow: 'hidden',
    borderWidth: 2, borderColor: GOLD,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  catImage:  { width: '100%', height: '100%' },
  catLabel:  { color: TEXT_MID, fontSize: 11, fontWeight: '600', marginTop: 5, textAlign: 'center' },

  productCard: {
    width: 155, backgroundColor: BG_CARD, borderRadius: 14,
    borderWidth: 1, borderColor: BORDER, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  productGridCard: {
    flex: 1, margin: 6, backgroundColor: BG_CARD, borderRadius: 14,
    borderWidth: 1, borderColor: BORDER, overflow: 'hidden',
  },
  gridContent:    { paddingHorizontal: 10 },
  productImgWrap: { position: 'relative' },
  productImg:     { width: '100%', height: 130 },
  heartBadge: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 12,
    width: 26, height: 26, alignItems: 'center', justifyContent: 'center',
  },
  catBadge: {
    position: 'absolute', bottom: 6, left: 6,
    borderRadius: 99, paddingHorizontal: 7, paddingVertical: 2,
  },
  catBadgeText:  { color: '#fff', fontSize: 9, fontWeight: '700' },
  productInfo:   { padding: 10 },
  productName:   { color: TEXT_DARK, fontSize: 12, fontWeight: '700' },
  productDesc:   { color: TEXT_LIGHT, fontSize: 10, marginTop: 2 },
  productBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  productPurity: { color: PURPLE_MID, fontSize: 11, fontWeight: '700' },
  heartBtnSmall: {
    backgroundColor: 'rgba(201,168,76,0.12)', borderRadius: 10,
    width: 24, height: 24, alignItems: 'center', justifyContent: 'center',
  },

  // Gold card
  goldCard: {
    marginHorizontal: 16, backgroundColor: PURPLE_HERO,
    borderRadius: 16, borderWidth: 1.5, borderColor: GOLD, padding: 16,
  },
  goldRow:      { flexDirection: 'row', alignItems: 'center' },
  goldItem:     { flex: 1, alignItems: 'center', gap: 4 },
  goldKarat:    { color: GOLD_LIGHT, fontSize: 13, fontWeight: '700', letterSpacing: 1 },
  goldPrice:    { color: '#fff', fontSize: 22, fontWeight: '900' },
  goldSubLabel: { color: 'rgba(255,255,255,0.45)', fontSize: 10, fontWeight: '500' },
  goldDivider:  { width: 1, height: 50, backgroundColor: 'rgba(201,168,76,0.4)' },
  goldStatusRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 4, marginTop: 12, paddingTop: 10,
    borderTopWidth: 1, borderTopColor: 'rgba(201,168,76,0.2)',
  },
  goldStatusText: {
    fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: '600',
  },

  trustRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    marginHorizontal: 16, marginTop: 18,
    backgroundColor: BG_CARD, borderRadius: 14,
    borderWidth: 1, borderColor: BORDER, paddingVertical: 14,
  },
  trustItem:  { alignItems: 'center', gap: 6 },
  trustLabel: { color: TEXT_MID, fontSize: 11, fontWeight: '600', textAlign: 'center', lineHeight: 15 },

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
