import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

const VIOLET = '#2A1B4D';
const CREAM = '#F8F3ED';
const GOLD = '#D4AF37';
const DEEP = '#1F1414';
const MUTED = '#A98B86';

const RECIPIENTS = ['Women', 'Men', 'Kids'];
const OCCASIONS = ['Birthday', 'Wedding', 'Anniversary', 'Festival'];
const BUDGETS = ['Under ₹50k', '₹50k–₹1L', '₹1L–₹2L', '₹2L+'];
const STYLES = ['Traditional', 'Modern', 'Minimal'];

type Selection = { recipient: string; occasion: string; budget: string; style: string };

interface Product {
  id: number; name: string; price: number; tags: string[]; image: string; combo?: string;
}

const ALL_PRODUCTS: Product[] = [
  { id: 101, name: 'Eternal Solitaire Ring', price: 124000, tags: ['Perfect for Wife 💖', 'Timeless'], image: 'diamond-outline' },
  { id: 102, name: 'Heritage Necklace Set', price: 245000, tags: ['Wedding Favourite 👰', 'Trending 🔥'], image: 'flower-outline' },
  { id: 103, name: 'Royal Hoop Earrings', price: 68500, tags: ['For Her ✨', 'Modern'], image: 'ellipse-outline' },
  { id: 104, name: 'Antique Bangle Trio', price: 156000, tags: ['Festival Glow 🪔', 'Traditional'], image: 'ellipse' },
  { id: 105, name: 'Temple Pendant', price: 89000, tags: ['Spiritual 💫', 'Minimal'], image: 'star-outline' },
  { id: 106, name: 'Emerald Statement Ring', price: 198000, tags: ['Bold & Beautiful 💎'], image: 'diamond-outline' },
  { id: 107, name: 'Diamond Mangalsutra', price: 167000, tags: ['Wedding Essential 💍'], image: 'flower-outline' },
  { id: 108, name: 'Chandelier Drop Earrings', price: 112000, tags: ['Evening Glam ✨', 'Trending 🔥'], image: 'ellipse-outline' },
];

const RECOMMENDED: Product = { id: 999, name: 'Signature Gift Set', price: 289000, tags: ['Recommended Combo', 'Ring + Necklace + Earrings'], image: 'gift', combo: 'Perfect together — saves ₹42k vs buying separately' };

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={onPress} activeOpacity={0.88}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function ProductCard({ p, onWishlist, onView }: { p: Product; onWishlist: () => void; onView: () => void }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardImg}><Ionicons name={p.image as any} size={46} color={GOLD} /></View>
      <Text style={styles.cardName}>{p.name}</Text>
      <Text style={styles.cardPrice}>₹{p.price.toLocaleString('en-IN')}</Text>
      <View style={styles.tagsRow}>{p.tags.map((t, i) => <Text key={i} style={styles.tag}>{t}</Text>)}</View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.wishBtn} onPress={onWishlist}><Ionicons name="heart-outline" size={18} color="#8F5155" /></TouchableOpacity>
        <TouchableOpacity style={styles.viewBtn} onPress={onView}><Text style={styles.viewText}>View Product</Text></TouchableOpacity>
      </View>
    </View>
  );
}

