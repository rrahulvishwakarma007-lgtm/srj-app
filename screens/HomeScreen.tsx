import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, FlatList, Dimensions, Image, Animated, Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../lib/types';
import { loadGoldRates, GoldRateData } from '../lib/goldRateStorage';

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

// ── Google Drive direct URL helper ────────────────────────────────────────────
const gd = (id: string) => `https://drive.google.com/uc?export=view&id=${id}`;

// ── BANNER IMAGES (4 slides) ──────────────────────────────────────────────────
const BANNERS = [
  {
    id: '1',
    image: gd('1rWIZWMuFpSeKJm00vLm6ZeQnCyucIY1X'),
    title: 'Bridal\nCollection',
    sub:   'Discover Your Perfect Look',
    btn:   'Explore Collection',
  },
  {
    id: '2',
    image: gd('1hjlowZZTSXZ5ikEy4eldIxMg30FOLeYv'),
    title: 'Fine\nJewellery',
    sub:   '22K & 24K Gold · Hallmarked',
    btn:   'View Catalogue',
  },
 {
  id: '3',
  image: 'https://nxtgenailabs.work/hero3.png',
  title: 'Gold\nCollections',
  sub:   'Crafted for Every Occasion',
  btn:   'Shop Now',
},
  {
    id: '4',
    image: gd('1PWCiHTyvgTxAcMJ5W_y-cbt5E_C2pUUG'),
    title: 'Exclusive\nDesigns',
    sub:   'BIS Hallmarked · Certified',
    btn:   'Explore Now',
  },
];

// ── CATEGORIES ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: '1', image: gd('178WZEQ5UhlSu0NJ2D7buXiBFyhRXd0TN'), label: 'Gold'      },
  { id: '2', image: gd('1UFEF3zn8NKjGHxJjmlaAa4ZF0utIVwae'), label: 'Silver'    },
  { id: '3', image: gd('1etFrF2xVdxtcEYDZkAPD4NNZwNGkUmWN'), label: 'Bridal'    },
  { id: '4', image: gd('1IB_iNGjIlPQl2h4rqNfypU-Uqtrl2egk'), label: 'Rings'     },
  { id: '5', image: gd('1uFouP3vJqRn3xg0_-XaYF5WstCjDmoOK'), label: 'Chains'    },
  { id: '6', image: gd('1bOjrDufMVW8WSHXRVaWvwSgaFVrNPafB'), label: 'Daily Wear' },
  { id: '7', image: gd('1rz-e2uhRWYQsOyEJG_O0B3dekF0kpu43'), label: 'Special'   },
];

// ── FEATURED PRODUCTS ─────────────────────────────────────────────────────────
interface StaticProduct {
  id: string; name: string; category: string;
  description: string; purity: string;
  imageUrl: string; color: string; icon: string;
}

