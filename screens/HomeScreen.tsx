import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, FlatList, TextInput, Image, Dimensions, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// Royal luxury palette
const VIOLET = '#4B2E83';
const PLUM = '#2A1B4D';
const GOLD = '#D4AF37';
const CREAM = '#F6F0E6';
const WHITE = '#FFFFFF';
const DEEP = '#1F172F';

// Hero images from brand site
const HERO_IMAGES = [
  'https://shekharrajajewellers.com/wp-content/uploads/2026/04/jewellery_banner_1920x1080.png',
  'https://shekharrajajewellers.com/wp-content/uploads/2026/04/ChatGPT-Image-Apr-5-2026-01_09-1.png',
  'https://shekharrajajewellers.com/wp-content/uploads/2026/04/jewellery_banner_full_no_crop.png',
];

const CATEGORIES = [
  { name: 'Gold', icon: 'diamond-outline' },
  { name: 'Silver', icon: 'ellipse-outline' },
  { name: 'Bridal', icon: 'flower-outline' },
  { name: 'Rings', icon: 'ellipse' },
  { name: 'Chains', icon: 'link' },
  { name: 'Daily Wear', icon: 'star-outline' },
];

const TRUST = [
  { icon: 'shield-checkmark', label: '100% Hallmarked' },
  { icon: 'ribbon', label: 'Certified Jewellery' },
  { icon: 'swap-horizontal', label: 'Easy Exchange' },
];

interface Product { id: number; name: string; price: number; weight: number; purity: string; }

