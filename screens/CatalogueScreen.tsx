import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image, Linking, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Theme, Radius } from '../lib/theme';
import { Product } from '../lib/types';
import { useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const { width } = Dimensions.get('window');
const CARD_W = (width - 52) / 2;
const WHATSAPP = '918377911745';
const WA_URL = (msg: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
const CATEGORIES = ['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Pendants'];

function ProductDetail({ product, onClose, isWishlisted, onToggleWishlist }: {
  product: Product | null; onClose: () => void; isWishlisted: boolean; onToggleWishlist: () => void;
}) {
  if (!product) return null;
  const enquire = () => {
    const msg = `Hello Shekhar Raja Jewellers,\n\nI would like to enquire about:\n*${product.name}*\n${product.description}\n\nPlease share details and availability.`;
    Linking.openURL(WA_URL(msg)).catch(() => Alert.alert('WhatsApp', `+${WHATSAPP}`));
  };
  return (
    <View style={det.wrap}>
      <TouchableOpacity style={det.close} onPress={onClose}>
        <Ionicons name="close" size={22} color="#FFFFFF" />
      </TouchableOpacity>
      <View style={det.imgArea}>
        {product.image
          ? <Image source={{ uri: product.image }} style={det.img} resizeMode="cover" />
          : <View style={det.iconWrap}><Ionicons name={product.icon as any} size={80} color={Theme.gold} /></View>
        }
      </View>
      <View style={det.info}>
        <Text style={det.name}>{product.name}</Text>
        <Text style={det.desc}>{product.description}</Text>
        {!!product.details && <Text style={det.details}>{product.details}</Text>}
      </View>
      <View style={det.actions}>
        <TouchableOpacity style={det.wishBtn} onPress={onToggleWishlist}>
          <Ionicons name={isWishlisted ? 'heart' : 'heart-outline'} size={20} color={isWishlisted ? '#E91E8C' : Theme.gold} />
          <Text style={[det.wishTxt, isWishlisted && { color: '#E91E8C' }]}>{isWishlisted ? 'Saved' : 'Wishlist'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={det.waBtn} onPress={enquire}>
          <Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" />
          <Text style={det.waTxt}>Enquire on WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function CatalogueScreen() {
  const [search, setSearch]       = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [selected, setSelected]   = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
const [wishlist, setWishlist] = useState<string[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true); // 👈 ADD HERE

      const querySnapshot = await getDocs(collection(db, 'products'));

      const list = querySnapshot.docs.map(doc => ({
        id: String(doc.id),
        ...doc.data()
      })) as Product[];

      setProducts(list);
      setLoading(false); // 👈 ADD HERE
    } catch (error) {
      console.log('Error fetching products:', error);
      setLoading(false); // 👈 ADD HERE (important)
    }
  };

  fetchProducts();
}, []);
  const filtered = useMemo(() => {
  let list = [...products];

  if (search) {
    list = list.filter(p =>
      p.name?.toLowerCase?.().includes(search.toLowerCase()) ||
      p.description?.toLowerCase?.().includes(search.toLowerCase())
    );
  }

  if (activeCat !== 'All') {
    list = list.filter(p => p.category?.trim() === activeCat);
  }

  return list;
}, [search, activeCat, products]);
  const isWish = (id: string) => wishlist.includes(id);

const toggleWish = (id: string) =>
  setWishlist(isWish(id)
    ? wishlist.filter(x => x !== id)
    : [...wishlist, id]
  );
  const enquireCard = (p: Product) => {
    const msg = `Hello Shekhar Raja Jewellers,\n\nI am interested in *${p.name}* (${p.description}). Please share details.`;
    Linking.openURL(WA_URL(msg)).catch(() => Alert.alert('WhatsApp', `+${WHATSAPP}`));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.eyebrow}>SHEKHAR RAJA JEWELLERS</Text>
            <Text style={styles.title}>The Collection</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{filtered.length}</Text>
          </View>
        </View>
        {/* Search */}
        <View style={styles.searchRow}>
          <Ionicons name="search" size={16} color={Theme.textMuted} />
          <TextInput style={styles.searchInput} placeholder="Search jewellery…" placeholderTextColor={Theme.textMuted} value={search} onChangeText={setSearch} />
          {!!search && <TouchableOpacity onPress={() => setSearch('')}><Ionicons name="close-circle" size={16} color={Theme.textMuted} /></TouchableOpacity>}
        </View>
      </View>

      {/* Gold accent line */}
      <View style={styles.goldLine} />

      {/* Try Before You Buy */}
      <TouchableOpacity style={styles.tryBtn} activeOpacity={0.88} onPress={() => {
        const msg = 'Hello Shekhar Raja Jewellers,\n\nI would like to *Try Before I Buy*. Please help me schedule a private viewing.';
        Linking.openURL(WA_URL(msg)).catch(() => Alert.alert('WhatsApp', `+${WHATSAPP}`));
      }}>
        <View style={styles.tryLeft}>
          <Ionicons name="eye-outline" size={18} color={Theme.purple} />
          <View>
            <Text style={styles.tryTitle}>Try Before You Buy</Text>
            <Text style={styles.trySub}>Book a private viewing at our showroom</Text>
          </View>
        </View>
        <Ionicons name="arrow-forward-circle" size={24} color={Theme.purple} />
      </TouchableOpacity>

      {/* Category chips */}
      <FlatList
        horizontal data={CATEGORIES} keyExtractor={c => c}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catRow}
        renderItem={({ item: c }) => (
          <TouchableOpacity style={[styles.catChip, activeCat === c && styles.catActive]} onPress={() => setActiveCat(c)}>
            <Text style={[styles.catTxt, activeCat === c && styles.catTxtActive]}>{c}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Grid */}
{loading ? (
  <View style={{ alignItems: 'center', marginTop: 60 }}>
    <Ionicons name="diamond-outline" size={40} color={Theme.gold} />
    <Text style={{ marginTop: 10, color: Theme.textMuted, fontWeight: '600' }}>
      Loading collection...
    </Text>
  </View>
) : (
  <FlatList
    data={filtered}
    numColumns={2}
    keyExtractor={p => String(p.id)}
    contentContainerStyle={styles.grid}
    columnWrapperStyle={{ gap: 12 }}
    showsVerticalScrollIndicator={false}
    renderItem={({ item }) => (
      <TouchableOpacity
        style={[styles.card, { width: CARD_W }]}
        activeOpacity={0.9}
        onPress={() => setSelected(item)}
      >
        <View style={styles.imgWrap}>
          {item.image
            ? <Image source={{ uri: item.image }} style={styles.img} resizeMode="cover" />
            : <View style={styles.imgPlaceholder}>
                <Ionicons name={item.icon as any} size={44} color={Theme.gold} />
              </View>
          }
          <TouchableOpacity style={styles.heartBtn} onPress={() => toggleWish(item.id)}>
            <Ionicons
              name={isWish(item.id) ? 'heart' : 'heart-outline'}
              size={17}
              color={isWish(item.id) ? '#E91E8C' : Theme.textMuted}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.cardDesc} numberOfLines={1}>{item.description}</Text>
        </View>

        <TouchableOpacity style={styles.enquireBtn} onPress={() => enquireCard(item)}>
          <Ionicons name="logo-whatsapp" size={14} color="#FFFFFF" />
          <Text style={styles.enquireTxt}>Enquire</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    )}
    ListEmptyComponent={!loading ? (
      <View style={styles.emptyWrap}>
        <Ionicons name="search" size={40} color={Theme.border} />
        <Text style={styles.emptyText}>No pieces found</Text>
      </View>
    ) : null}
  />
)}

      <ProductDetail product={selected} onClose={() => setSelected(null)} isWishlisted={selected ? isWish(selected.id) : false} onToggleWishlist={() => selected && toggleWish(selected.id)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.bgPrimary },
  header: { backgroundColor: Theme.bgPurple, paddingHorizontal: 18, paddingTop: 16, paddingBottom: 14 },
  headerTop: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12 },
  eyebrow: { color: Theme.gold, fontSize: 10, fontWeight: '800', letterSpacing: 2.5, marginBottom: 4 },
  title:   { color: '#FFFFFF', fontSize: 24, fontWeight: '900' },
  countBadge: { backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full },
  countText:  { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  searchRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.full, paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
  },
  searchInput: { flex: 1, color: '#FFFFFF', fontSize: 14 },
  goldLine: { height: 3, backgroundColor: Theme.gold },
  tryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFFFFF', marginHorizontal: 14, marginTop: 12, marginBottom: 4,
    padding: 14, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Theme.purpleBorder,
    elevation: 2, shadowColor: Theme.shadow, shadowOpacity: 0.08, shadowRadius: 6,
  },
  tryLeft:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
  tryTitle: { color: Theme.textDark, fontSize: 14, fontWeight: '800' },
  trySub:   { color: Theme.textMuted, fontSize: 11, marginTop: 2 },
  catRow: { paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
  catChip: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#FFFFFF', borderRadius: Radius.full, borderWidth: 1, borderColor: Theme.border },
  catActive:    { backgroundColor: Theme.bgPurple, borderColor: Theme.bgPurple },
  catTxt:       { color: Theme.textMuted, fontSize: 12, fontWeight: '700' },
  catTxtActive: { color: '#FFFFFF' },
  grid: { paddingHorizontal: 14, paddingBottom: 120, paddingTop: 4 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: Radius.lg, overflow: 'hidden',
    borderWidth: 1, borderColor: Theme.border, marginBottom: 12,
    elevation: 2, shadowColor: Theme.shadow, shadowOpacity: 0.07, shadowRadius: 6,
  },
  imgWrap:       { width: '100%', height: 155, backgroundColor: Theme.bgSecondary },
  img:           { width: '100%', height: '100%' },
  imgPlaceholder:{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: Theme.bgCardPurple },
  heartBtn:      { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: Radius.full, padding: 6 },
  cardBody:      { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 6 },
  cardName:      { color: Theme.textDark, fontSize: 13, fontWeight: '800', lineHeight: 18 },
  cardDesc:      { color: Theme.textMuted, fontSize: 11, marginTop: 3 },
  enquireBtn:    {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: Theme.bgPurple, margin: 10, paddingVertical: 10, borderRadius: Radius.md,
  },
  enquireTxt:    { color: '#FFFFFF', fontSize: 12, fontWeight: '800', letterSpacing: 0.8 },
  emptyWrap:     { alignItems: 'center', paddingVertical: 60 },
  emptyText:     { color: Theme.textMuted, fontSize: 15, fontWeight: '700', marginTop: 14 },
});

