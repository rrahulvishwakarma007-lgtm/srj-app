import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Image, Linking, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withRepeat, withSequence, Easing,
} from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { products } from '../lib/data';
import { Product } from '../lib/types';
import { loadCart, saveCart, loadWishlist, saveWishlist } from '../lib/storage';

const GOLD        = '#C9A84C';
const GOLD_LIGHT  = '#F0D080';
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

type ScanState = 'idle' | 'scanning' | 'results';

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  const [state, setState]         = useState<ScanState>('idle');
  const [pickedImage, setPickedImage] = useState<string | null>(null);
  const [results, setResults]     = useState<Product[]>([]);
  const [added, setAdded]         = useState('');
  const [savedId, setSavedId]     = useState<number | null>(null);

  const scanY = useSharedValue(0);
  const scanStyle = useAnimatedStyle(() => ({ transform: [{ translateY: scanY.value }] }));

  const runScanAnimation = () => {
    scanY.value = 0;
    scanY.value = withRepeat(
      withSequence(
        withTiming(180, { duration: 1000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0,   { duration: 1000, easing: Easing.inOut(Easing.quad) })
      ), 3, false
    );
  };

  const processImage = (uri: string) => {
    setPickedImage(uri);
    setState('scanning');
    runScanAnimation();
    // Simulate AI matching — pick 3 random products as "matches"
    setTimeout(() => {
      const shuffled = [...products].sort(() => Math.random() - 0.5);
      setResults(shuffled.slice(0, 3));
      setState('results');
    }, 2800);
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permission is required to scan jewellery.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets[0]) {
      processImage(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Gallery permission is required to pick jewellery photos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets[0]) {
      processImage(result.assets[0].uri);
    }
  };

  const reset = () => {
    setPickedImage(null);
    setResults([]);
    setAdded('');
    setSavedId(null);
    setState('idle');
  };

  const saveToWishlist = async (item: Product) => {
    const wl = await loadWishlist();
    if (!wl.some(w => w.id === item.id)) {
      await saveWishlist([...wl, item]);
    }
    setSavedId(item.id);
    setAdded('Saved to Wishlist!');
    setTimeout(() => setAdded(''), 1600);
  };

  const enquireWhatsApp = (item: Product) => {
    const msg = `Hi! I found this jewellery via your app scan feature and I'm interested in: *${item.name}* (₹${item.price.toLocaleString('en-IN')}). Can you share more details?`;
    Linking.openURL(`https://wa.me/918377911745?text=${encodeURIComponent(msg)}`);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Scan & Find</Text>
          <Text style={styles.headerSub}>Find matching jewellery from a photo</Text>
        </View>
        <View style={styles.headerIcon}>
          <Ionicons name="scan" size={24} color={GOLD} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── IDLE STATE ── */}
        {state === 'idle' && (
          <View style={styles.idleWrap}>
            {/* Hero illustration */}
            <View style={styles.heroCircle}>
              <Ionicons name="scan-circle" size={90} color={GOLD} />
            </View>
            <Text style={styles.idleTitle}>Jewellery Recognition</Text>
            <Text style={styles.idleDesc}>
              Take a photo or pick one from your gallery — Instagram, WhatsApp, anywhere.
              Our app finds the closest matching pieces from our collection.
            </Text>

            {/* How it works */}
            <View style={styles.stepsCard}>
              {[
                { icon: 'camera',         text: 'Take or pick a jewellery photo' },
                { icon: 'color-wand',     text: 'AI scans and matches the design' },
                { icon: 'heart',          text: 'Save or enquire about matches'   },
              ].map((s, i) => (
                <View key={i} style={styles.stepRow}>
                  <View style={styles.stepNum}>
                    <Text style={styles.stepNumText}>{i + 1}</Text>
                  </View>
                  <Ionicons name={s.icon as any} size={18} color={GOLD} style={{ marginHorizontal: 10 }} />
                  <Text style={styles.stepText}>{s.text}</Text>
                </View>
              ))}
            </View>

            {/* Action Buttons */}
            <TouchableOpacity style={styles.primaryBtn} onPress={openCamera} activeOpacity={0.85}>
              <Ionicons name="camera" size={22} color={PURPLE_DARK} style={{ marginRight: 10 }} />
              <Text style={styles.primaryBtnText}>Open Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryBtn} onPress={openGallery} activeOpacity={0.85}>
              <Ionicons name="images" size={22} color={GOLD} style={{ marginRight: 10 }} />
              <Text style={styles.secondaryBtnText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <Text style={styles.tipText}>
              Tip: Works great with photos from Instagram, Pinterest, WhatsApp
            </Text>
          </View>
        )}

        {/* ── SCANNING STATE ── */}
        {state === 'scanning' && pickedImage && (
          <View style={styles.scanWrap}>
            <Text style={styles.scanningLabel}>Analysing your image...</Text>

            {/* Image with laser overlay */}
            <View style={styles.scanFrame}>
              <Image source={{ uri: pickedImage }} style={styles.scanImage} resizeMode="cover" />
              {/* Corner marks */}
              <View style={[styles.corner, styles.tl]} />
              <View style={[styles.corner, styles.tr]} />
              <View style={[styles.corner, styles.bl]} />
              <View style={[styles.corner, styles.br]} />
              {/* Laser line */}
              <Animated.View style={[styles.laser, scanStyle]} />
              {/* Dark overlay pulse */}
              <View style={styles.scanOverlay} />
            </View>

            <View style={styles.scanStatusRow}>
              <View style={styles.scanDot} />
              <Text style={styles.scanStatusText}>SCANNING JEWELLERY DESIGN...</Text>
            </View>

            <View style={styles.scanSteps}>
              {['Detecting shape', 'Matching pattern', 'Finding similar pieces'].map((s, i) => (
                <View key={i} style={styles.scanStepRow}>
                  <Ionicons name="checkmark-circle" size={16} color={GOLD} />
                  <Text style={styles.scanStepText}>{s}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── RESULTS STATE ── */}
        {state === 'results' && pickedImage && (
          <View style={styles.resultsWrap}>

            {/* Scanned image thumbnail */}
            <View style={styles.resultHeader}>
              <Image source={{ uri: pickedImage }} style={styles.thumbImage} resizeMode="cover" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.resultTitle}>Matches Found!</Text>
                <Text style={styles.resultSub}>{results.length} similar pieces in our collection</Text>
                <View style={styles.matchBadge}>
                  <Ionicons name="checkmark-circle" size={14} color="#16a34a" />
                  <Text style={styles.matchBadgeText}>Scan complete</Text>
                </View>
              </View>
            </View>

            <Text style={styles.matchLabel}>Similar Jewellery in Our Collection</Text>

            {results.map((item, idx) => (
              <View key={item.id} style={styles.resultCard}>
                <View style={styles.resultCardTop}>
                  {/* Match score */}
                  <View style={styles.matchScore}>
                    <Text style={styles.matchScoreText}>
                      {idx === 0 ? '94%' : idx === 1 ? '87%' : '79%'}
                    </Text>
                    <Text style={styles.matchScoreLabel}>match</Text>
                  </View>

                  {/* Product icon */}
                  <View style={[styles.resultIcon, { backgroundColor: item.color + '22' }]}>
                    <Ionicons name={item.icon as any} size={36} color={item.color} />
                  </View>

                  {/* Product info */}
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultName}>{item.name}</Text>
                    <Text style={styles.resultMeta}>{item.purity} · {item.weight}g</Text>
                    <Text style={styles.resultPrice}>₹{item.price.toLocaleString('en-IN')}</Text>
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.resultActions}>
                  <TouchableOpacity
                    style={[styles.resultBtn, styles.wishBtn, savedId === item.id && styles.savedBtn]}
                    onPress={() => saveToWishlist(item)}
                    activeOpacity={0.85}
                  >
                    <Ionicons
                      name={savedId === item.id ? 'heart' : 'heart-outline'}
                      size={16}
                      color={savedId === item.id ? '#fff' : GOLD}
                    />
                    <Text style={[styles.resultBtnText, savedId === item.id && { color: '#fff' }]}>
                      {savedId === item.id ? 'Saved' : 'Wishlist'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.resultBtn, styles.waResultBtn]}
                    onPress={() => enquireWhatsApp(item)}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="logo-whatsapp" size={16} color="#fff" />
                    <Text style={[styles.resultBtnText, { color: '#fff' }]}>Enquire</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Scan again */}
            <TouchableOpacity style={styles.scanAgainBtn} onPress={reset} activeOpacity={0.85}>
              <Ionicons name="refresh" size={18} color={PURPLE_DARK} style={{ marginRight: 8 }} />
              <Text style={styles.scanAgainText}>Scan Another Piece</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.waFullBtn} onPress={() => Linking.openURL('https://wa.me/918377911745')} activeOpacity={0.85}>
              <Ionicons name="logo-whatsapp" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.waFullBtnText}>Chat with Us on WhatsApp</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Toast */}
      {!!added && (
        <View style={styles.toast}>
          <Ionicons name="checkmark-circle" size={16} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.toastText}>{added}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: PURPLE_DARK },
  scroll: { flex: 1, backgroundColor: BG },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: PURPLE_DARK, paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: 'rgba(201,168,76,0.3)',
  },
  headerTitle: { color: GOLD, fontSize: 20, fontWeight: '800' },
  headerSub:   { color: 'rgba(240,208,128,0.7)', fontSize: 12, marginTop: 2 },
  headerIcon: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(201,168,76,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },

  // ── IDLE ──
  idleWrap:   { padding: 20, alignItems: 'center' },
  heroCircle: {
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: PURPLE_DARK, alignItems: 'center', justifyContent: 'center',
    marginTop: 16, marginBottom: 20,
    borderWidth: 2, borderColor: 'rgba(201,168,76,0.4)',
  },
  idleTitle: { color: TEXT_DARK, fontSize: 22, fontWeight: '800', textAlign: 'center' },
  idleDesc:  { color: TEXT_MID, fontSize: 14, textAlign: 'center', lineHeight: 21, marginTop: 10, marginBottom: 20 },

  stepsCard: {
    width: '100%', backgroundColor: BG_CARD, borderRadius: 16,
    borderWidth: 1, borderColor: BORDER, padding: 16, marginBottom: 24, gap: 14,
  },
  stepRow:     { flexDirection: 'row', alignItems: 'center' },
  stepNum: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: PURPLE_DARK, alignItems: 'center', justifyContent: 'center',
  },
  stepNumText: { color: GOLD, fontSize: 12, fontWeight: '800' },
  stepText:    { color: TEXT_MID, fontSize: 13, flex: 1 },

  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: GOLD, borderRadius: 28, paddingVertical: 15,
    width: '100%', marginBottom: 12,
    shadowColor: GOLD, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4,
  },
  primaryBtnText: { color: PURPLE_DARK, fontSize: 16, fontWeight: '900' },

  secondaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: BG_CARD, borderRadius: 28, paddingVertical: 14,
    width: '100%', borderWidth: 1.5, borderColor: GOLD, marginBottom: 16,
  },
  secondaryBtnText: { color: GOLD, fontSize: 16, fontWeight: '800' },

  tipText: { color: TEXT_LIGHT, fontSize: 12, textAlign: 'center', lineHeight: 18 },

  // ── SCANNING ──
  scanWrap:      { padding: 20, alignItems: 'center' },
  scanningLabel: { color: TEXT_DARK, fontSize: 18, fontWeight: '800', marginBottom: 20, marginTop: 8 },

  scanFrame: {
    width: 280, height: 280, borderRadius: 20, overflow: 'hidden',
    borderWidth: 2, borderColor: GOLD, position: 'relative',
  },
  scanImage:   { width: '100%', height: '100%' },
  scanOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(45,27,94,0.25)' },

  corner: { position: 'absolute', width: 28, height: 28, borderColor: GOLD },
  tl: { top: 0,  left: 0,  borderTopWidth: 4, borderLeftWidth: 4 },
  tr: { top: 0,  right: 0, borderTopWidth: 4, borderRightWidth: 4 },
  bl: { bottom: 0, left: 0,  borderBottomWidth: 4, borderLeftWidth: 4 },
  br: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4 },

  laser: {
    position: 'absolute', left: 0, right: 0, height: 3,
    backgroundColor: GOLD, opacity: 0.85,
  },

  scanStatusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20, gap: 8 },
  scanDot:       { width: 10, height: 10, borderRadius: 5, backgroundColor: GOLD },
  scanStatusText:{ color: TEXT_DARK, fontSize: 13, fontWeight: '700', letterSpacing: 1.5 },

  scanSteps: { marginTop: 16, gap: 10, width: '100%' },
  scanStepRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20 },
  scanStepText:{ color: TEXT_MID, fontSize: 13 },

  // ── RESULTS ──
  resultsWrap: { padding: 16 },

  resultHeader: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: BG_CARD, borderRadius: 16,
    borderWidth: 1, borderColor: BORDER,
    padding: 14, marginBottom: 16,
  },
  thumbImage: { width: 72, height: 72, borderRadius: 12, borderWidth: 1, borderColor: BORDER },
  resultTitle: { color: TEXT_DARK, fontSize: 17, fontWeight: '800' },
  resultSub:   { color: TEXT_MID, fontSize: 13, marginTop: 3 },
  matchBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#dcfce7', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 3, marginTop: 6, alignSelf: 'flex-start',
  },
  matchBadgeText: { color: '#166534', fontSize: 11, fontWeight: '700' },

  matchLabel: { color: TEXT_DARK, fontSize: 15, fontWeight: '800', marginBottom: 12 },

  resultCard: {
    backgroundColor: BG_CARD, borderRadius: 16,
    borderWidth: 1, borderColor: BORDER,
    padding: 14, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  resultCardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  matchScore: {
    alignItems: 'center', backgroundColor: PURPLE_DARK,
    borderRadius: 10, paddingHorizontal: 8, paddingVertical: 6,
    marginRight: 12, minWidth: 48,
  },
  matchScoreText:  { color: GOLD, fontSize: 16, fontWeight: '900' },
  matchScoreLabel: { color: 'rgba(201,168,76,0.7)', fontSize: 10, fontWeight: '600' },
  resultIcon: {
    width: 64, height: 64, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  resultInfo:  { flex: 1 },
  resultName:  { color: TEXT_DARK, fontSize: 14, fontWeight: '800' },
  resultMeta:  { color: TEXT_LIGHT, fontSize: 12, marginTop: 2 },
  resultPrice: { color: PURPLE_MID, fontSize: 16, fontWeight: '900', marginTop: 3 },

  resultActions: { flexDirection: 'row', gap: 10 },
  resultBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 10, borderRadius: 12, gap: 6,
  },
  wishBtn:    { backgroundColor: BG_CARD, borderWidth: 1.5, borderColor: GOLD },
  savedBtn:   { backgroundColor: GOLD, borderColor: GOLD },
  waResultBtn:{ backgroundColor: WHATSAPP },
  resultBtnText: { color: GOLD, fontSize: 13, fontWeight: '700' },

  scanAgainBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: GOLD, borderRadius: 28, paddingVertical: 14,
    marginTop: 8, marginBottom: 10,
  },
  scanAgainText: { color: PURPLE_DARK, fontSize: 15, fontWeight: '900' },

  waFullBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: WHATSAPP, borderRadius: 28, paddingVertical: 14,
  },
  waFullBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },

  // Toast
  toast: {
    position: 'absolute', bottom: 30, alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: PURPLE_DARK, paddingVertical: 10, paddingHorizontal: 20,
    borderRadius: 24, borderWidth: 1, borderColor: GOLD,
  },
  toastText: { color: GOLD, fontSize: 13, fontWeight: '700' },
});
