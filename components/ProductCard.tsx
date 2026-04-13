import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Product } from '../lib/types';

interface Props {
  product: Product;
  onPress: () => void;
  onAddToWishlist: () => void;
  onAddToCart: () => void;
  isWishlisted: boolean;
}

export default function ProductCard({ product, onPress, onAddToWishlist, onAddToCart, isWishlisted }: Props) {
  const scale = useSharedValue(1);
  const cardStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const pressIn = () => { scale.value = withSpring(0.97, { damping: 18, stiffness: 260 }); };
  const pressOut = () => { scale.value = withSpring(1, { damping: 16, stiffness: 240 }); };

  const pressCart = () => { onAddToCart(); };
  const pressHeart = () => { onAddToWishlist(); };

  return (
    <Animated.View style={[styles.wrap, cardStyle]}>
      <TouchableOpacity activeOpacity={1} onPressIn={pressIn} onPressOut={pressOut} onPress={onPress}>
        <View style={styles.card}>
          <View style={[styles.iconBox, { backgroundColor: '#D4AF37' + '15' }]}><Ionicons name={product.icon as any} size={40} color="#D4AF37" /></View>
          <View style={styles.content}>
            <Text style={styles.cat}>{product.category}</Text>
            <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
            <Text style={styles.desc} numberOfLines={1}>{product.description}</Text>
            <Text style={styles.meta}>{product.weight}g • {product.purity}</Text>
            <Text style={styles.price}>₹{product.price.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.act} onPress={pressHeart} activeOpacity={0.88}><Ionicons name={isWishlisted ? 'heart' : 'heart-outline'} size={18} color="#D4AF37" /></TouchableOpacity>
            <TouchableOpacity style={[styles.act, styles.cart]} onPress={pressCart} activeOpacity={0.88}><Ionicons name="cart" size={18} color="#1A1A1A" /><Text style={styles.cartTxt}>Add</Text></TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '47%', margin: 7 },
  card: { backgroundColor: '#F8F3ED', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#E6D9C9', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  iconBox: { height: 92, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 14 },
  cat: { color: '#D4AF37', fontSize: 10, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase' },
  name: { color: '#1A1A1A', fontSize: 15, fontWeight: '900', marginTop: 6, lineHeight: 19, letterSpacing: 0.2 },
  desc: { color: '#4F3636', fontSize: 11, marginTop: 3 },
  meta: { color: '#D4AF37', fontSize: 11, fontWeight: '600', marginTop: 6 },
  price: { color: '#D4AF37', fontSize: 18, fontWeight: '900', marginTop: 9, letterSpacing: 0.3 },
  actions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#E6D9C9' },
  act: { flex: 1, paddingVertical: 13, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  cart: { backgroundColor: '#D4AF37' },
  cartTxt: { color: '#1A1A1A', fontSize: 13, fontWeight: '800', letterSpacing: 0.5 },
});