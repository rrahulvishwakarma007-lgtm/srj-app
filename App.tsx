import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';

import { Theme } from './lib/theme';
import HomeScreen from './screens/HomeScreen';
import CatalogueScreen from './screens/CatalogueScreen';
import GoldRatesScreen from './screens/GoldRatesScreen';
import ContactScreen from './screens/ContactScreen';
import ProfileScreen from './screens/ProfileScreen';
import ScanScreen from './screens/ScanScreen';
import ProductModal from './components/ProductModal';
import { Product } from './lib/types';
import { loadWishlist, saveWishlist, loadCart, saveCart } from './lib/storage';

// ── Keep splash visible while app prepares ────────────────────────────────
// This must be called BEFORE any async work
try {
  SplashScreen.preventAutoHideAsync();
} catch {}

const Tab = createBottomTabNavigator();

const ICONS: Record<string, { active: any; inactive: any }> = {
  Home:      { active: 'home',        inactive: 'home-outline' },
  Catalogue: { active: 'grid',        inactive: 'grid-outline' },
  Scan:      { active: 'scan-circle', inactive: 'scan-circle-outline' },
  Gold:      { active: 'trending-up', inactive: 'trending-up-outline' },
  Contact:   { active: 'call',        inactive: 'call-outline' },
  Profile:   { active: 'person',      inactive: 'person-outline' },
};

function AppTabs({
  openProduct, wishlist, cart,
  selectedProduct, closeProduct, toggleWishlist, addToCart,
}: any) {
  const insets      = useSafeAreaInsets();
  const bottomInset = insets.bottom ?? 0;

  return (
    <View style={{ flex: 1, backgroundColor: Theme.bgPurpleDark }}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor:   Theme.gold,
            tabBarInactiveTintColor: '#A08CC0',
            tabBarStyle: {
              backgroundColor: '#FFFFFF',
              height:          60 + bottomInset,
              paddingBottom:   bottomInset,
              paddingTop:      5,
            },
            tabBarIcon: ({ color, focused }) => {
              const ic = ICONS[route.name];
              return <Ionicons name={focused ? ic.active : ic.inactive} size={22} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Home">
            {() => <HomeScreen onOpenProduct={openProduct} wishlist={wishlist} />}
          </Tab.Screen>
          <Tab.Screen name="Catalogue" component={CatalogueScreen} />
          <Tab.Screen name="Scan"      component={ScanScreen} />
          <Tab.Screen name="Gold"      component={GoldRatesScreen} />
          <Tab.Screen name="Contact"   component={ContactScreen} />
          <Tab.Screen name="Profile"   component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>

      <ProductModal
        visible={!!selectedProduct}
        product={selectedProduct}
        onClose={closeProduct}
        onAddToWishlist={toggleWishlist}
        onAddToCart={addToCart}
        isWishlisted={
          selectedProduct
            ? wishlist.some((w: Product) => w.id === selectedProduct.id)
            : false
        }
      />
    </View>
  );
}

export default function App() {
  const [appReady, setAppReady]             = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist]             = useState<Product[]>([]);
  const [cart, setCart]                     = useState<any[]>([]);

  // ── Prepare app — load storage, then ALWAYS hide splash ──────────────
  useEffect(() => {
    async function prepare() {
      try {
        // Load persisted wishlist & cart
        const [savedWishlist, savedCart] = await Promise.all([
          loadWishlist(),
          loadCart(),
        ]);
        setWishlist(savedWishlist);
        setCart(savedCart);
      } catch (e) {
        // Non-fatal — app still works without saved data
        console.warn('Storage load error:', e);
      } finally {
        // ✅ ALWAYS mark ready and hide splash — no matter what happens above
        setAppReady(true);
      }
    }
    prepare();
  }, []);

  // ── Hide splash ONLY when app is ready ───────────────────────────────
  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      try {
        await SplashScreen.hideAsync();
      } catch {}
    }
  }, [appReady]);

  // ── Persist changes ───────────────────────────────────────────────────
  useEffect(() => { saveWishlist(wishlist); }, [wishlist]);
  useEffect(() => { saveCart(cart); },       [cart]);

  // ── Don't render anything until app is ready ─────────────────────────
  if (!appReady) return null;

  const toggleWishlist = () => {
    if (!selectedProduct) return;
    const exists = wishlist.some(w => w.id === selectedProduct.id);
    setWishlist(exists
      ? wishlist.filter(w => w.id !== selectedProduct.id)
      : [...wishlist, selectedProduct]
    );
  };

  const addToCart = () => {
    if (!selectedProduct) return;
    const i = cart.findIndex(c => c.id === selectedProduct.id);
    let nc: any[];
    if (i >= 0) { nc = [...cart]; nc[i].quantity += 1; }
    else nc = [...cart, { ...selectedProduct, quantity: 1 }];
    setCart(nc);
    setSelectedProduct(null);
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={Theme.bgPurpleDark} />

      {/* onLayout fires when root view renders — triggers splash hide */}
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <AppTabs
          openProduct={(p: Product) => setSelectedProduct(p)}
          wishlist={wishlist}
          cart={cart}
          selectedProduct={selectedProduct}
          closeProduct={() => setSelectedProduct(null)}
          toggleWishlist={toggleWishlist}
          addToCart={addToCart}
        />
      </View>
    </SafeAreaProvider>
  );
}
