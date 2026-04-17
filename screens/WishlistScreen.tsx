import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Linking, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { Product } from '../lib/types';
import { loadWishlist, saveWishlist } from '../lib/storage';

const { width } = Dimensions.get('window');
const COL = 2;
const GAP = 12;
const CARD_W = (width - 32 - GAP) / COL;

// Premium colors per spec
const BG = '#2A1B4D';        // Royal violet background
const CARD = '#F8F3ED';      // Cream cards
const GOLD = '#D4AF37';      // Gold accents
const TEXT = '#1F1414';      // Deep text
const MUTED = '#4F3636';     // Muted
const BTN = '#8C5C2D';       // Deep gold button
const VIOLET = '#7A4B6A';    // Royal violet for accents

interface WishItem extends Product {}

export default function WishlistScreen() {
  const [items, setItems] = useState<WishItem[]>([]);

  useEffect(() => { (async () => setItems(await loadWishlist()))(); }, []);
  useEffect(() => { saveWishlist(items); }, [items]);

  // Smooth remove with fade animation
  const removeItem = (id: number) => {
    setItems(items.filter(i => i.id !== id));
  };

  // WhatsApp enquiry — opens WhatsApp with prefilled message
  const enquireWhatsApp = (item: WishItem) => {
    const phone = '+919876543210'; // Shekhar Raja Jewellers showroom
    const msg = `Hello Shekhar Raja Jewellers,%0A%0AI'm interested in: ${item.name} (${item.weight}g, ${item.purity}) — ₹${item.price.toLocaleString('en-IN')}.%0APlease share availability and details.%0A%0AThank you!`;
    const url = `whatsapp://send?phone=${phone}&text=${msg}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('WhatsApp not installed', 'Please install WhatsApp to send your enquiry.');
    });
  };

  // Empty state
  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.empty}>
          <Ionicons name="heart-outline" size={80} color={VIOLET} />
          <Text style={styles.emptyTitle}>No saved items yet 💔</Text>
          <Text style={styles.emptySub}>Pieces you adore will live here — for your wedding, for someone special, for you.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Animated card component
  function WishCard({ item }: { item: WishItem }) {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const cardStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }], opacity: opacity.value }));

    const onRemove = () => {
      // Animate out then remove
      scale.value = withTiming(0.9, { duration: 120 });
      opacity.value = withTiming(0, { duration: 180 }, () => runOnJS(removeItem)(item.id));
    };

    const onPressEnquire = () => {
      scale.value = withSpring(0.97, { damping: 16, stiffness: 220 }, () => { scale.value = withSpring(1, { damping: 16, stiffness: 220 }); });
      enquireWhatsApp(item);
    };

    return (
      <Animated.View style={[styles.card, cardStyle]}>
        {/* Large product icon/image area */}
        <View style={styles.imageWrap}>
          <Ionicons name={item.icon as any} size={52} color={GOLD} />
        </View>

        {/* Product name */}
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>

        {/* Short descriptor */}
        <Text style={styles.desc} numberOfLines={1}>{item.weight}g • {item.purity} • ₹{item.price.toLocaleString('en-IN')}</Text>

        {/* Enquire on WhatsApp button */}
        <TouchableOpacity style={styles.whatsappBtn} activeOpacity={0.88} onPress={onPressEnquire}>
          <Ionicons name="logo-whatsapp" size={18} color="#F8F3ED" />
          <Text style={styles.whatsappText}>Enquire on WhatsApp</Text>
        </TouchableOpacity>

        {/* Remove (delete/heart) icon */}
        <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
          <Ionicons name="close-circle" size={22} color={MUTED} />
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Treasures</Text>
        <Text style={styles.count}>{items.length} saved with love</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => String(i.id)}
        numColumns={COL}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 8 }}
        renderItem={({ item }) => <WishCard item={item} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  header: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 8 },
  title: { color: '#F8F3ED', fontSize: 28, fontWeight: '900', letterSpacing: 1 },
  count: { color: GOLD, fontSize: 13, fontWeight: '700', marginTop: 4, letterSpacing: 1 },

  // 2-column card — cream, elegant minimal
  card: {
    width: CARD_W,
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 14,
    marginBottom: GAP + 6,
    borderWidth: 1,
    borderColor: '#D9C9B8',
  },
  imageWrap: {
    height: 100,
    borderRadius: 14,
    backgroundColor: '#F5EDE3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  name: { color: TEXT, fontSize: 15, fontWeight: '900', lineHeight: 19, letterSpacing: 0.2 },
  desc: { color: MUTED, fontSize: 12, marginTop: 6, letterSpacing: 0.3 },

  // WhatsApp button — elegant deep gold
  whatsappBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BTN,
    paddingVertical: 11,
    borderRadius: 14,
    marginTop: 14,
    gap: 8,
  },
  whatsappText: { color: '#F8F3ED', fontSize: 13, fontWeight: '800', letterSpacing: 1 },

  // Remove icon — top-right of card
  removeBtn: { position: 'absolute', top: 10, right: 10, padding: 4 },

  // Empty state — emotional
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  emptyTitle: { color: '#F8F3ED', fontSize: 22, fontWeight: '900', marginTop: 18, textAlign: 'center' },
  emptySub: { color: GOLD, fontSize: 14, textAlign: 'center', marginTop: 10, lineHeight: 21, letterSpacing: 0.3 },
});