const FEATURED_PRODUCTS: StaticProduct[] = [
  // ── RINGS ──
  {
    id: '1', name: 'Gold Ring', category: 'Rings',
    description: 'Classic 22K gold ring with intricate design',
    imageUrl: gd('1IB_iNGjIlPQl2h4rqNfypU-Uqtrl2egk'),
    color: '#C9A84C', icon: 'diamond-outline', purity: '',
  },
  {
    id: '9', name: 'Designer Ring', category: 'Rings',
    description: 'Elegant 22K gold designer ring',
    imageUrl: gd('1y9O-LEkRfva8KAYrRvQwtYSuqce71jRL'),
    color: '#C9A84C', icon: 'diamond-outline', purity: '',
  },
  {
    id: '10', name: 'Solitaire Ring', category: 'Rings',
    description: 'Premium 18K gold solitaire ring',
    imageUrl: gd('199ujiz-55egisPpSz57JO_7JIlNPsaqK'),
    color: '#C9A84C', icon: 'diamond-outline', purity: '',
  },
  {
    id: '11', name: 'Cocktail Ring', category: 'Rings',
    description: 'Statement cocktail ring in 22K gold',
    imageUrl: gd('1quBTTS1bwijG-XAoT_7RLfQqBgk3kp_W'),
    color: '#C9A84C', icon: 'diamond-outline', purity: '',
  },
  {
    id: '12', name: 'Floral Ring', category: 'Rings',
    description: 'Beautiful floral motif gold ring',
    imageUrl: gd('1LwA1xfMggIH_KywUUUuEEf9WJtpXdxmN'),
    color: '#C9A84C', icon: 'diamond-outline', purity: '',
  },
  {
    id: '13', name: 'Traditional Ring', category: 'Rings',
    description: 'Traditional 22K gold ring with stone work',
    imageUrl: gd('1nQRYBdiR2VFjhf85y9aTyGzfuTv-KHk6'),
    color: '#C9A84C', icon: 'diamond-outline', purity: '',
  },
  {
    id: '14', name: 'Luxury Ring', category: 'Rings',
    description: 'SRJ Premium luxury gold ring',
    imageUrl: gd('1275Tcoywws7DtFDVQ4UmzEvVk9FnRy9d'),
    color: '#C9A84C', icon: 'diamond-outline', purity: '',
  },

  // ── NECKLACES ──
  {
    id: '2', name: 'Gold Necklace', category: 'Necklaces',
    description: 'Traditional 22K gold necklace, BIS hallmarked',
    imageUrl: gd('178WZEQ5UhlSu0NJ2D7buXiBFyhRXd0TN'),
    color: '#C9A84C', icon: 'diamond-outline', purity: '',
  },
  {
    id: '15', name: 'Bridal Necklace', category: 'Necklaces',
    description: 'Stunning bridal necklace in 22K gold',
    imageUrl: gd('1etFrF2xVdxtcEYDZkAPD4NNZwNGkUmWN'),
    color: '#C9A84C', icon: 'diamond-outline', purity: '',
  },
  {
    id: '16', name: 'Kundan Necklace', category: 'Necklaces',
    description: 'Royal Kundan necklace with meenakari work',
    imageUrl: gd('1gjyEU0uPpfHKiuvoTfR847mkr2J5LHqW'),
    color: '#C9A84C', icon: 'diamond-outline', purity: '',
  },
  {
    id: '17', name: 'Temple Necklace', category: 'Necklaces',
    description: 'Antique temple jewellery necklace',
    imageUrl: gd('1ZYL2io58ZBM3Zj5TUb29yZzIZCBpERVp'),
    color: '#C9A84C', icon: 'diamond-outline', purity: '',
  },
  {
    id: '18', name: 'Long Haar', category: 'Necklaces',
    description: 'Long gold haar with pendant',
    imageUrl: gd('1MGHQ9y1ZwLSZFwyWzqPLMy4s2u0s4YCw'),
    color: '#C9A84C', icon: 'diamond-outline', purity: '',
  },
  {
    id: '19', name: 'Choker Necklace', category: 'Necklaces',
    description: 'Elegant gold choker necklace',
    imageUrl: gd('1u28Db88v2mghzWUUf8wweLxtWygCLxwr'),
    color: '#C9A84C', icon: 'diamond-outline', purity: '',
  },

  // ── EARRINGS ──
  {
    id: '3', name: 'Gold Earrings', category: 'Earrings',
    description: 'Elegant 22K gold earrings',
    imageUrl: gd('1rz-e2uhRWYQsOyEJG_O0B3dekF0kpu43'),
    color: '#9B6ED4', icon: 'diamond-outline', purity: '',
  },
  {
    id: '20', name: 'Jhumka Earrings', category: 'Earrings',
    description: 'Traditional jhumka earrings in 22K gold',
    imageUrl: gd('1UFEF3zn8NKjGHxJjmlaAa4ZF0utIVwae'),
    color: '#9B6ED4', icon: 'diamond-outline', purity: '',
  },
  {
    id: '21', name: 'Chandbali Earrings', category: 'Earrings',
    description: 'Royal chandbali earrings with stone work',
    imageUrl: gd('1UBsPeXQU5XHUyVjpeT3iSIyTt1PJPIRx'),
    color: '#9B6ED4', icon: 'diamond-outline', purity: '',
  },
  {
    id: '22', name: 'Drop Earrings', category: 'Earrings',
    description: 'Beautiful gold drop earrings',
    imageUrl: gd('1VpZkJ5u7IVaj3ifTBMbHC2IJsvCCh-qh'),
    color: '#9B6ED4', icon: 'diamond-outline', purity: '',
  },
  {
    id: '23', name: 'Stud Earrings', category: 'Earrings',
    description: 'Classic gold stud earrings, everyday wear',
    imageUrl: gd('1zdHsdwLPyBt6O5Zf4zk_i-XmDvcB7IRv'),
    color: '#9B6ED4', icon: 'diamond-outline', purity: '',
  },
  {
    id: '24', name: 'Pearl Earrings', category: 'Earrings',
    description: 'Gold earrings with pearl drops',
    imageUrl: gd('1WmTgcFqU_UT3rFMeXmeWIF-68DJgsO05'),
    color: '#9B6ED4', icon: 'diamond-outline', purity: '',
  },

  // ── BANGLES ──
  {
    id: '4', name: 'Gold Bangles', category: 'Bangles',
    description: 'Set of 4 traditional 22K gold bangles',
    imageUrl: gd('1bOjrDufMVW8WSHXRVaWvwSgaFVrNPafB'),
    color: '#E8A838', icon: 'diamond-outline', purity: '',
  },
  {
    id: '25', name: 'Designer Bangles', category: 'Bangles',
    description: 'Designer gold bangles with enamel work',
    imageUrl: gd('1JMwkg6uXC_tnnB9ytEUolrehfj6f4-nv'),
    color: '#E8A838', icon: 'diamond-outline', purity: '',
  },
  {
    id: '26', name: 'Antique Bangles', category: 'Bangles',
    description: 'Antique finish gold bangles',
    imageUrl: gd('1qdjSq4qUROtXjSEEfSR5AEWrbGWwJhve'),
    color: '#E8A838', icon: 'diamond-outline', purity: '',
  },
  {
    id: '27', name: 'Bridal Bangles', category: 'Bangles',
    description: 'Bridal gold bangle set with stone work',
    imageUrl: gd('1t2DbNoLDld25xryH5owdAAbDoFs674RW'),
    color: '#E8A838', icon: 'diamond-outline', purity: '',
  },
  {
    id: '28', name: 'Kada Bangles', category: 'Bangles',
    description: 'Heavy gold kada for special occasions',
    imageUrl: gd('1Q7P4-Yi-_tJ48rD3OW6P5OjuwFCTXGWs'),
    color: '#E8A838', icon: 'diamond-outline', purity: '',
  },

  // ── CHAINS ──
  {
    id: '5', name: 'Gold Chain', category: 'Chains',
    description: 'Everyday wear 22K gold chain, 916 certified',
    imageUrl: gd('1uFouP3vJqRn3xg0_-XaYF5WstCjDmoOK'),
    color: '#C9A84C', icon: 'diamond-outline', purity: '',
  },
  {
    id: '29', name: 'Figaro Chain', category: 'Chains',
    description: 'Italian figaro chain in 22K gold',
    imageUrl: gd('1Js6g0OUeKC8dNVhqHczaP0XhjcYn6cgP'),
    color: '#C9A84C', icon: 'diamond-outline', purity: '',
  },
  {
    id: '30', name: 'Box Chain', category: 'Chains',
    description: 'Elegant box chain in 22K gold',
    imageUrl: gd('1w9ywVe_xPI8JL7yzHo5bH8B-exvYgHYf'),
    color: '#C9A84C', icon: 'diamond-outline', purity: '',
  },
  {
    id: '31', name: 'Rope Chain', category: 'Chains',
    description: 'Classic rope chain in 22K gold',
    imageUrl: gd('1zZrMUlrPdYgzEX3u679ogJTj9TY3Tord'),
    color: '#C9A84C', icon: 'diamond-outline', purity: '',
  },
  {
    id: '32', name: 'Curb Chain', category: 'Chains',
    description: 'Heavy curb chain in 22K gold',
    imageUrl: gd('18EZBNVN3MvqiKdXrVOf-xDn76YTXEE21'),
    color: '#C9A84C', icon: 'diamond-outline', purity: '',
  },

  // ── BRIDAL ──
  {
    id: '6', name: 'Bridal Set', category: 'Bridal',
    description: 'Complete bridal jewellery set — necklace, earrings & maang tikka',
    imageUrl: gd('1gjyEU0uPpfHKiuvoTfR847mkr2J5LHqW'),
    color: '#D4608A', icon: 'diamond-outline', purity: '',
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

  const [search,       setSearch]       = useState('');
  const [bannerIdx,    setBannerIdx]    = useState(0);
  const [goldData,     setGoldData]     = useState<GoldRateData | null>(null);
  const [ratesLoading, setRatesLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

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

  // ── Load gold rates ───────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    const fetchRates = async () => {
      setRatesLoading(true);
      const data = await loadGoldRates();
      if (mounted) { setGoldData(data); setRatesLoading(false); }
    };
    fetchRates();
    const interval = setInterval(fetchRates, 30_000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  const whatsapp  = () => Linking.openURL('https://wa.me/918377911745');
  const bookVisit = () => Linking.openURL('https://wa.me/918377911745?text=I%20would%20like%20to%20book%20a%20store%20visit');

  const getCatColor = (cat: string) => {
    const map: Record<string, string> = {
      Rings: '#9B6ED4', Necklaces: '#C9A84C', Chains: '#C9A84C',
      Earrings: '#D4608A', Bracelets: '#7B8ED4', Bangles: '#E8A838',
      Gold: '#C9A84C', Silver: '#A0A0B8', Bridal: '#D4608A', Special: '#C9A84C',
    };
    return map[cat] || '#C9A84C';
  };

  // ── Filter by search AND category ─────────────────────────────────────────
  const filteredProducts = FEATURED_PRODUCTS.filter(p => {
    const matchSearch = search
      ? p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchCat = activeCategory === 'All' ? true : p.category === activeCategory;
    return matchSearch && matchCat;
  });

  const ratesSet    = !!goldData && goldData.rate24k > 0;
  const k22Display  = ratesSet ? goldData!.rate22k.toLocaleString('en-IN') : '---';
  const k24Display  = ratesSet ? goldData!.rate24k.toLocaleString('en-IN') : '---';
  const dateDisplay = goldData?.updatedDate || null;

  const catTabs = ['All', 'Rings', 'Necklaces', 'Earrings', 'Bangles', 'Chains', 'Bridal'];

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

        {/* ── BANNER CAROUSEL (4 slides) ── */}
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
                  <Image
                    source={typeof item.image === "string" ? { uri: item.image } : item.image}
                    style={styles.bannerImage}
                    resizeMode="cover"
                  />
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
                <TouchableOpacity
                  style={styles.catItem}
                  activeOpacity={0.8}
                  onPress={() => setActiveCategory(
                    activeCategory === item.label ? 'All' : item.label
                  )}
                >
                  <View style={[
                    styles.catCircle,
                    activeCategory === item.label && { borderColor: PURPLE_MID, borderWidth: 3 },
                  ]}>
                    <Image source={{ uri: item.image }} style={styles.catImage} resizeMode="cover" />
                  </View>
                  <Text style={[
                    styles.catLabel,
                    activeCategory === item.label && { color: PURPLE_MID, fontWeight: '800' },
                  ]}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* ── CATEGORY FILTER TABS ── */}
        {!search && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsWrap}
          >
            {catTabs.map(tab => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeCategory === tab && styles.tabActive]}
                onPress={() => setActiveCategory(tab)}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, activeCategory === tab && styles.tabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* ── FEATURED PRODUCTS ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {search
                ? `Results for "${search}"`
                : activeCategory === 'All'
                  ? 'All Products'
                  : activeCategory}
            </Text>
            {!search && <View style={styles.sectionLine} />}
          </View>

          {filteredProducts.length === 0 ? (
            <Text style={styles.noResult}>No products found</Text>
          ) : (
            <FlatList
              data={filteredProducts}
              horizontal={!search && activeCategory === 'All'}
              numColumns={search || activeCategory !== 'All' ? 2 : undefined}
              key={search || activeCategory !== 'All' ? 'grid' : 'list'}
              showsHorizontalScrollIndicator={false}
              keyExtractor={p => p.id}
              contentContainerStyle={
                search || activeCategory !== 'All'
                  ? styles.gridContent
                  : { paddingHorizontal: 16, gap: 12 }
              }
              renderItem={({ item }) => {
                const color = getCatColor(item.category);
                const isGrid = search || activeCategory !== 'All';
                return (
                  <TouchableOpacity
                    style={isGrid ? styles.productGridCard : styles.productCard}
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

  tabsWrap: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  tab: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1, borderColor: BORDER,
    backgroundColor: BG_CARD,
  },
  tabActive:     { backgroundColor: PURPLE_DARK, borderColor: PURPLE_DARK },
  tabText:       { fontSize: 12, fontWeight: '600', color: TEXT_MID },
  tabTextActive: { color: GOLD },

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
  productImg:     { width: '100%', height: 150 },
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
  goldStatusText: { fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: '600' },

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
