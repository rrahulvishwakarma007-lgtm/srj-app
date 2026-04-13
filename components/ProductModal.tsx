import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../lib/types';

interface Props {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
  onAddToWishlist: () => void;
  onAddToCart: () => void;
  isWishlisted: boolean;
}

export default function ProductModal({ visible, product, onClose, onAddToWishlist, onAddToCart, isWishlisted }: Props) {
  if (!product) return null;
  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#8C5C2D" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.hero, { backgroundColor: product.color + '15' }]}>
            <Ionicons name={product.icon as any} size={90} color={product.color} />
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.category}>{product.category} • {product.purity}</Text>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.description}>{product.description}</Text>
            <Text style={styles.details}>{product.details}</Text>
            <View style={styles.specs}>
              <View style={styles.specItem}><Text style={styles.specLabel}>Weight</Text><Text style={styles.specValue}>{product.weight} grams</Text></View>
              <View style={styles.specItem}><Text style={styles.specLabel}>Purity</Text><Text style={styles.specValue}>{product.purity}</Text></View>
              <View style={styles.specItem}><Text style={styles.specLabel}>Hallmarked</Text><Text style={styles.specValue}>BIS</Text></View>
            </View>
          </View>
          <View style={styles.priceBar}>
            <Text style={styles.price}>₹{product.price.toLocaleString('en-IN')}</Text>
            <Text style={styles.taxNote}>Inclusive of taxes • Lifetime polish</Text>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity style={[styles.footerBtn, styles.wishlistBtn]} onPress={onAddToWishlist}>
            <Ionicons name={isWishlisted ? 'heart' : 'heart-outline'} size={20} color="#8F5155" />
            <Text style={styles.footerBtnText}>{isWishlisted ? 'Saved' : 'Wishlist'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.footerBtn, styles.cartBtn]} onPress={onAddToCart}>
            <Ionicons name="cart" size={20} color="#F8F3ED" />
            <Text style={[styles.footerBtnText, { color: '#F8F3ED' }]}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F3ED' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#D9C9B8' },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#1F1414', fontSize: 16, fontWeight: '600' },
  scrollContent: { paddingBottom: 100 },
  hero: { height: 220, alignItems: 'center', justifyContent: 'center', margin: 16, borderRadius: 20 },
  infoSection: { paddingHorizontal: 20 },
  category: { color: '#B17C7F', fontSize: 12, fontWeight: '800', letterSpacing: 2.5, textTransform: 'uppercase' },
  name: { color: '#1F1414', fontSize: 26, fontWeight: '900', marginTop: 8, lineHeight: 31, letterSpacing: 0.3 },
  description: { color: '#8C5C2D', fontSize: 16, marginTop: 8 },
  details: { color: '#7A5C5C', fontSize: 14, lineHeight: 22, marginTop: 12 },
  specs: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#D9C9B8' },
  specItem: { alignItems: 'center' },
  specLabel: { color: '#7A5C5C', fontSize: 11, textTransform: 'uppercase' },
  specValue: { color: '#1F1414', fontSize: 14, fontWeight: '600', marginTop: 4 },
  priceBar: { marginTop: 24, marginHorizontal: 16, padding: 18, backgroundColor: '#FFF8F0', borderRadius: 14, borderWidth: 1, borderColor: '#D9C9B8' },
  price: { color: '#D4AF37', fontSize: 30, fontWeight: '900', letterSpacing: 0.4 },
  taxNote: { color: '#7A5C5C', fontSize: 12, marginTop: 4 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: 16, backgroundColor: '#FFF8F0', borderTopWidth: 1, borderTopColor: '#D9C9B8' },
  footerBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, marginHorizontal: 6, gap: 8 },
  wishlistBtn: { backgroundColor: '#F8F3ED', borderWidth: 1, borderColor: '#D4AF37', borderRadius: 18 },
  cartBtn: { backgroundColor: '#D4AF37', borderRadius: 18 },
  footerBtnText: { color: '#1A1A1A', fontSize: 15, fontWeight: '800' },
});