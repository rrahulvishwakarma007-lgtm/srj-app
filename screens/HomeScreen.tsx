import React, { useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, FlatList, Animated, Linking, Alert, Dimensions, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Theme, Radius } from '../lib/theme';
import { products, initialGoldRates } from '../lib/data';
import { Product } from '../lib/types';

const { width } = Dimensions.get('window');
const WHATSAPP = '918377911745';
const WA_URL = (msg: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

const OCCASIONS = [
  { label: 'Wedding',    icon: 'heart',    color: '#E91E8C' },
  { label: 'Festive',   icon: 'sparkles', color: '#C9A84C' },
  { label: 'Daily',     icon: 'sunny',    color: '#7C3AED' },
  { label: 'Gifting',   icon: 'gift',     color: '#D04848' },
];

interface Props { onOpenProduct: (p: Product) => void; wishlist: Product[]; }

export default function HomeScreen({ onOpenProduct }: Props) {
  const trending = products.slice(0, 6);
  const featured = products.slice(4, 10);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start(); }, []);

  const handleWhatsApp = () => {
    Linking.openURL(WA_URL('Hello Shekhar Raja Jewellers! I would like to know more about your collection.')).catch(() => Alert.alert('WhatsApp', `+${WHATSAPP}`));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.ScrollView style={{ opacity: fadeAnim }} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>

        {/* ── HERO ── */}
        <View style={styles.hero}>
          {/* Top bar with store name */}
          <View style={styles.heroTopBar}>
            <View style={styles.heroBrand}>
              <Ionicons name="diamond" size={18} color={Theme.gold} />
              <Text style={styles.heroBrandText}>Shekhar Raja Jewellers</Text>
            </View>
            <TouchableOpacity style={styles.heroWishIcon} onPress={handleWhatsApp}>
              <Ionicons name="logo-whatsapp" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Hero Content */}
          <View style={styles.heroBanner}>
            <View style={styles.heroIconCircle}>
              <Ionicons name="diamond" size={52} color={Theme.gold} />
            </View>
            <Text style={styles.heroEst}>EST. 1987  ◆  JABALPUR</Text>
            <Text style={styles.heroTitle}>Fine Jewellery</Text>
            <Text style={styles.heroClaim}>22K & 24K Gold · Hallmarked · Trusted since 1987</Text>

            <TouchableOpacity style={styles.heroWaBtn} onPress={handleWhatsApp} activeOpacity={0.85}>
              <Ionicons name="logo-whatsapp" size={17} color="#fff" />
              <Text style={styles.heroWaText}>Chat on WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── SEARCH BAR (like Shaya) ── */}
        <View style={styles.searchWrap}>
          <TouchableOpacity style={styles.searchBar} activeOpacity={0.8}>
            <Ionicons name="search" size={18} color={Theme.textMuted} />
            <Text style={styles.searchPlaceholder}>Search rings, necklaces, earrings…</Text>
          </TouchableOpacity>
        </View>

        {/* ── QUICK CHIPS ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {['New Arrivals','Rings','Necklaces','Earrings','Bracelets','Pendants'].map((c, i) => (
            <TouchableOpacity key={i} style={[styles.chip, i === 0 && styles.chipActive]}>
              <Text style={[styles.chipText, i === 0 && styles.chipTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── GOLD RATES CARD ── */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Today's Gold Rates</Text>
            <View style={styles.liveTag}>
              <View style={styles.liveDot} />
              <Text style={styles.liveTxt}>LIVE</Text>
            </View>
          </View>
          <View style={styles.goldCard}>
            {(initialGoldRates || [
              { type: '24K Gold', price: 9850, unit: 'per 10g' },
              { type: '22K Gold', price: 9020, unit: 'per 10g' },
              { type: '18K Gold', price: 7380, unit: 'per 10g' },
            ]).slice(0, 3).map((r: any, i: number) => (
              <View key={i} style={[styles.goldRow, i < 2 && { borderBottomWidth: 1, borderBottomColor: Theme.borderLight }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={styles.goldDot} />
                  <Text style={styles.goldType}>{r.type}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.goldPrice}>₹{r.price.toLocaleString('en-IN')}</Text>
                  <Text style={styles.goldUnit}>{r.unit}</Text>
                </View>
              </View>
            ))}
            <Text style={styles.goldNote}>◆  Open Gold tab for full live rates</Text>
          </View>
        </View>

        {/* ── TRENDING ── */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Trending Pieces</Text>
            <Text style={styles.sectionSub}>Most enquired this week</Text>
          </View>
          <FlatList
            horizontal
            data={trending}
            keyExtractor={i => String(i.id)}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.trendCard} activeOpacity={0.88} onPress={() => onOpenProduct(item)}>
                <View style={styles.trendImg}>
                  <Ionicons name={item.icon as any} size={36} color={Theme.gold} />
                </View>
                <Text style={styles.trendName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.trendDesc} numberOfLines={1}>{item.description}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 }}>
                  <Text style={styles.trendCta}>Enquire</Text>
                  <Ionicons name="arrow-forward" size={11} color={Theme.purple} />
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* ── SHOP BY OCCASION ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Occasion</Text>
          <View style={styles.occasionGrid}>
            {OCCASIONS.map((o, i) => (
              <TouchableOpacity key={i} style={styles.occasionCard} activeOpacity={0.85}>
                <View style={[styles.occasionIcon, { backgroundColor: o.color + '18' }]}>
                  <Ionicons name={o.icon as any} size={22} color={o.color} />
                </View>
                <Text style={styles.occasionLabel}>{o.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── FEATURED ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Collections</Text>
          <FlatList
            horizontal
            data={featured}
            keyExtractor={i => String(i.id)}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.featCard} onPress={() => onOpenProduct(item)} activeOpacity={0.88}>
                <View style={styles.featImg}>
                  <Ionicons name={item.icon as any} size={32} color={Theme.gold} />
                </View>
                <View style={{ padding: 12 }}>
                  <Text style={styles.featName} numberOfLines={2}>{item.name}</Text>
                  <Text style={styles.featDesc} numberOfLines={1}>{item.description}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* ── STORE STRIP ── */}
        <TouchableOpacity style={styles.storeStrip} onPress={() => Linking.openURL('https://www.google.com/maps/place/Shekhar+Raja+Jewellers')} activeOpacity={0.88}>
          <View style={styles.storeLeft}>
            <View style={styles.storeIcon}><Ionicons name="location" size={20} color={Theme.gold} /></View>
            <View>
              <Text style={styles.storeTitle}>Visit Our Showroom</Text>
              <Text style={styles.storeSub}>Sarafa · Napier Town · Jabalpur, MP</Text>
            </View>
          </View>
          <View style={styles.storeBtn}>
            <Ionicons name="navigate" size={14} color="#fff" />
          </View>
        </TouchableOpacity>

      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.bgPrimary },

  // Hero
  hero: { backgroundColor: Theme.bgPurple },
  heroTopBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18, paddingTop: 14, paddingBottom: 10,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.12)',
  },
  heroBrand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  heroBrandText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800', letterSpacing: 0.5 },
  heroWishIcon: { padding: 4 },
  heroBanner: {
    alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 28, paddingBottom: 32,
  },
  heroIconCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 2, borderColor: 'rgba(201,168,76,0.5)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
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