const det = StyleSheet.create({
  wrap:    { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: Theme.bgPurpleDark, zIndex: 50 },
  close:   { position: 'absolute', top: 52, right: 20, zIndex: 60, backgroundColor: 'rgba(255,255,255,0.15)', padding: 8, borderRadius: Radius.full },
  imgArea: { width: '100%', height: '55%', backgroundColor: Theme.bgPurple, alignItems: 'center', justifyContent: 'center' },
  img:     { width: '100%', height: '100%' },
  iconWrap:{ width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(201,168,76,0.15)', alignItems: 'center', justifyContent: 'center' },
  info:    { padding: 24 },
  name:    { color: '#FFFFFF', fontSize: 24, fontWeight: '900', lineHeight: 30 },
  desc:    { color: Theme.gold, fontSize: 14, fontWeight: '700', marginTop: 6, letterSpacing: 0.8 },
  details: { color: Theme.textLightMuted, fontSize: 13, lineHeight: 20, marginTop: 10 },
  actions: { position: 'absolute', bottom: 32, left: 20, right: 20, flexDirection: 'row', gap: 12 },
  wishBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.1)', paddingVertical: 16, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.4)',
  },
  wishTxt: { color: Theme.gold, fontSize: 13, fontWeight: '700' },
  waBtn:   { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#25D366', paddingVertical: 16, borderRadius: Radius.lg },
  waTxt:   { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },
});