const FEATURED: Product[] = [
  { id: 1, name: 'Royal Solitaire Ring', price: 124000, weight: 6.2, purity: '22K' },
  { id: 2, name: 'Heritage Necklace Set', price: 245000, weight: 38.5, purity: '22K' },
  { id: 3, name: 'Regal Hoop Earrings', price: 68500, weight: 12.8, purity: '22K' },
  { id: 4, name: 'Bangle Trio Set', price: 156000, weight: 42.0, purity: '22K' },
];

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [heroIndex, setHeroIndex] = useState(0);

  // Auto-rotate hero carousel
  useEffect(() => {
    const t = setInterval(() => setHeroIndex(i => (i + 1) % HERO_IMAGES.length), 3200);
    return () => clearInterval(t);
  }, []);

  // Live gold rates (demo)
  const [rates, setRates] = useState({ g22: 7200, g24: 7850 });
  const shimmer = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(shimmer, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(shimmer, { toValue: 0, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ])).start();
  }, []);
  const shimmerStyle = { opacity: shimmer.interpolate({ inputRange: [0,1], outputRange: [0.6, 1] }) };

  const goCategory = (c: string) => navigation.navigate('Catalogue');
  const goProduct = (p: Product) => navigation.navigate('Catalogue');
  const bookVisit = () => navigation.navigate('Contact');
  const whatsapp = () => {};

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>

        {/* 1) TOP NAV — deep violet→plum gradient, gold logo, search, gold icons */}
        <View style={styles.nav}>
          <View style={styles.navLeft}><Ionicons name="diamond" size={22} color={GOLD} /><Text style={styles.brand}>SRJ</Text></View>
          <View style={styles.searchBox}><Ionicons name="search" size={16} color="#6B5C7A" /><TextInput style={styles.searchInput} placeholder="Search jewellery..." placeholderTextColor="#6B5C7A" value={search} onChangeText={setSearch} /></View>
          <View style={styles.navRight}>
            <TouchableOpacity onPress={() => navigation.navigate('Wishlist')}><Ionicons name="heart-outline" size={22} color={GOLD} /></TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 14 }} onPress={() => navigation.navigate('Catalogue')}><Ionicons name="cart-outline" size={22} color={GOLD} /></TouchableOpacity>
          </View>
        </View>

        {/* 2) HERO CAROUSEL — clean images only */}
        <View style={styles.heroWrap}>
          <Image source={{ uri: HERO_IMAGES[heroIndex] }} style={styles.heroImg} resizeMode="contain" />
          {/* dots */}
          <View style={styles.dots}>{HERO_IMAGES.map((_,i)=>(<View key={i} style={[styles.dot, i===heroIndex && styles.dotActive]} />))}</View>
        </View>

        {/* 3) CATEGORIES — glassy rounded, gold outlines */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <FlatList data={CATEGORIES} horizontal showsHorizontalScrollIndicator={false} keyExtractor={c=>c.name} contentContainerStyle={{ paddingHorizontal: 16 }} renderItem={({item})=>(
            <TouchableOpacity style={styles.catCard} onPress={()=>goCategory(item.name)}>
              <View style={styles.catIconWrap}><Ionicons name={item.icon as any} size={26} color={GOLD} /></View>
              <Text style={styles.catName}>{item.name}</Text>
            </TouchableOpacity>
          )} />
        </View>

        {/* 4) FEATURED PRODUCTS — horizontal, cream cards */}
        <View style={styles.section}>
          <View style={styles.secHeader}><Text style={styles.sectionTitle}>Featured Collection</Text><TouchableOpacity onPress={()=>navigation.navigate('Catalogue')}><Text style={styles.seeAll}>View All</Text></TouchableOpacity></View>
          <FlatList data={FEATURED} horizontal showsHorizontalScrollIndicator={false} keyExtractor={p=>String(p.id)} contentContainerStyle={{ paddingHorizontal: 16 }} renderItem={({item})=>(
            <TouchableOpacity style={styles.prodCard} onPress={()=>goProduct(item)}>
              <View style={styles.prodImgWrap}><Ionicons name="diamond" size={42} color={GOLD} /></View>
            </TouchableOpacity>
          )} />
        </View>

        {/* 5) LIVE GOLD RATE — premium gold gradient glass card + shimmer */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Gold Rate</Text>
          <View style={styles.goldCard}>
            <View style={styles.goldHeader}><Ionicons name="trending-up" size={18} color={GOLD} /><Text style={styles.goldHeaderText}>LIVE • Updated Now</Text></View>
            <Animated.View style={[styles.rateRow, shimmerStyle]}><Text style={styles.rateLabel}>22K Gold</Text><Text style={styles.rateVal}>₹{rates.g22}/10g</Text></Animated.View>
            <Animated.View style={[styles.rateRow, shimmerStyle]}><Text style={styles.rateLabel}>24K Gold</Text><Text style={styles.rateVal}>₹{rates.g24}/10g</Text></Animated.View>
            <Text style={styles.goldNote}>Rates indicative • Final at counter</Text>
          </View>
        </View>

        {/* 6) TRUST INDICATORS — gold icons + soft text */}
        <View style={styles.section}>
          <View style={styles.trustRow}>{TRUST.map(t=>(
            <View key={t.label} style={styles.trustItem}><Ionicons name={t.icon as any} size={20} color={GOLD} /><Text style={styles.trustText}>{t.label}</Text></View>
          ))}</View>
        </View>

        {/* 7) CTA — Book Visit (gold) + WhatsApp (violet) */}
        <View style={styles.ctaWrap}>
          <TouchableOpacity style={styles.ctaGold} onPress={bookVisit}><Text style={styles.ctaGoldText}>BOOK STORE VISIT</Text></TouchableOpacity>
          <TouchableOpacity style={styles.ctaViolet} onPress={whatsapp}><Ionicons name="logo-whatsapp" size={18} color={WHITE} /><Text style={styles.ctaVioletText}>CHAT ON WHATSAPP</Text></TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Deep violet→plum gradient via layered view trick (bg deep, nav/card gradients simulated)
  root: { flex: 1, backgroundColor: PLUM },
  // NAV
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 12, backgroundColor: VIOLET },
  navLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  brand: { color: GOLD, fontSize: 20, fontWeight: '900', letterSpacing: 3 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#EDE3D5', borderRadius: 20, marginHorizontal: 12, paddingHorizontal: 12, height: 36 },
  searchInput: { flex: 1, color: '#1F172F', paddingVertical: 0, fontSize: 14, marginLeft: 6 },
  navRight: { flexDirection: 'row', alignItems: 'center' },
  // HERO
  heroWrap: { width, height: 260, position: 'relative' },
  heroImg: { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(42,27,77,0.45)' },
  heroContent: { position: 'absolute', left: 20, right: 20, bottom: 28, alignItems: 'center' },
  heroTitle: { color: WHITE, fontSize: 22, fontWeight: '900', letterSpacing: 1, textAlign: 'center' },
  heroSub: { color: '#EDE3D5', fontSize: 13, marginTop: 6, marginBottom: 14 },
  heroBtn: { backgroundColor: GOLD, paddingVertical: 12, paddingHorizontal: 28, borderRadius: 26 },
  heroBtnText: { color: DEEP, fontSize: 13, fontWeight: '800', letterSpacing: 1.5 },
  dots: { position: 'absolute', bottom: 12, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.4)' },
  dotActive: { backgroundColor: GOLD, width: 18 },
  // SECTIONS
  section: { paddingVertical: 18 },
  sectionTitle: { color: '#EDE3D5', fontSize: 17, fontWeight: '900', letterSpacing: 1, paddingHorizontal: 20, marginBottom: 12 },
  secHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 10 },
  seeAll: { color: GOLD, fontWeight: '700' },
  // CATEGORIES
  catCard: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 18, paddingVertical: 14, paddingHorizontal: 18, marginRight: 12, borderWidth: 1, borderColor: GOLD, alignItems: 'center', width: 96 },
  catIconWrap: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(212,175,55,0.12)', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  catName: { color: '#EDE3D5', fontSize: 12, fontWeight: '700' },
  // FEATURED CARDS
  prodCard: { width: 170, backgroundColor: CREAM, borderRadius: 18, marginRight: 14, padding: 14, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  prodImgWrap: { height: 92, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1E7D8', borderRadius: 14, marginBottom: 10 },
  prodName: { color: DEEP, fontSize: 14, fontWeight: '800', lineHeight: 18 },
  prodMeta: { color: '#6B5C7A', fontSize: 11, marginTop: 3 },
  prodRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  prodPrice: { color: '#8C5C2D', fontSize: 16, fontWeight: '900' },
  // GOLD RATE
  goldCard: { marginHorizontal: 18, backgroundColor: 'rgba(212,175,55,0.12)', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: GOLD },
  goldHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  goldHeaderText: { color: GOLD, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  rateRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderTopWidth: 1, borderTopColor: 'rgba(212,175,55,0.25)' },
  rateLabel: { color: '#EDE3D5', fontSize: 15, fontWeight: '700' },
  rateVal: { color: GOLD, fontSize: 18, fontWeight: '900' },
  goldNote: { color: '#A38B6D', fontSize: 11, marginTop: 10, textAlign: 'center' },
  // TRUST
  trustRow: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 10 },
  trustItem: { alignItems: 'center', gap: 6 },
  trustText: { color: '#EDE3D5', fontSize: 11, fontWeight: '700' },
  // CTA
  ctaWrap: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 24 },
  ctaGold: { backgroundColor: GOLD, paddingVertical: 16, borderRadius: 26, alignItems: 'center', marginBottom: 12 },
  ctaGoldText: { color: DEEP, fontSize: 14, fontWeight: '900', letterSpacing: 1.5 },
  ctaViolet: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#C2185B', paddingVertical: 15, borderRadius: 26 },
  ctaVioletText: { color: WHITE, fontSize: 14, fontWeight: '800', letterSpacing: 1.5 },
});