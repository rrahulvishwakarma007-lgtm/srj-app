import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product, CartItem } from '../lib/types';
import { loadWishlist, saveWishlist, loadCart, saveCart } from '../lib/storage';

export default function WishlistScreen() {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => { (async () => { setWishlist(await loadWishlist()); setCart(await loadCart()); })(); }, []);
  useEffect(() => { saveWishlist(wishlist); }, [wishlist]);
  useEffect(() => { saveCart(cart); }, [cart]);

  const remove = (id: number) => setWishlist(wishlist.filter(w => w.id !== id));

  const moveToCart = (p: Product) => {
    const existing = cart.findIndex(c => c.id === p.id);
    let newCart: CartItem[];
    if (existing >= 0) { newCart = [...cart]; newCart[existing].quantity += 1; }
    else newCart = [...cart, { ...p, quantity: 1 }];
    setCart(newCart);
    setWishlist(wishlist.filter(w => w.id !== p.id));
    Alert.alert('Added to Cart', `${p.name} moved to cart.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>Wishlist</Text><Text style={styles.count}>{wishlist.length} items</Text></View>
      {wishlist.length === 0 ? (
        <View style={styles.empty}><Ionicons name="heart-outline" size={70} color="#D9C9B8" /><Text style={styles.emptyTitle}>No favourites yet</Text><Text style={styles.emptySub}>Save pieces you love and we'll keep them here.</Text></View>
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(i) => String(i.id)}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}><Ionicons name={item.icon as any} size={32} color={item.color} /></View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>{item.weight}g • {item.purity} • ₹{item.price.toLocaleString('en-IN')}</Text>
              </View>
              <TouchableOpacity style={styles.action} onPress={() => moveToCart(item)}><Ionicons name="cart" size={18} color="#B8975E" /></TouchableOpacity>
              <TouchableOpacity style={styles.action} onPress={() => remove(item.id)}><Ionicons name="trash-outline" size={18} color="#7A5C5C" /></TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F3ED' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'flex-end' },
  title: { color: '#3D2B2B', fontSize: 26, fontWeight: '800' },
  count: { color: '#7A5C5C', fontSize: 14 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyTitle: { color: '#3D2B2B', fontSize: 20, fontWeight: '700', marginTop: 16 },
  emptySub: { color: '#7A5C5C', fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF8F0', borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#D9C9B8' },
  iconBox: { width: 60, height: 60, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  name: { color: '#3D2B2B', fontSize: 16, fontWeight: '600' },
  meta: { color: '#7A5C5C', fontSize: 12, marginTop: 4 },
  action: { padding: 10, marginLeft: 4 },
});