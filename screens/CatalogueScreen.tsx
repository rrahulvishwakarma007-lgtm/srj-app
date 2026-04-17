import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, Image, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../lib/types';
import { products } from '../lib/data';

const WHATSAPP = '+918377911745';
const WA_URL = (msg: string) => `https://wa.me/${WHATSAPP.replace('+','')}?text=${encodeURIComponent(msg)}`;

const CATEGORIES = ['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Pendants'];

interface DetailProps {
  product: Product | null;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}

function ProductDetail({ product, onClose, isWishlisted, onToggleWishlist }: DetailProps) {
  if (!product) return null;
  const style = product.description;
  const occasion = product.details?.toLowerCase().includes('bridal') || product.details?.toLowerCase().includes('wedding') ? 'Wedding' : product.details?.toLowerCase().includes('temple') ? 'Temple' : 'Occasion';

  const enquire = () => {
    const msg = `Hello Shekhar Raja Jewellers,\n\nI would like to enquire about:\n${product.name}\nStyle: ${style}\n\nPlease share details and availability.`;
    Linking.openURL(WA_URL(msg)).catch(() => Alert.alert('WhatsApp', `Please WhatsApp ${WHATSAPP} for ${product.name}`));
  };

  return (
    <View style={styles.detailWrap}>
      <TouchableOpacity style={styles.detailClose} onPress={onClose}><Ionicons name="close" size={26} color="#F8F3ED" /></TouchableOpacity>

      {/* Fullscreen Image Carousel (single large image; swipe-ready structure) */}
      <View style={styles.carousel}>
        <Image source={{ uri: product.image || '' }} style={styles.fullImage} resizeMode="cover" />
      </View>

      {/* Minimal text */}
      <View style={styles.detailInfo}>
        <Text style={styles.detailName}>{product.name}</Text>
        <Text style={styles.detailStyle}>{style} • {occasion}</Text>
      </View>

      {/* Wishlist + WhatsApp */}
      <View style={styles.detailActions}>
        <TouchableOpacity style={styles.wishBtn} onPress={onToggleWishlist}>
          <Ionicons name={isWishlisted ? 'heart' : 'heart-outline'} size={22} color="#D4AF37" />
          <Text style={styles.wishText}>{isWishlisted ? 'Saved' : 'Wishlist'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.whatsappBtn} onPress={enquire}>
          <Ionicons name="logo-whatsapp" size={22} color="#2A1B4D" />
          <Text style={styles.whatsappText}>Enquire on WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function CatalogueScreen() {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [selected, setSelected] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()));
    if (activeCat !== 'All') list = list.filter(p => p.category === activeCat);
    return list;
  }, [search, activeCat]);

  const isWish = (id: number) => wishlist.includes(id);
  const toggleWish = (id: number) => setWishlist(isWish(id) ? wishlist.filter(x => x !== id) : [...wishlist, id]);

  const enquireCard = (p: Product) => {
    const msg = `Hello Shekhar Raja Jewellers,\n\nI am interested in ${p.name} (${p.description}). Please share details.`;
    Linking.openURL(WA_URL(msg)).catch(() => Alert.alert('WhatsApp', `Please WhatsApp ${WHATSAPP}`));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Elegant Header */}
      <View style={styles.header}>
        <Text style={styles.title}>The Collection</Text>
        <Text style={styles.subtitle}>Curated Masterpieces</Text>
      </View>

      {/* TRY BEFORE YOU BUY — prominent CTA */}
      <TouchableOpacity style={styles.tryBtn} onPress={() => {
        const msg = 'Hello Shekhar Raja Jewellers,\n\nI would like to TRY BEFORE I BUY. Please help me schedule a private viewing or share more details.';
        Linking.openURL(WA_URL(msg)).catch(() => Alert.alert('WhatsApp', `Please WhatsApp ${WHATSAPP}`));
      }}>
        <Ionicons name="eye" size={20} color="#F8F3ED" />
        <Text style={styles.tryText}>TRY BEFORE YOU BUY</Text>
      </TouchableOpacity>

      {/* Search */}
      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color="#D4AF37" />
        <TextInput style={styles.searchInput} placeholder="Search jewellery..." placeholderTextColor="#C5B8A3" value={search} onChangeText={setSearch} />
      </View>

      {/* Category chips */}
      <View style={styles.catRow}>
        {CATEGORIES.map(c => (
          <TouchableOpacity key={c} style={[styles.catChip, activeCat === c && styles.catActive]} onPress={() => setActiveCat(c)}>
            <Text style={[styles.catText, activeCat === c && styles.catTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 2-Column Premium Grid — NO PRICES */}
      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={p => String(p.id)}
        contentContainerStyle={{ padding: 12, paddingBottom: 120 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => setSelected(item)}>
            {/* Large Image */}
            <View style={styles.imgWrap}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.img} resizeMode="cover" />
              ) : (
                <View style={[styles.imgPlaceholder, { backgroundColor: '#EDE4D4' }]}><Ionicons name={item.icon as any} size={44} color="#8C5C2D" /></View>
              )}
            </View>
            {/* Name + Descriptor (NO price) */}
            <View style={styles.cardBody}>
              <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.desc} numberOfLines={1}>{item.description}</Text>
            </View>
            {/* WhatsApp CTA */}
            <TouchableOpacity style={styles.enquireBtn} onPress={() => enquireCard(item)}>
              <Ionicons name="logo-whatsapp" size={18} color="#2A1B4D" />
              <Text style={styles.enquireText}>Enquire on WhatsApp</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      {/* Product Detail Modal */}
      <ProductDetail
        product={selected}
        onClose={() => setSelected(null)}
        isWishlisted={selected ? isWish(selected.id) : false}
        onToggleWishlist={() => selected && toggleWish(selected.id)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2A1B4D' },
  header: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 6, alignItems: 'center' },
  title: { color: '#F8F3ED', fontSize: 26, fontWeight: '800', letterSpacing: 2 },
  subtitle: { color: '#D4AF37', fontSize: 12, fontWeight: '700', letterSpacing: 3, marginTop: 2 },
  tryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#D4AF37', marginHorizontal: 16, marginTop: 10, paddingVertical: 14, borderRadius: 16 },
  tryText: { color: '#2A1B4D', fontSize: 14, fontWeight: '900', letterSpacing: 2 },
  searchRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#3A275E', marginHorizontal: 16, marginTop: 10, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
  searchInput: { flex: 1, color: '#F8F3ED', fontSize: 15 },
  catRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 14, paddingTop: 12, gap: 8 },
  catChip: { paddingHorizontal: 14, paddingVertical: 7, backgroundColor: '#3A275E', borderRadius: 20, borderWidth: 1, borderColor: '#6F5A9A' },
  catActive: { backgroundColor: '#D4AF37', borderColor: '#D4AF37' },
  catText: { color: '#E8DFC8', fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  catTextActive: { color: '#2A1B4D' },
  card: { flex: 1, margin: 6, backgroundColor: '#F8F3ED', borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: '#EDE4D4' },
  imgWrap: { width: '100%', height: 150, backgroundColor: '#EDE4D4' },
  img: { width: '100%', height: '100%' },
  imgPlaceholder: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  cardBody: { paddingHorizontal: 14, paddingTop: 12, paddingBottom: 6 },
  name: { color: '#2A1B4D', fontSize: 15, fontWeight: '800', letterSpacing: 0.3, lineHeight: 19 },
  desc: { color: '#8C5C2D', fontSize: 12, fontWeight: '600', marginTop: 4, letterSpacing: 0.2 },
  enquireBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#D4AF37', paddingVertical: 11, margin: 12, borderRadius: 14 },
  enquireText: { color: '#2A1B4D', fontSize: 12, fontWeight: '800', letterSpacing: 1.5 },
  // Detail
  detailWrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#2A1B4D', zIndex: 50 },
  detailClose: { position: 'absolute', top: 44, right: 20, zIndex: 60, padding: 8 },
  carousel: { width: '100%', height: '58%', backgroundColor: '#1F1438', alignItems: 'center', justifyContent: 'center' },
  fullImage: { width: '100%', height: '100%' },
  detailInfo: { paddingHorizontal: 24, paddingTop: 20 },
  detailName: { color: '#F8F3ED', fontSize: 24, fontWeight: '900', letterSpacing: 1, lineHeight: 28 },
  detailStyle: { color: '#D4AF37', fontSize: 14, fontWeight: '700', marginTop: 8, letterSpacing: 1.5 },
  detailActions: { position: 'absolute', bottom: 30, left: 20, right: 20, flexDirection: 'row', gap: 12 },
  wishBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#3A275E', paddingVertical: 15, borderRadius: 18, borderWidth: 1, borderColor: '#D4AF37' },
  wishText: { color: '#D4AF37', fontSize: 13, fontWeight: '700', letterSpacing: 1 },
  whatsappBtn: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#D4AF37', paddingVertical: 15, borderRadius: 18 },
  whatsappText: { color: '#2A1B4D', fontSize: 14, fontWeight: '900', letterSpacing: 1.5 },
});