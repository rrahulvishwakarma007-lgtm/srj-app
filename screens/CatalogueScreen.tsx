import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, Image, Linking, Alert, Dimensions, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Theme, Radius } from '../lib/theme';
import { Product } from '../lib/types';
import { products } from '../lib/data';

const { width } = Dimensions.get('window');
const CARD_W    = (width - 48) / 2;
const WHATSAPP  = '918377911745';
const WA_URL    = (msg: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

const CATEGORIES = [
  { label: 'All',       icon: 'grid-outline' },
  { label: 'Rings',     icon: 'radio-button-on-outline' },
  { label: 'Necklaces', icon: 'link-outline' },
  { label: 'Earrings',  icon: 'ellipse-outline' },
  { label: 'Bracelets', icon: 'repeat-outline' },
  { label: 'Pendants',  icon: 'diamond-outline' },
];

const BADGES   = ['NEW ARRIVE', 'STAFF PICK', 'TRENDING', 'BESTSELLER'];
const PURITIES = ['22K PURE', '24K PURE', '18K GOLD', '916 BIS'];

// ── Product Detail Overlay ────────────────────────────────────────────────
function ProductDetail({ product, onClose, isWishlisted, onToggleWishlist }: {
  product: Product | null;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}) {
  if (!product) return null;

  const enquire = () => {
    const msg = `Hello Shekhar Raja Jewellers,\n\nI would like to enquire about:\n*${product.name}*\n${product.description}\n\nPlease share details and availability.`;
    Linking.openURL(WA_URL(msg)).catch(() => Alert.alert('WhatsApp', `+${WHATSAPP}`));
  };

  const purity = PURITIES[product.id % PURITIES.length];
  const rating = (4.2 + (product.id % 8) * 0.1).toFixed(1);
  const reviews = 20 + (product.id * 7) % 80;

  return (
    <View style={det.wrap}>
      <TouchableOpacity style={det.close} onPress={onClose}>
        <Ionicons name="close" size={22} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Image */}
      <View style={det.imgArea}>
        {product.image
          ? <Image source={{ uri: product.image }} style={det.img} resizeMode="cover" />
          : <View style={det.iconWrap}><Ionicons name={product.icon as any} size={90} color={Theme.gold} /></View>
        }
        <View style={det.purityBadge}>
          <Text style={det.purityBadgeText}>{purity}</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={det.info}>
          {/* Rating row */}
          <View style={det.ratingRow}>
            <View style={det.stars}>
              {[1,2,3,4,5].map(s => (
                <Ionicons key={s} name={s <= 4 ? 'star' : 'star-half'} size={14} color={Theme.gold} />
              ))}
            </View>
            <Text style={det.ratingTxt}>{rating} ({reviews} reviews)</Text>
            <View style={det.staffPick}><Text style={det.staffPickTxt}>STAFF PICK</Text></View>
          </View>

          <Text style={det.name}>{product.name}</Text>
          <Text style={det.desc}>{product.description}</Text>

          {/* Specs */}
          <View style={det.specs}>
            {[
              { label: 'Weight',   value: `${product.weight || 3}g` },
              { label: 'Purity',   value: purity },
              { label: 'Hallmark', value: 'BIS 916' },
              { label: 'Making',   value: 'On request' },
            ].map((s, i) => (
              <View key={i} style={[det.specItem, i < 3 && { borderRightWidth: 1, borderRightColor: Theme.border }]}>
                <Text style={det.specLabel}>{s.label}</Text>
                <Text style={det.specValue}>{s.value}</Text>
              </View>
            ))}
          </View>

          {!!product.details && <Text style={det.details}>{product.details}</Text>}

          {/* You may also like */}
          <Text style={det.alsoLabel}>YOU MAY ALSO LIKE</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {products
              .filter(p => p.category === product.category && p.id !== product.id)
              .slice(0, 5)
              .map((p, i) => (
                <View key={i} style={det.alsoCard}>
                  <View style={det.alsoImg}>
                    {p.image
                      ? <Image source={{ uri: p.image }} style={{ width: '100%', height: '100%', borderRadius: Radius.md }} resizeMode="cover" />
                      : <Ionicons name={p.icon as any} size={26} color={Theme.gold} />
                    }
                  </View>
                  <Text style={det.alsoName} numberOfLines={2}>{p.name}</Text>
                  <Text style={det.alsoPurity}>{p.purity} GOLD</Text>
                </View>
              ))
            }
          </ScrollView>
        </View>
      </ScrollView>

      {/* Actions */}
      <View style={det.actions}>
        <TouchableOpacity style={det.wishBtn} onPress={onToggleWishlist}>
          <Ionicons
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={22}
            color={isWishlisted ? '#E91E8C' : Theme.textMuted}
          />
        </TouchableOpacity>
        <TouchableOpacity style={det.waBtn} onPress={enquire}>
          <Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" />
          <Text style={det.waTxt}>Enquire on WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Product Card ──────────────────────────────────────────────────────────
function ProductCard({ item, onPress, isWishlisted, onToggleWish, onEnquire }: {
  item: Product;
  onPress: () => void;
  isWishlisted: boolean;
  onToggleWish: () => void;
  onEnquire: () => void;
}) {
  const badge  = BADGES[item.id % BADGES.length];
  const purity = PURITIES[item.id % PURITIES.length];
  const rating = (4.2 + (item.id % 8) * 0.1).toFixed(1);
  const reviews= 20 + (item.id * 7) % 80;

  return (
    <TouchableOpacity style={[styles.card, { width: CARD_W }]} activeOpacity={0.92} onPress={onPress}>
      <View style={styles.imgWrap}>
        {item.image
          ? <Image source={{ uri: item.image }} style={styles.img} resizeMode="cover" />
          : <View style={styles.imgPlaceholder}><Ionicons name={item.icon as any} size={48} color={Theme.gold} /></View>
        }
        <View style={styles.badge}><Text style={styles.badgeTxt}>{badge}</Text></View>
        <TouchableOpacity style={styles.heartBtn} onPress={onToggleWish}>
          <Ionicons
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={17}
            color={isWishlisted ? '#E91E8C' : '#999'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.purityChip}>
          <Text style={styles.purityChipTxt}>{purity}</Text>
        </View>
        <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.cardDesc} numberOfLines={1}>{item.description}</Text>
        <View style={styles.ratingRow}>
          <View style={styles.stars}>
            {[1,2,3,4,5].map(s => (
              <Ionicons key={s} name={s <= 4 ? 'star' : 'star-half'} size={11} color={Theme.gold} />
            ))}
          </View>
          <Text style={styles.ratingTxt}>{rating}({reviews})</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.enquireBtn} onPress={onEnquire}>
        <Ionicons name="logo-whatsapp" size={13} color="#FFFFFF" />
        <Text style={styles.enquireTxt}>Enquire on WhatsApp</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────
export default function CatalogueScreen() {
  const [search, setSearch]       = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [selected, setSelected]   = useState<Product | null>(null);
  const [wishlist, setWishlist]   = useState<number[]>([]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search) list = list.filter(p =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    );
    if (activeCat !== 'All') list = list.filter(p => p.category === activeCat);
    return list;
  }, [search, activeCat]);

  const isWish     = (id: number) => wishlist.includes(id);
  const toggleWish = (id: number) =>
    setWishlist(isWish(id) ? wishlist.filter(x => x !== id) : [...wishlist, id]);

  const enquireCard = (p: Product) => {
    const msg = `Hello Shekhar Raja Jewellers,\n\nI am interested in *${p.name}* (${p.description}). Please share details.`;
    Linking.openURL(WA_URL(msg)).catch(() => Alert.alert('WhatsApp', `+${WHATSAPP}`));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.eyebrow}>SUGGESTED FOR YOU</Text>
            <Text style={styles.title}>Find new Jewellery{'\n'}you love.</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{filtered.length} pieces</Text>
          </View>
        </View>
        <View style={styles.searchRow}>
          <Ionicons name="search" size={16} color="rgba(255,255,255,0.7)" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search rings, necklaces…"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={search}
            onChangeText={setSearch}
          />
          {!!search && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={16} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.goldLine} />

      {/* ── Categories ── */}
      <View style={styles.catWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
          {CATEGORIES.map(c => (
            <TouchableOpacity
              key={c.label}
              style={[styles.catChip, activeCat === c.label && styles.catActive]}
              onPress={() => setActiveCat(c.label)}
            >
              <Ionicons name={c.icon as any} size={13} color={activeCat === c.label ? '#FFFFFF' : Theme.textMuted} />
              <Text style={[styles.catTxt, activeCat === c.label && styles.catTxtActive]}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Try Before You Buy ── */}
      <TouchableOpacity
        style={styles.tryBanner}
        activeOpacity={0.88}
        onPress={() => {
          const msg = 'Hello Shekhar Raja Jewellers,\n\nI would like to *Try Before I Buy*. Please help me schedule a private viewing.';
          Linking.openURL(WA_URL(msg)).catch(() => Alert.alert('WhatsApp', `+${WHATSAPP}`));
        }}
      >
        <View style={styles.tryLeft}>
          <View style={styles.tryIcon}>
            <Ionicons name="eye-outline" size={20} color={Theme.purple} />
          </View>
          <View>
            <Text style={styles.tryTitle}>Try Before You Buy</Text>
            <Text style={styles.trySub}>Book a free private viewing at our showroom</Text>
          </View>
        </View>
        <Ionicons name="arrow-forward-circle" size={26} color={Theme.purple} />
      </TouchableOpacity>

      {/* ── Product Grid ── */}
      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={p => String(p.id)}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={{ gap: 12 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          filtered.length > 0 ? (
            <Text style={styles.gridLabel}>
              {activeCat === 'All' ? 'ALL JEWELLERY' : activeCat.toUpperCase()}
              {'  '}<Text style={styles.gridCount}>({filtered.length})</Text>
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            onPress={() => setSelected(item)}
            isWishlisted={isWish(item.id)}
            onToggleWish={() => toggleWish(item.id)}
            onEnquire={() => enquireCard(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="search-outline" size={48} color={Theme.border} />
            <Text style={styles.emptyText}>No pieces found</Text>
            <Text style={styles.emptySub}>Try a different category or search term</Text>
          </View>
        }
        ListFooterComponent={<View style={{ height: 100 }} />}
      />

      {/* ── Product Detail Overlay ── */}
      <ProductDetail
        product={selected}
        onClose={() => setSelected(null)}
        isWishlisted={selected ? isWish(selected.id) : false}
        onToggleWishlist={() => selected && toggleWish(selected.id)}
      />
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.bgPrimary },

  header: { backgroundColor: Theme.bgPurple, paddingHorizontal: 18, paddingTop: 16, paddingBottom: 16 },
  headerTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 },
  eyebrow:   { color: Theme.gold, fontSize: 10, fontWeight: '800', letterSpacing: 2.5, marginBottom: 6 },
  title:     { color: '#FFFFFF', fontSize: 22, fontWeight: '900', lineHeight: 28 },
  countBadge:{ backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full },
  countText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  searchRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.full, paddingHorizontal: 16, paddingVertical: 11,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
  },
  searchInput: { flex: 1, color: '#FFFFFF', fontSize: 14 },
  goldLine:    { height: 3, backgroundColor: Theme.gold },

  catWrap: { backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: Theme.border },
  catRow:  { paddingHorizontal: 14, paddingVertical: 12, gap: 8 },
  catChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: Theme.bgPrimary, borderRadius: Radius.full, borderWidth: 1, borderColor: Theme.border },
  catActive:    { backgroundColor: Theme.bgPurple, borderColor: Theme.bgPurple },
  catTxt:       { color: Theme.textMuted, fontSize: 12, fontWeight: '700' },
  catTxtActive: { color: '#FFFFFF' },

  tryBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFFFFF', marginHorizontal: 14, marginTop: 12, marginBottom: 4,
    padding: 14, borderRadius: Radius.lg,
    borderWidth: 1.5, borderColor: Theme.purpleBorder,
    elevation: 2, shadowColor: Theme.shadow, shadowOpacity: 0.08, shadowRadius: 6,
  },
  tryLeft:  { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  tryIcon:  { width: 40, height: 40, borderRadius: 20, backgroundColor: Theme.bgCardPurple, alignItems: 'center', justifyContent: 'center' },
  tryTitle: { color: Theme.textDark, fontSize: 14, fontWeight: '800' },
  trySub:   { color: Theme.textMuted, fontSize: 11, marginTop: 2 },

  grid:      { paddingHorizontal: 14, paddingTop: 14 },
  gridLabel: { color: Theme.textMuted, fontSize: 11, fontWeight: '800', letterSpacing: 2, marginBottom: 12, marginTop: 4 },
  gridCount: { color: Theme.purple, fontWeight: '900' },

  card: {
    backgroundColor: '#FFFFFF', borderRadius: Radius.lg, overflow: 'hidden',
    borderWidth: 1, borderColor: Theme.border, marginBottom: 14,
    elevation: 3, shadowColor: Theme.shadow, shadowOpacity: 0.08, shadowRadius: 8,
  },
  imgWrap:        { width: '100%', height: 170, backgroundColor: Theme.bgSecondary },
  img:            { width: '100%', height: '100%' },
  imgPlaceholder: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: Theme.bgCardPurple },
  badge:          { position: 'absolute', top: 10, left: 10, backgroundColor: Theme.gold, paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.sm },
  badgeTxt:       { color: '#1A0533', fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  heartBtn:       { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: Radius.full, padding: 6, elevation: 2 },
  cardBody:       { paddingHorizontal: 10, paddingTop: 10, paddingBottom: 6 },
  purityChip:     { alignSelf: 'flex-start', backgroundColor: Theme.bgCardPurple, paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.sm, marginBottom: 6, borderWidth: 1, borderColor: Theme.purpleBorder },
  purityChipTxt:  { color: Theme.purple, fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  cardName:       { color: Theme.textDark, fontSize: 13, fontWeight: '800', lineHeight: 18 },
  cardDesc:       { color: Theme.textMuted, fontSize: 11, marginTop: 3 },
  ratingRow:      { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 7 },
  stars:          { flexDirection: 'row', gap: 1 },
  ratingTxt:      { color: Theme.textMuted, fontSize: 10, fontWeight: '600' },
  enquireBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#25D366', marginHorizontal: 10, marginBottom: 10, paddingVertical: 9, borderRadius: Radius.md },
  enquireTxt:     { color: '#FFFFFF', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },

  emptyWrap: { alignItems: 'center', paddingVertical: 80 },
  emptyText: { color: Theme.textDark, fontSize: 16, fontWeight: '700', marginTop: 16 },
  emptySub:  { color: Theme.textMuted, fontSize: 12, marginTop: 6 },
});

const det = StyleSheet.create({
  wrap:    { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#FFFFFF', zIndex: 50 },
  close:   { position: 'absolute', top: 52, right: 16, zIndex: 60, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: Radius.full },
  imgArea: { width: '100%', height: 280, backgroundColor: Theme.bgCardPurple, alignItems: 'center', justifyContent: 'center' },
  img:     { width: '100%', height: '100%' },
  iconWrap:{ width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(201,168,76,0.15)', alignItems: 'center', justifyContent: 'center' },
  purityBadge:    { position: 'absolute', bottom: 16, left: 16, backgroundColor: Theme.gold, paddingHorizontal: 14, paddingVertical: 6, borderRadius: Radius.full },
  purityBadgeText:{ color: '#1A0533', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  info:    { padding: 20 },
  ratingRow:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  stars:      { flexDirection: 'row', gap: 2 },
  ratingTxt:  { color: Theme.textMuted, fontSize: 12, fontWeight: '600' },
  staffPick:  { backgroundColor: Theme.bgPurple, paddingHorizontal: 10, paddingVertical: 3, borderRadius: Radius.full },
  staffPickTxt:{ color: '#FFFFFF', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  name:    { color: Theme.textDark, fontSize: 24, fontWeight: '900', lineHeight: 30, marginBottom: 6 },
  desc:    { color: Theme.purple, fontSize: 14, fontWeight: '700', letterSpacing: 0.5 },
  details: { color: Theme.textMuted, fontSize: 13, lineHeight: 20, marginTop: 10 },
  specs:   { flexDirection: 'row', backgroundColor: Theme.bgPrimary, borderRadius: Radius.md, marginTop: 16, overflow: 'hidden' },
  specItem:{ flex: 1, alignItems: 'center', paddingVertical: 14 },
  specLabel:{ color: Theme.textMuted, fontSize: 9, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  specValue:{ color: Theme.textDark, fontSize: 12, fontWeight: '800', marginTop: 4, textAlign: 'center' },
  alsoLabel:{ color: Theme.textMuted, fontSize: 10, fontWeight: '800', letterSpacing: 2.5, marginTop: 20, marginBottom: 12 },
  alsoCard: { width: 90, marginRight: 10, alignItems: 'center' },
  alsoImg:  { width: 80, height: 80, borderRadius: 12, backgroundColor: Theme.bgCardPurple, alignItems: 'center', justifyContent: 'center', marginBottom: 6, overflow: 'hidden' },
  alsoName: { color: Theme.textDark, fontSize: 10, fontWeight: '700', textAlign: 'center', lineHeight: 14 },
  alsoPurity:{ color: Theme.gold, fontSize: 9, fontWeight: '800', marginTop: 3, letterSpacing: 0.5 },
  actions: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', gap: 12, padding: 16, paddingBottom: 28, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: Theme.border },
  wishBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: Theme.bgPrimary, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Theme.border },
  waBtn:   { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#25D366', paddingVertical: 15, borderRadius: Radius.lg },
  waTxt:   { color: '#FFFFFF', fontSize: 15, fontWeight: '900' },
});
