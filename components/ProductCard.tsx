import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
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
  const [imgErr, setImgErr] = useState(false);
  const scale = useSharedValue(1);
  const cardStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const pressIn = () => { scale.value = withSpring(0.95, { damping: 16, stiffness: 220 }); };
  const pressOut = () => { scale.value = withSpring(1, { damping: 16, stiffness: 240 }); };
  const pressCart = () => { onAddToCart(); };
  const pressHeart = () => { onAddToWishlist(); };

  return (
    <Animated.View style={[styles.wrap, cardStyle]}>
      <TouchableOpacity activeOpacity={1} onPressIn={pressIn} onPressOut={pressOut} onPress={onPress}>
        <View style={styles.card}>
          <View style={styles.imgBox}>
            {product.image && !imgErr ? (
              <Image source={{ uri: product.image }} style={styles.img} contentFit="cover" onError={() => setImgErr(true)} />
            ) : (
              <View style={[styles.fallback, { backgroundColor: product.color + '18' }]}><Ionicons name={product.icon as any} size={42} color={product.color} /></View>
            )}
          </View>
          <View style={styles.content}>
            <Text style={styles.category}>{product.category}</Text>
            <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
            <Text style={styles.desc} numberOfLines={1}>{product.description}</Text>
            <View style={styles.meta}><Text style={styles.weight}>{product.weight}g • {product.purity}</Text></View>
            <Text style={styles.price}>₹{product.price.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.act} activeOpacity={0.88} onPress={pressHeart}><Ionicons name={isWishlisted ? 'heart' : 'heart-outline'} size={18} color={isWishlisted ? '#8F5155' : '#8C5C2D'} /></TouchableOpacity>
            <TouchableOpacity style={[styles.act, styles.cart]} activeOpacity={0.88} onPress={pressCart}><Ionicons name="cart" size={18} color="#F8F3ED" /></TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '47%', margin: 6 },
  card: { backgroundColor: '#FFF8F0', borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: '#D9C9B8' },
  imgBox: { height: 110, backgroundColor: '#F8F3ED' },
  img: { width: '100%', height: '100%' },
  fallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 12 },
  category: { fontSize: 10, color: '#7A4B6A', fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase' },
  name: { fontSize: 14, color: '#1F1414', fontWeight: '900', marginTop: 4, lineHeight: 18 },
  desc: { fontSize: 11, color: '#4F3636', marginTop: 2 },
  meta: { marginTop: 6 },
  weight: { fontSize: 11, color: '#8C5C2D', fontWeight: '600' },
  price: { fontSize: 17, color: '#8C5C2D', fontWeight: '900', marginTop: 8 },
  actions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#D9C9B8' },
  act: { flex: 1, paddingVertical: 11, alignItems: 'center', justifyContent: 'center' },
  cart: { backgroundColor: '#7A4B6A' },
});