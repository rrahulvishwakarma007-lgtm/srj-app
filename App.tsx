import React, { useState } from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from './lib/theme';
import IntroScreen from './screens/IntroScreen';
import HomeScreen from './screens/HomeScreen';
import ExploreScreen from './screens/ExploreScreen';
import ReelsScreen from './screens/ReelsScreen';
import SavedDesignsScreen from './screens/SavedDesignsScreen';
import ProfileScreen from './screens/ProfileScreen';
import ProductModal from './components/ProductModal';
import { Product } from './lib/types';
import { products } from './lib/data';
import { loadWishlist, saveWishlist, loadCart, saveCart } from './lib/storage';

const Tab = createBottomTabNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({ ...Ionicons.font });
  const [showIntro, setShowIntro] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cart, setCart] = useState<any[]>([]);

  React.useEffect(() => { (async () => { setWishlist(await loadWishlist()); setCart(await loadCart()); })(); }, []);
  React.useEffect(() => { saveWishlist(wishlist); }, [wishlist]);
  React.useEffect(() => { saveCart(cart); }, [cart]);

  const openProduct = (p: Product) => setSelectedProduct(p);
  const closeProduct = () => setSelectedProduct(null);
  const toggleWishlist = () => { if (!selectedProduct) return; const exists = wishlist.some(w => w.id === selectedProduct.id); setWishlist(exists ? wishlist.filter(w => w.id !== selectedProduct.id) : [...wishlist, selectedProduct]); };
  const addToCart = () => { if (!selectedProduct) return; const i = cart.findIndex(c => c.id === selectedProduct.id); let nc: any[]; if (i >= 0) { nc = [...cart]; nc[i].quantity += 1; } else nc = [...cart, { ...selectedProduct, quantity: 1 }]; setCart(nc); closeProduct(); };

  if (!fontsLoaded) return null;

  if (showIntro) {
    return <View style={{ flex: 1, backgroundColor: Theme.bgPrimary }}><IntroScreen onFinish={() => setShowIntro(false)} /><StatusBar barStyle="light-content" backgroundColor={Theme.bgPrimary} /></View>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: Theme.bgPrimary }}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: Theme.gold,
            tabBarInactiveTintColor: Theme.textOnDarkMuted,
            tabBarStyle: { backgroundColor: Theme.bgSecondary, borderTopColor: '#3A2A5F', height: 64, paddingBottom: 6 },
            tabBarIcon: ({ color, size }) => {
              const map: any = { Home: 'home', Explore: 'grid', Reels: 'play-circle', Saved: 'bookmark', Profile: 'person' };
              return <Ionicons name={map[route.name] || 'ellipse'} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Home">{() => <HomeScreen onOpenProduct={openProduct} />}</Tab.Screen>
          <Tab.Screen name="Explore">{() => <ExploreScreen onOpenProduct={openProduct} wishlist={wishlist} onToggleWishlist={(p) => { const exists = wishlist.some(w => w.id === p.id); setWishlist(exists ? wishlist.filter(w => w.id !== p.id) : [...wishlist, p]); }} />}</Tab.Screen>
          <Tab.Screen name="Reels" component={ReelsScreen} />
          <Tab.Screen name="Saved">{() => <SavedDesignsScreen wishlist={wishlist} onOpenProduct={openProduct} onToggleWishlist={(p) => { const exists = wishlist.some(w => w.id === p.id); setWishlist(exists ? wishlist.filter(w => w.id !== p.id) : [...wishlist, p]); }} />}</Tab.Screen>
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
      <ProductModal visible={!!selectedProduct} product={selectedProduct} onClose={closeProduct} onAddToWishlist={toggleWishlist} onAddToCart={addToCart} isWishlisted={selectedProduct ? wishlist.some(w => w.id === selectedProduct.id) : false} />
      <StatusBar barStyle="light-content" backgroundColor={Theme.bgSecondary} />
    </View>
  );
}