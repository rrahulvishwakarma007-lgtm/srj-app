import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import CartModal from '../components/CartModal';
import { Product, CartItem } from '../lib/types';
import { products } from '../lib/data';
import { loadWishlist, saveWishlist, loadCart, saveCart } from '../lib/storage';

const CATEGORIES = ['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Pendants'];

export default function CatalogueScreen() {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [sortMode, setSortMode] = useState<'price-low' | 'price-high'>('price-low');
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => { const w = await loadWishlist(); const c = await loadCart(); setWishlist(w); setCart(c); setLoading(false); })(); }, []);
  useEffect(() => { saveWishlist(wishlist); }, [wishlist]);
  useEffect(() => { saveCart(cart); }, [cart]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()));
    if (activeCat !== 'All') list = list.filter(p => p.category === activeCat);
    list.sort((a, b) => sortMode === 'price-low' ? a.price - b.price : b.price - a.price);
    return list;
  }, [search, activeCat, sortMode]);

  const isWishlisted = (id: number) => wishlist.some(w => w.id === id);

  const toggleWishlist = (p: Product) => {
    if (isWishlisted(p.id)) setWishlist(wishlist.filter(w => w.id !== p.id));
    else setWishlist([...wishlist, p]);
  };

  const addToCart = (p: Product) => {
    const existing = cart.findIndex(c => c.id === p.id);
    if (existing >= 0) {
      const updated = [...cart]; updated[existing].quantity += 1; setCart(updated);
    } else setCart([...cart, { ...p, quantity: 1 }]);
    setShowCart(true);
  };

  const removeFromCart = (id: number) => setCart(cart.filter(c => c.id !== id));

  const checkout = () => {
    setCart([]);
    setShowCart(false);
    alert('Thank you! Your order has been confirmed. Our team will contact you shortly.');
  };

  if (loading) return <SafeAreaView style={styles.loading}><ActivityIndicator size="large" color="#8C5C2D" /></SafeAreaView>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchRow}>
        <View style={styles.searchBox}><Ionicons name="search" size={18} color="#4F3636" /><TextInput style={styles.searchInput} placeholder="Search jewellery..." placeholderTextColor="#4F3636" value={search} onChangeText={setSearch} /></View>
        <TouchableOpacity style={styles.cartIcon} onPress={() => setShowCart(true)}>
          <Ionicons name="cart" size={22} color="#8C5C2D" />
          {cart.length > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{cart.length}</Text></View>}
        </TouchableOpacity>
      </View>
      <View style={styles.catRow}>
        {CATEGORIES.map(c => (
          <TouchableOpacity key={c} style={[styles.catChip, activeCat === c && styles.catActive]} onPress={() => setActiveCat(c)}><Text style={[styles.catText, activeCat === c && styles.catTextActive]}>{c}</Text></TouchableOpacity>
        ))}
      </View>
      <View style={styles.sortRow}>
        <TouchableOpacity style={[styles.sortBtn, sortMode === 'price-low' && styles.sortActive]} onPress={() => setSortMode('price-low')}><Text style={[styles.sortText, sortMode === 'price-low' && styles.sortTextActive]}>Price: Low to High</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.sortBtn, sortMode === 'price-high' && styles.sortActive]} onPress={() => setSortMode('price-high')}><Text style={[styles.sortText, sortMode === 'price-high' && styles.sortTextActive]}>High to Low</Text></TouchableOpacity>
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(p) => String(p.id)}
        numColumns={2}
        contentContainerStyle={{ padding: 10, paddingBottom: 110 }}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={() => setSelected(item)} onAddToWishlist={() => toggleWishlist(item)} onAddToCart={() => addToCart(item)} isWishlisted={isWishlisted(item.id)} />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No products found</Text>}
      />
      <ProductModal visible={!!selected} product={selected} onClose={() => setSelected(null)} onAddToWishlist={() => selected && toggleWishlist(selected)} onAddToCart={() => selected && addToCart(selected)} isWishlisted={selected ? isWishlisted(selected.id) : false} />
      <CartModal visible={showCart} items={cart} onClose={() => setShowCart(false)} onRemove={removeFromCart} onCheckout={checkout} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F3ED' },
  loading: { flex: 1, backgroundColor: '#F8F3ED', alignItems: 'center', justifyContent: 'center' },
  searchRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF8F0', borderRadius: 12, paddingHorizontal: 14, borderWidth: 1, borderColor: '#D9C9B8' },
  searchInput: { flex: 1, color: '#1F1414', paddingVertical: 12, paddingLeft: 10, fontSize: 15 },
  cartIcon: { marginLeft: 12, padding: 8, position: 'relative' },
  badge: { position: 'absolute', top: 2, right: 2, backgroundColor: '#8C5C2D', width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#F8F3ED', fontSize: 10, fontWeight: '800' },
  catRow: { flexDirection: 'row', paddingHorizontal: 14, paddingBottom: 8, flexWrap: 'wrap' },
  catChip: { paddingHorizontal: 14, paddingVertical: 7, backgroundColor: '#FFF8F0', borderRadius: 20, marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: '#D9C9B8' },
  catActive: { backgroundColor: '#8C5C2D' },
  catText: { color: '#8C5C2D', fontSize: 13, fontWeight: '600' },
  catTextActive: { color: '#F8F3ED' },
  sortRow: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 6, gap: 10 },
  sortBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: '#D9C9B8' },
  sortActive: { backgroundColor: '#D9C9B8' },
  sortText: { color: '#4F3636', fontSize: 12 },
  sortTextActive: { color: '#1F1414' },
  empty: { textAlign: 'center', color: '#4F3636', marginTop: 40 },
});