export default function GiftModeScreen() {
  const [step, setStep] = useState<1 | 2>(1);
  const [sel, setSel] = useState<Selection>({ recipient: '', occasion: '', budget: '', style: '' });
  const [wishlist, setWishlist] = useState<number[]>([]);

  const progress = useSharedValue(0.5);
  const resultsFade = useSharedValue(0);
  const progressStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));
  const resultsStyle = useAnimatedStyle(() => ({ opacity: resultsFade.value, transform: [{ translateY: (1 - resultsFade.value) * 20 }] }));

  const select = (k: keyof Selection, v: string) => setSel({ ...sel, [k]: v });

  const canShow = sel.recipient && sel.occasion && sel.budget && sel.style;

  const showGifts = () => {
    if (!canShow) return;
    progress.value = withTiming(1, { duration: 420, easing: Easing.out(Easing.quad) });
    setTimeout(() => {
      setStep(2);
      resultsFade.value = 0;
      resultsFade.value = withTiming(1, { duration: 520, easing: Easing.out(Easing.quad) });
    }, 380);
  };

  const back = () => {
    progress.value = withTiming(0.5, { duration: 320 });
    resultsFade.value = withTiming(0, { duration: 260 });
    setTimeout(() => setStep(1), 280);
  };

  const toggleWish = (id: number) => setWishlist(wishlist.includes(id) ? wishlist.filter(i => i !== id) : [...wishlist, id]);

  // Filter products to feel curated (not random filter — emotional match)
  const curated = ALL_PRODUCTS.filter(p => {
    if (sel.recipient === 'Women' && p.id % 2 === 0) return true;
    if (sel.recipient === 'Men' && p.id % 3 === 0) return true;
    if (sel.recipient === 'Kids' && p.price < 100000) return true;
    if (sel.occasion === 'Wedding' && p.tags.some(t => t.includes('Wedding'))) return true;
    if (sel.occasion === 'Festival' && p.tags.some(t => t.includes('Festival'))) return true;
    return p.price < 200000; // default: accessible premium
  }).slice(0, 6);

  const results = curated.length ? curated : ALL_PRODUCTS.slice(0, 5);

  return (
    <SafeAreaView style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.title}>Gift Mode</Text>
        <Text style={styles.subtitle}>Find the perfect piece — with heart</Text>
      </View>

      {/* Progress */}
      <View style={styles.progressTrack}><Animated.View style={[styles.progressFill, progressStyle]} /></View>
      <Text style={styles.stepText}>Step {step} of 2</Text>

      {step === 1 ? (
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
          <Text style={styles.section}>Who is it for?</Text>
          <View style={styles.row}>{RECIPIENTS.map(r => <Chip key={r} label={r} active={sel.recipient === r} onPress={() => select('recipient', r)} />)}</View>

          <Text style={styles.section}>What is the occasion?</Text>
          <View style={styles.row}>{OCCASIONS.map(o => <Chip key={o} label={o} active={sel.occasion === o} onPress={() => select('occasion', o)} />)}</View>

          <Text style={styles.section}>Your budget</Text>
          <View style={styles.row}>{BUDGETS.map(b => <Chip key={b} label={b} active={sel.budget === b} onPress={() => select('budget', b)} />)}</View>

          <Text style={styles.section}>What style speaks to you?</Text>
          <View style={styles.row}>{STYLES.map(s => <Chip key={s} label={s} active={sel.style === s} onPress={() => select('style', s)} />)}</View>

          <TouchableOpacity style={[styles.cta, !canShow && styles.ctaDisabled]} onPress={showGifts} disabled={!canShow} activeOpacity={0.9}>
            <Text style={styles.ctaText}>SHOW GIFTS</Text>
            <Ionicons name="arrow-forward" size={20} color={CREAM} />
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Recommended Combo */}
          <View style={styles.comboBox}>
            <View style={styles.comboHead}><Ionicons name="gift" size={26} color={GOLD} /><Text style={styles.comboTitle}>Recommended Combo</Text></View>
            <Text style={styles.comboName}>{RECOMMENDED.name}</Text>
            <Text style={styles.comboPrice}>₹{RECOMMENDED.price.toLocaleString('en-IN')}</Text>
            <Text style={styles.comboNote}>{RECOMMENDED.combo}</Text>
            <TouchableOpacity style={styles.comboBtn} onPress={() => {}}><Text style={styles.comboBtnText}>Add Combo to Wishlist</Text></TouchableOpacity>
          </View>

          {/* Results Grid */}
          <Text style={styles.resultsTitle}>Curated for {sel.recipient} • {sel.occasion}</Text>
          <View style={styles.grid}>
            {results.map(p => (
              <ProductCard key={p.id} p={p} onWishlist={() => toggleWish(p.id)} onView={() => { /* open product modal if desired */ }} />
            ))}
          </View>

          <TouchableOpacity style={styles.backBtn} onPress={back}><Ionicons name="chevron-back" size={20} color={GOLD} /><Text style={styles.backText}>Change Selection</Text></TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: VIOLET },
  header: { paddingTop: 18, paddingHorizontal: 20, paddingBottom: 6 },
  title: { color: CREAM, fontSize: 28, fontWeight: '900', letterSpacing: 1 },
  subtitle: { color: '#C9B8A8', fontSize: 14, marginTop: 4, fontWeight: '600' },
  progressTrack: { height: 5, backgroundColor: '#3D2C5F', marginHorizontal: 20, borderRadius: 3, marginTop: 12 },
  progressFill: { height: 5, backgroundColor: GOLD, borderRadius: 3 },
  stepText: { color: '#C9B8A8', fontSize: 12, fontWeight: '700', letterSpacing: 2, marginTop: 8, marginLeft: 20, textTransform: 'uppercase' },
  section: { color: CREAM, fontSize: 15, fontWeight: '800', marginTop: 22, marginBottom: 10, letterSpacing: 0.5 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingVertical: 12, paddingHorizontal: 20, backgroundColor: '#3D2C5F', borderRadius: 28, borderWidth: 1, borderColor: '#59427A' },
  chipActive: { backgroundColor: GOLD, borderColor: GOLD },
  chipText: { color: CREAM, fontSize: 14, fontWeight: '700' },
  chipTextActive: { color: DEEP },
  cta: { marginTop: 32, backgroundColor: GOLD, paddingVertical: 18, borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  ctaDisabled: { opacity: 0.45 },
  ctaText: { color: DEEP, fontSize: 15, fontWeight: '900', letterSpacing: 2 },
  // Results
  comboBox: { margin: 20, backgroundColor: CREAM, borderRadius: 22, padding: 20, borderWidth: 1, borderColor: '#D9C9B8' },
  comboHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  comboTitle: { color: '#8C5C2D', fontSize: 15, fontWeight: '900', letterSpacing: 1 },
  comboName: { color: DEEP, fontSize: 20, fontWeight: '900', marginTop: 2 },
  comboPrice: { color: GOLD, fontSize: 22, fontWeight: '900', marginTop: 2 },
  comboNote: { color: MUTED, fontSize: 13, marginTop: 6, lineHeight: 18 },
  comboBtn: { marginTop: 14, backgroundColor: '#8C5C2D', paddingVertical: 12, borderRadius: 24, alignItems: 'center' },
  comboBtnText: { color: CREAM, fontSize: 13, fontWeight: '800', letterSpacing: 1 },
  resultsTitle: { color: CREAM, fontSize: 16, fontWeight: '800', marginHorizontal: 20, marginTop: 6, marginBottom: 12, letterSpacing: 0.5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 14 },
  card: { width: '47%', backgroundColor: CREAM, borderRadius: 18, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#D9C9B8' },
  cardImg: { height: 86, backgroundColor: '#F0E6D8', borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  cardName: { color: DEEP, fontSize: 14, fontWeight: '800', lineHeight: 18 },
  cardPrice: { color: GOLD, fontSize: 17, fontWeight: '900', marginTop: 4 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  tag: { fontSize: 10, color: '#8C5C2D', backgroundColor: '#F0E6D8', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, fontWeight: '700' },
  cardActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  wishBtn: { padding: 6 },
  viewBtn: { backgroundColor: GOLD, paddingVertical: 9, paddingHorizontal: 14, borderRadius: 18 },
  viewText: { color: DEEP, fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  backBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10, paddingVertical: 16 },
  backText: { color: GOLD, fontSize: 14, fontWeight: '700', letterSpacing: 1 },
});