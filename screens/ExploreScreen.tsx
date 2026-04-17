import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme, Card } from '../lib/theme';
import { products } from '../lib/data';
import { Product } from '../lib/types';

interface Props { onOpenProduct: (p: Product) => void; wishlist: Product[]; onToggleWishlist: (p: Product) => void; }

const CATS = ['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Pendants'];

export default function ExploreScreen({ onOpenProduct, wishlist, onToggleWishlist }: Props) {
  const [cat, setCat] = useState('All');
  const list = cat === 'All' ? products : products.filter(p => p.category === cat);

  const whatsapp = (p: Product) => Linking.openURL(`https://wa.me/919999999999?text=Enquiry%20for%20${encodeURIComponent(p.name)}`);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>Explore the Collection</Text></View>
      <View style={styles.filters}>{CATS.map(c => <TouchableOpacity key={c} style={[styles.chip, cat === c && styles.chipOn]} onPress={() => setCat(c)}><Text style={[styles.chipTxt, cat === c && styles.chipTxtOn]}>{c}</Text></TouchableOpacity>)}</View>
      <FlatList
        data={list}
        numColumns={2}
        keyExtractor={i => String(i.id)}
        contentContainerStyle={{ padding: 12, paddingBottom: 90 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => onOpenProduct(item)}>
            <View style={[styles.img, { backgroundColor: Theme.gold + '18' }]}><Ionicons name={item.icon as any} size={52} color={Theme.gold} /></View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>{item.weight}g • {item.purity}</Text>
            <View style={styles.row}>
              <TouchableOpacity style={styles.wish} onPress={() => onToggleWishlist(item)}><Ionicons name={wishlist.some(w => w.id === item.id) ? 'heart' : 'heart-outline'} size={18} color={Theme.violetAccent} /></TouchableOpacity>
              <TouchableOpacity style={styles.whatsapp} onPress={() => whatsapp(item)}><Ionicons name="logo-whatsapp" size={18} color="#fff" /><Text style={styles.waTxt}>Enquire</Text></TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.bgPrimary },
  header: { padding: 20, paddingBottom: 8 },
  headerTitle: { ...Theme.serifHeavy, color: Theme.textOnDark, fontSize: 24, letterSpacing: 1 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, paddingBottom: 6, gap: 8 },
  chip: { paddingVertical: 7, paddingHorizontal: 14, backgroundColor: Theme.bgSecondary, borderRadius: 18, borderWidth: 1, borderColor: '#3A2A5F' },
  chipOn: { backgroundColor: Theme.gold, borderColor: Theme.gold },
  chipTxt: { color: Theme.textOnDarkMuted, fontSize: 12, fontWeight: '600' },
  chipTxtOn: { color: Theme.btnPrimaryText },
  card: { flex: 1, margin: 6, backgroundColor: Theme.bgCard, borderRadius: Card.borderRadius, padding: 12, borderWidth: Card.borderWidth, borderColor: Card.borderColor },
  img: { height: 130, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  name: { ...Theme.sansBold, color: Theme.textOnCream, fontSize: 14, lineHeight: 18 },
  meta: { color: Theme.textOnCreamMuted, fontSize: 11, marginTop: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  wish: { padding: 6 },
  whatsapp: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Theme.whatsapp, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20 },
  waTxt: { color: '#fff', fontSize: 12, fontWeight: '700' },
});