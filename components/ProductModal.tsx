import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Linking, Dimensions, Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../lib/types';

const { width: W } = Dimensions.get('window');

const GOLD        = '#C9A84C';
const PURPLE_DARK = '#2D1B5E';
const PURPLE_MID  = '#4A2080';
const PURPLE_HERO = '#3D1A6E';
const BG          = '#F0EBFF';
const BG_CARD     = '#FFFFFF';
const BORDER      = '#DDD5F0';
const TEXT_DARK   = '#1A0A3E';
const TEXT_MID    = '#4A3570';
const TEXT_LIGHT  = '#8B7BAF';
const WHATSAPP    = '#25D366';

interface Props {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
  onAddToWishlist?: () => void;
  onAddToCart?: () => void;
  isWishlisted?: boolean;
}

export default function ProductModal({
  visible, product, onClose, onAddToWishlist, isWishlisted,
}: Props) {
  const insets = useSafeAreaInsets();

  if (!product) return null;

  // Resolve image from whichever field is set
  const imageUri =
    (product as any).image ||
    (product as any).imageUrl ||
    (product as any).photo ||
    null;

  const enquire = () => {
    const msg =
      `Hello Shekhar Raja Jewellers! 🙏\n\n` +
      `I'm interested in:\n` +
      `💎 *${product.name}*\n` +
      `📦 Category: ${product.category}\n` +
      `📝 ${product.description}\n\n` +
      `Please share more details. Thank you!`;
    Linking.openURL(`https://wa.me/918377911745?text=${encodeURIComponent(msg)}`);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.root, { paddingTop: insets.top }]}>

        {/* ── HEADER ── */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn} onPress={onClose} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={20} color={TEXT_DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Details</Text>
          <TouchableOpacity style={styles.headerBtn} onPress={onAddToWishlist} activeOpacity={0.8}>
            <Ionicons
              name={isWishlisted ? 'heart' : 'heart-outline'}
              size={20}
              color={isWishlisted ? '#e53e3e' : TEXT_MID}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >

          {/* ── IMAGE HERO ── */}
          <View style={styles.imageHero}>
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={styles.productImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.iconFallback}>
                <Ionicons name="diamond-outline" size={80} color={GOLD} />
              </View>
            )}

            {/* Category pill */}
            <View style={styles.categoryPill}>
              <Ionicons name="diamond-outline" size={13} color={PURPLE_MID} style={{ marginRight: 5 }} />
              <Text style={styles.categoryPillText}>
                {product.category}
              </Text>
            </View>
          </View>

          {/* ── INFO ── */}
          <View style={styles.infoWrap}>

            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productDesc}>{product.description}</Text>

            {/* Specs — NO price, NO weight */}
            <View style={styles.specsRow}>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>CATEGORY</Text>
                <Text style={styles.specValue}>{product.category}</Text>
              </View>
              <View style={styles.specDivider} />
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>HALLMARK</Text>
                <Text style={styles.specValue}>BIS Certified</Text>
              </View>
              <View style={styles.specDivider} />
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>QUALITY</Text>
                <Text style={styles.specValue}>Premium</Text>
              </View>
            </View>

            {/* Trust badges */}
            <View style={styles.trustRow}>
              <View style={styles.trustItem}>
                <Ionicons name="shield-checkmark" size={22} color={GOLD} />
                <Text style={styles.trustLabel}>100%{'\n'}Hallmarked</Text>
              </View>
              <View style={styles.trustItem}>
                <Ionicons name="ribbon" size={22} color={GOLD} />
                <Text style={styles.trustLabel}>BIS{'\n'}Certified</Text>
              </View>
              <View style={styles.trustItem}>
                <Ionicons name="swap-horizontal" size={22} color={GOLD} />
                <Text style={styles.trustLabel}>Easy{'\n'}Exchange</Text>
              </View>
              <View style={styles.trustItem}>
                <Ionicons name="star" size={22} color={GOLD} />
                <Text style={styles.trustLabel}>Lifetime{'\n'}Polish</Text>
              </View>
            </View>

            {/* Note */}
            <View style={styles.noteCard}>
              <Ionicons name="information-circle-outline" size={18} color={PURPLE_MID} style={{ marginRight: 8, marginTop: 1 }} />
              <Text style={styles.noteText}>
                For pricing and availability, please enquire via WhatsApp. Our team will assist you personally.
              </Text>
            </View>

          </View>
        </ScrollView>

        {/* ── BOTTOM ACTIONS ── */}
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 10 }]}>
          <TouchableOpacity style={styles.saveBtn} onPress={onAddToWishlist} activeOpacity={0.8}>
            <Ionicons
              name={isWishlisted ? 'heart' : 'heart-outline'}
              size={20}
              color={isWishlisted ? '#e53e3e' : PURPLE_MID}
            />
            <Text style={styles.saveBtnText}>{isWishlisted ? 'Saved' : 'Save'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.waBtn} onPress={enquire} activeOpacity={0.85}>
            <Ionicons name="logo-whatsapp" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.waBtnText}>Enquire on WhatsApp</Text>
          </TouchableOpacity>
        </View>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: BG },
  scroll: { flex: 1 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: BG, paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: BORDER,
  },
  headerBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: BG_CARD, borderWidth: 1, borderColor: BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: TEXT_DARK },

  imageHero: {
    width: W, height: W * 0.85,
    backgroundColor: PURPLE_HERO,
  },
  productImage: { width: '100%', height: '100%' },
  iconFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  categoryPill: {
    position: 'absolute', bottom: 16, alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 18, paddingVertical: 8,
    borderRadius: 99,
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, elevation: 4,
  },
  categoryPillText: { color: PURPLE_MID, fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },

  infoWrap: { backgroundColor: BG, paddingHorizontal: 16, paddingTop: 20 },
  productName: { fontSize: 26, fontWeight: '900', color: TEXT_DARK, marginBottom: 6 },
  productDesc: { fontSize: 14, color: PURPLE_MID, fontWeight: '600', lineHeight: 20, marginBottom: 20 },

  specsRow: {
    flexDirection: 'row', backgroundColor: BG_CARD,
    borderRadius: 14, borderWidth: 1, borderColor: BORDER,
    overflow: 'hidden', marginBottom: 18,
  },
  specItem:   { flex: 1, alignItems: 'center', paddingVertical: 14 },
  specDivider:{ width: 1, backgroundColor: BORDER },
  specLabel:  { fontSize: 9, fontWeight: '700', color: TEXT_LIGHT, letterSpacing: 0.8, marginBottom: 4 },
  specValue:  { fontSize: 12, fontWeight: '800', color: TEXT_DARK },

  trustRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    backgroundColor: BG_CARD, borderRadius: 14,
    borderWidth: 1, borderColor: BORDER,
    paddingVertical: 16, marginBottom: 16,
  },
  trustItem:  { alignItems: 'center', gap: 6 },
  trustLabel: { color: TEXT_MID, fontSize: 10, fontWeight: '600', textAlign: 'center', lineHeight: 14 },

  noteCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: 'rgba(74,32,128,0.06)',
    borderRadius: 12, borderWidth: 1,
    borderColor: 'rgba(74,32,128,0.15)',
    padding: 14, marginBottom: 10,
  },
  noteText: { flex: 1, fontSize: 12, color: TEXT_MID, lineHeight: 18, fontWeight: '500' },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', gap: 10,
    backgroundColor: BG_CARD,
    borderTopWidth: 1, borderTopColor: BORDER,
    paddingHorizontal: 16, paddingTop: 12,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 6,
  },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: BG, borderRadius: 28,
    borderWidth: 1.5, borderColor: BORDER,
    paddingHorizontal: 20, paddingVertical: 13,
  },
  saveBtnText: { color: PURPLE_MID, fontSize: 14, fontWeight: '700' },
  waBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: WHATSAPP, borderRadius: 28, paddingVertical: 13,
    shadowColor: WHATSAPP, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4,
  },
  waBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
});
