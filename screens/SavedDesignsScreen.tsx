import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme, Card } from '../lib/theme';
import { Product } from '../lib/types';

interface Props { wishlist: Product[]; onOpenProduct: (p: Product) => void; onToggleWishlist: (p: Product) => void; }

export default function SavedDesignsScreen({ wishlist, onOpenProduct, onToggleWishlist }: Props) {
  const enquire = (p: Product) => Linking.openURL(`https://wa.me/919999999999?text=Enquiry%20for%20saved%20design%3A%20${encodeURIComponent(p.name)}`);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>Saved Designs</Text><Text style={styles.count}>{wishlist.length} pieces</Text></View>
      {wishlist.length === 0 ? (
        <View style={styles.empty}><Ionicons name="bookmark-outline" size={72} color={Theme.textOnDarkMuted} /><Text style={styles.emptyTxt}>No saved designs yet</Text><Text style={styles.emptySub}>Heart pieces you love in Explore</Text></View>
      ) : (
        <FlatList data={wishlist} numColumns={2} keyExtractor={i => String(i.id)} contentContainerStyle={{ padding: 12, paddingBottom: 90 }} renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => onOpenProduct(item)}><View style={[styles.img, { backgroundColor: Theme.gold + '18' }]}><Ionicons name={item.icon as any} size={48} color={Theme.gold} /></View></TouchableOpacity>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.row}>
              <TouchableOpacity style={styles.enq} onPress={() => enquire(item)}><Ionicons name="logo-whatsapp" size={16} color="#fff" /><Text style={styles.enqTxt}>Enquire</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => onToggleWishlist(item)}><Ionicons name="trash-outline" size={18} color={Theme.textOnDarkMuted} /></TouchableOpacity>
            </View>
          </View>
        )} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.bgPrimary },
  header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  title: { ...Theme.serifHeavy, color: Theme.textOnDark, fontSize: 24, letterSpacing: 1 },
  count: { color: Theme.textOnDarkMuted, fontSize: 13 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyTxt: { color: Theme.textOnDark, fontSize: 18, fontWeight: '700', marginTop: 16 },
  emptySub: { color: Theme.textOnDarkMuted, fontSize: 14, marginTop: 6 },
  card: { flex: 1, margin: 6, backgroundColor: Theme.bgCard, borderRadius: Card.borderRadius, padding: 12, borderWidth: Card.borderWidth, borderColor: Card.borderColor },
  img: { height: 120, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  name: { ...Theme.sansBold, color: Theme.textOnCream, fontSize: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  enq: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Theme.whatsapp, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20 },
  enqTxt: { color: '#fff', fontSize: 12, fontWeight: '700' },
});