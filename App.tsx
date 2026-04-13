import React, { useState } from 'react';
import { StatusBar, SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeScreen from './screens/HomeScreen';
import GoldRatesScreen from './screens/GoldRatesScreen';
import CatalogueScreen from './screens/CatalogueScreen';
import WishlistScreen from './screens/WishlistScreen';
import ContactScreen from './screens/ContactScreen';
import IntroScreen from './screens/IntroScreen';
import ProductModal from './components/ProductModal';
import { Product } from './lib/types';
import { products } from './lib/data';
import { loadWishlist, saveWishlist, loadCart, saveCart } from './lib/storage';

const Tab = createBottomTabNavigator();

function TabBarIcon({ name, color, size }: { name: string; color: string; size: number }) {
  return <Ionicons name={name as any} size={size} color={color} />;
}

export default function App() {
  const [fontsLoaded] = useFonts({ ...Ionicons.font });
  const [showIntro, setShowIntro] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cart, setCart] = useState<any[]>([]);

  React.useEffect(() => {
    (async () => {
      setWishlist(await loadWishlist());
      setCart(await loadCart());
    })();
  }, []);

  const updateWishlist = async (newW: Product[]) => {
    setWishlist(newW);
    await saveWishlist(newW);
  };

  const updateCart = async (newC: any[]) => {
    setCart(newC);
    await saveCart(newC);
  };

  const openProduct = (p: Product) => {
    setSelectedProduct(p);
    setIsWishlisted(wishlist.some(w => w.id === p.id));
  };

  const closeProduct = () => setSelectedProduct(null);

  const toggleWishlist = () => {
    if (!selectedProduct) return;
    const exists = wishlist.some(w => w.id === selectedProduct.id);
    const newW = exists ? wishlist.filter(w => w.id !== selectedProduct.id) : [...wishlist, selectedProduct];
    updateWishlist(newW);
    setIsWishlisted(!exists);
  };

  const addToCart = () => {
    if (!selectedProduct) return;
    const existing = cart.findIndex(c => c.id === selectedProduct.id);
    let newCart: any[];
    if (existing >= 0) { newCart = [...cart]; newCart[existing].quantity += 1; }
    else newCart = [...cart, { ...selectedProduct, quantity: 1 }];
    updateCart(newCart);
    closeProduct();
  };

  if (!fontsLoaded) return null;

  if (showIntro) {
    return (
      <View style={{ flex: 1, backgroundColor: '#2A1B4D' }}>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '65%', backgroundColor: '#4B2E83' }} />
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '38%', backgroundColor: 'rgba(194,24,91,0.06)' }} />
        <IntroScreen onFinish={() => setShowIntro(false)} />
        <StatusBar style="dark" backgroundColor="#2A1B4D" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#2A1B4D' }}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '65%', backgroundColor: '#4B2E83' }} />
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '38%', backgroundColor: 'rgba(194,24,91,0.06)' }} />
      <SafeAreaView style={styles.root}>
        <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: '#D4AF37',
            tabBarInactiveTintColor: '#CBB7E5',
            tabBarStyle: { backgroundColor: '#2A1B4D', borderTopColor: '#3C2A5F', height: 64, paddingBottom: 6 },
            tabBarIcon: ({ color, size }) => {
              let icon = 'home';
              if (route.name === 'Home') icon = 'home';
              if (route.name === 'Gold Rates') icon = 'trending-up';
              if (route.name === 'Catalogue') icon = 'grid';
              if (route.name === 'Wishlist') icon = 'heart';
              if (route.name === 'Contact') icon = 'call';
              return <TabBarIcon name={icon} color={color} size={size} />;
            },
          })}
        >
          <Tab.Screen name="Home">
            {() => <HomeScreen onOpenProduct={openProduct} />}
          </Tab.Screen>
          <Tab.Screen name="Gold Rates" component={GoldRatesScreen} />
          <Tab.Screen name="Catalogue" component={CatalogueScreen} />
          <Tab.Screen name="Wishlist" component={WishlistScreen} />
          <Tab.Screen name="Contact" component={ContactScreen} />
        </Tab.Navigator>
      </NavigationContainer>
      <ProductModal
        visible={!!selectedProduct}
        product={selectedProduct}
        onClose={closeProduct}
        onAddToWishlist={toggleWishlist}
        onAddToCart={addToCart}
        isWishlisted={isWishlisted}
      />
      <StatusBar style="dark" backgroundColor="#2A1B4D" />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#2A1B4D' },
});
