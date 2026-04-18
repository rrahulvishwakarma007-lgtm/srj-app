import React from 'react';
import {
  View, Text, TouchableOpacity, Modal, ScrollView,
  StyleSheet, Linking, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Theme, Radius } from '../lib/theme';
import { Product } from '../lib/types';

const WHATSAPP = '918377911745';
const WA_URL = (msg: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

interface Props {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
  onAddToWishlist: () => void;
  onAddToCart: () => void;
  isWishlisted: boolean;
}

export default function ProductModal({
  visible, product, onClose, onAddToWishlist, onAddToCart, isWishlisted,
}: Props) {
  if (!product) return null;

  const enquireWhatsApp = () => {
    const msg = `Hello Shekhar Raja Jewellers,\n\nI am interested in:\n*${product.name}*\nCategory: ${product.category} · Purity: ${product.purity}\n\nPlease share details and current pricing.`;
    Linking.openURL(WA_URL(msg)).catch(() =>
      Alert.alert('WhatsApp', `Please contact us at +${WHATSAPP}`)
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color={Theme.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Details</Text>
          <TouchableOpacity onPress={onAddToWishlist} style={styles.wishBtn}>
            <Ionicons
              name={isWishlisted ? 'heart' : 'heart-outline'}
              size={22}
              color={isWishlisted ? '#E91E8C' : Theme.textMuted}
            />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* ── Hero Image / Icon ── */}
          <View style={styles.heroWrap}>
            <View style={styles.hero}>
              <View style={styles.heroIconCircle}>
                <Ionicons name={product.icon as any} size={88} color={Theme.gold} />
              </View>
            </View>
            {/* Category pill */}
            <View style={styles.catPill}>
              <Ionicons name="diamond-outline" size={11} color={Theme.purple} />
              <Text style={styles.catPillText}>{product.category}  ·  {product.purity}</Text>
            </View>
          </View>

          {/* ── Info ── */}
          <View style={styles.infoSection}>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.description}>{product.description}</Text>

            {!!product.details && (
              <Text style={styles.details}>{product.details}</Text>
            )}

            {/* Specs row */}
            <View style={styles.specsCard}>
              {[
                { label: 'Category',   value: product.category },
                { label: 'Purity',     value: product.purity },
                { label: 'Weight',     value: `${product.weight}g` },
                { label: 'Hallmark',   value: 'BIS Certified' },
              ].map((s, i) => (
                <View key={i} style={[styles.specItem, i < 3 && styles.specBorder]}>
                  <Text style={styles.specLabel}>{s.label}</Text>
                  <Text style={styles.specValue}>{s.value}</Text>
                </View>
              ))}
            </View>

            {/* Price card */}
            <View style={styles.priceCard}>
              <View>
                <Text style={styles.priceLabel}>PRICE (INDICATIVE)</Text>
                <Text style={styles.price}>₹{product.price.toLocaleString('en-IN')}</Text>
                <Text style={styles.taxNote}>Inclusive of taxes · Lifetime polish</Text>
              </View>
              <View style={styles.priceBadge}>
                <Ionicons name="shield-checkmark" size={16} color={Theme.purple} />
                <Text style={styles.priceBadgeText}>BIS{'\n'}Hallmarked</Text>
              </View>
            </View>

            {/* Trust badges */}
            <View style={styles.trustRow}>
              {[
                { icon: 'refresh',         label: 'Easy Exchange' },
                { icon: 'shield-checkmark',label: 'Genuine Gold' },
                { icon: 'star',            label: 'Est. 1987' },
              ].map((t, i) => (
                <View key={i} style={styles.trustItem}>
                  <View style={styles.trustIcon}>
                    <Ionicons name={t.icon as any} size={18} color={Theme.purple} />
                  </View>
                  <Text style={styles.trustLabel}>{t.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* ── Footer Actions ── */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.wishlistBtn} onPress={onAddToWishlist}>
            <Ionicons
              name={isWishlisted ? 'heart' : 'heart-outline'}
              size={20}
              color={isWishlisted ? '#E91E8C' : Theme.purple}
            />
            <Text style={[styles.wishlistBtnText, isWishlisted && { color: '#E91E8C' }]}>
              {isWishlisted ? 'Saved' : 'Save'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.waBtn} onPress={enquireWhatsApp}>
            <Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" />
            <Text style={styles.waBtnText}>Enquire on WhatsApp</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.bgPrimary },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: Theme.border,
  },
  backBtn: {
    width: 40, height: 40, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Theme.bgPrimary, borderRadius: Radius.full,
  },
  headerTitle: { color: Theme.textDark, fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
  wishBtn: {
    width: 40, height: 40, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Theme.bgPrimary, borderRadius: Radius.full,
  },

  scroll: { paddingBottom: 110 },

  // Hero
  heroWrap: { backgroundColor: Theme.bgPurple, paddingTop: 28, paddingBottom: 36, alignItems: 'center' },
  hero: { alignItems: 'center', justifyContent: 'center' },
  heroIconCircle: {
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2, borderColor: 'rgba(201,168,76,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  catPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16, paddingVertical: 7,
    borderRadius: Radius.full, marginTop: 16,
  },
  catPillText: { color: Theme.purple, fontSize: 12, fontWeight: '800', letterSpacing: 1 },

  // Info section
  infoSection: { padding: 20 },
  name: {
    color: Theme.textDark, fontSize: 26, fontWeight: '900',
    letterSpacing: 0.3, lineHeight: 32, marginBottom: 8,
  },
  description: { color: Theme.purple, fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },
  details: {
    color: Theme.textMuted, fontSize: 14, lineHeight: 22,
    marginTop: 10,
  },

  // Specs card
  specsCard: {
    flexDirection: 'row', backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg, borderWidth: 1, borderColor: Theme.border,
    marginTop: 20, overflow: 'hidden',
  },
  specItem: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  specBorder: { borderRightWidth: 1, borderRightColor: Theme.border },
  specLabel: { color: Theme.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  specValue: { color: Theme.textDark, fontSize: 13, fontWeight: '800', marginTop: 5, textAlign: 'center' },

  // Price card
  priceCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFFFFF', borderRadius: Radius.lg, padding: 18,
    borderWidth: 1, borderColor: Theme.border, marginTop: 14,
    borderLeftWidth: 4, borderLeftColor: Theme.gold,
  },
  priceLabel: { color: Theme.textMuted, fontSize: 10, fontWeight: '800', letterSpacing: 2, marginBottom: 4 },
  price: { color: Theme.purple, fontSize: 30, fontWeight: '900', letterSpacing: 0.5 },
  taxNote: { color: Theme.textMuted, fontSize: 11, marginTop: 4 },
  priceBadge: {
    alignItems: 'center', backgroundColor: Theme.bgCardPurple,
    padding: 12, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Theme.purpleBorder,
  },
  priceBadgeText: { color: Theme.purple, fontSize: 10, fontWeight: '800', textAlign: 'center', marginTop: 4 },

  // Trust row
  trustRow: { flexDirection: 'row', marginTop: 16, gap: 10 },
  trustItem: { flex: 1, alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: Radius.md, paddingVertical: 14, borderWidth: 1, borderColor: Theme.border },
  trustIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: Theme.bgCardPurple, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  trustLabel: { color: Theme.textDark, fontSize: 11, fontWeight: '700', textAlign: 'center' },

  // Footer
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', gap: 12,
    padding: 16, paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1, borderTopColor: Theme.border,
  },
  wishlistBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 15, paddingHorizontal: 20, borderRadius: Radius.lg,
    backgroundColor: Theme.bgCardPurple,
    borderWidth: 1, borderColor: Theme.purpleBorder,
  },
  wishlistBtnText: { color: Theme.purple, fontSize: 14, fontWeight: '800' },
  waBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: '#25D366', paddingVertical: 15, borderRadius: Radius.lg,
  },
  waBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900', letterSpacing: 0.5 },
});
