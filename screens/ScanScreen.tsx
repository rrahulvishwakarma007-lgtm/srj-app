import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence, Easing } from 'react-native-reanimated';
import { products } from '../lib/data';
import { Product } from '../lib/types';
import { loadCart, saveCart, loadWishlist, saveWishlist } from '../lib/storage';

export default function ScanScreen() {
  const [scanning, setScanning] = useState(false);
  const [detected, setDetected] = useState<Product | null>(null);
  const [added, setAdded] = useState('');

  const scanY = useSharedValue(0);
  const scanStyle = useAnimatedStyle(() => ({ transform: [{ translateY: scanY.value }] }));

  const startScan = () => {
    setScanning(true);
    setDetected(null);
    scanY.value = 0;
    // Animated scanning laser line
    scanY.value = withRepeat(
      withSequence(
        withTiming(160, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.quad) })
      ), 2, false
    );
    // After scan animation, "detect" a random product
    setTimeout(() => {
      const pick = products[Math.floor(Math.random() * products.length)];
      setDetected(pick);
      setScanning(false);
    }, 2600);
  };

  const addToCart = async () => {
    if (!detected) return;
    const cart = await loadCart();
    const existing = cart.findIndex(c => c.id === detected.id);
    const newCart = existing >= 0 ? cart.map((c,i) => i===existing ? { ...c, quantity: c.quantity+1 } : c) : [...cart, { ...detected, quantity: 1 }];
    await saveCart(newCart);
    setAdded('Added to Cart');
    setTimeout(() => setAdded(''), 1400);
  };

  const addToWishlist = async () => {
    if (!detected) return;
    const wl = await loadWishlist();
    if (!wl.some(w => w.id === detected.id)) { await saveWishlist([...wl, detected]); }
    setAdded('Saved to Wishlist');
    setTimeout(() => setAdded(''), 1400);
  };

  const rescan = () => { setDetected(null); setAdded(''); };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>Scan Jewellery</Text><Text style={styles.hint}>Point at the piece or QR tag</Text></View>

      {/* Camera Frame */}
      <View style={styles.camera}>
        <View style={styles.frame}>
          {/* Corner marks */}
          <View style={[styles.corner, styles.tl]} /><View style={[styles.corner, styles.tr]} />
          <View style={[styles.corner, styles.bl]} /><View style={[styles.corner, styles.br]} />
          {/* Scanning laser line */}
          {scanning && <Animated.View style={[styles.laser, scanStyle]} />}
        </View>
        <Text style={styles.status}>{scanning ? 'SCANNING...' : detected ? 'DETECTED' : 'READY'}</Text>
      </View>

      {/* Controls */}
      {!detected && !scanning && (
        <TouchableOpacity style={styles.scanBtn} onPress={startScan}>
          <Ionicons name="scan" size={22} color="#F8F3ED" /><Text style={styles.scanText}>START SCAN</Text>
        </TouchableOpacity>
      )}
      {scanning && <Text style={styles.scanning}>Hold steady • Align jewellery in frame</Text>}
      {detected && (
        <View style={styles.result}>
          <View style={styles.prodCard}>
            <View style={[styles.prodIcon, { backgroundColor: detected.color + '18' }]}><Ionicons name={detected.icon as any} size={46} color={detected.color} /></View>
            <Text style={styles.prodName}>{detected.name}</Text>
            <Text style={styles.prodMeta}>{detected.weight}g • {detected.purity} • {detected.description}</Text>
            <Text style={styles.prodPrice}>₹{detected.price.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.actBtn, styles.wish]} onPress={addToWishlist}><Ionicons name="heart" size={18} color="#8F5155" /><Text style={styles.actText}>WISHLIST</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.actBtn, styles.cart]} onPress={addToCart}><Ionicons name="cart" size={18} color="#F8F3ED" /><Text style={[styles.actText, { color: '#F8F3ED' }]}>ADD TO CART</Text></TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.rescan} onPress={rescan}><Text style={styles.rescanText}>SCAN ANOTHER PIECE</Text></TouchableOpacity>
        </View>
      )}
      {!!added && <Text style={styles.toast}>{added}</Text>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0A08', alignItems: 'center' },
  header: { alignItems: 'center', paddingTop: 30, paddingBottom: 10 },
  title: { color: '#F8F3ED', fontSize: 24, fontWeight: '900', letterSpacing: 2 },
  hint: { color: '#8C5C2D', fontSize: 13, marginTop: 4, letterSpacing: 1 },
  camera: { width: '86%', aspectRatio: 1, backgroundColor: '#1A1210', borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginTop: 18, borderWidth: 1, borderColor: '#3A2A24' },
  frame: { width: 220, height: 220, borderWidth: 3, borderColor: '#8C5C2D', borderRadius: 12, position: 'relative', overflow: 'hidden' },
  corner: { position: 'absolute', width: 24, height: 24, borderColor: '#F8F3ED' },
  tl: { top: -2, left: -2, borderTopWidth: 5, borderLeftWidth: 5 }, tr: { top: -2, right: -2, borderTopWidth: 5, borderRightWidth: 5 },
  bl: { bottom: -2, left: -2, borderBottomWidth: 5, borderLeftWidth: 5 }, br: { bottom: -2, right: -2, borderBottomWidth: 5, borderRightWidth: 5 },
  laser: { position: 'absolute', left: 0, right: 0, height: 3, backgroundColor: '#8C5C2D', shadowColor: '#8C5C2D', shadowOpacity: 0.9, shadowRadius: 6 },
  status: { color: '#8C5C2D', fontSize: 12, fontWeight: '700', letterSpacing: 3, marginTop: 18 },
  scanBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#8C5C2D', paddingVertical: 16, paddingHorizontal: 36, borderRadius: 28, marginTop: 28 },
  scanText: { color: '#F8F3ED', fontSize: 14, fontWeight: '800', letterSpacing: 2 },
  scanning: { color: '#8C5C2D', marginTop: 14, fontSize: 13, letterSpacing: 1 },
  result: { width: '90%', marginTop: 24, alignItems: 'center' },
  prodCard: { backgroundColor: '#1F1612', borderRadius: 18, padding: 18, alignItems: 'center', width: '100%', borderWidth: 1, borderColor: '#3A2A24' },
  prodIcon: { width: 88, height: 88, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  prodName: { color: '#F8F3ED', fontSize: 17, fontWeight: '900', textAlign: 'center' },
  prodMeta: { color: '#8C5C2D', fontSize: 12, marginTop: 4, textAlign: 'center' },
  prodPrice: { color: '#8C5C2D', fontSize: 22, fontWeight: '900', marginTop: 8 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 14 },
  actBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 14 },
  wish: { backgroundColor: '#1F1612', borderWidth: 1, borderColor: '#8F5155' }, cart: { backgroundColor: '#7A4B6A' },
  actText: { color: '#F8F3ED', fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  rescan: { marginTop: 16, padding: 10 },
  rescanText: { color: '#8C5C2D', fontSize: 13, fontWeight: '700', letterSpacing: 1.5 },
  toast: { position: 'absolute', bottom: 40, backgroundColor: '#8C5C2D', color: '#F8F3ED', paddingVertical: 10, paddingHorizontal: 22, borderRadius: 20, fontWeight: '700' },
});