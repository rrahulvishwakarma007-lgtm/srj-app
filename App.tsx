import React, { useState, useEffect } from 'react';
import { StatusBar, View, Platform } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from './lib/theme';
import IntroScreen from './screens/IntroScreen';
import HomeScreen from './screens/HomeScreen';
import CatalogueScreen from './screens/CatalogueScreen';
import GoldRatesScreen from './screens/GoldRatesScreen';
import ContactScreen from './screens/ContactScreen';
import ProfileScreen from './screens/ProfileScreen';
import ScanScreen from './screens/ScanScreen';
import ProductModal from './components/ProductModal';
import { Product } from './lib/types';
import { loadWishlist, saveWishlist, loadCart, saveCart } from './lib/storage';
import ReelsScreen from './screens/ReelsScreen';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

const Tab = createBottomTabNavigator();

const ICONS: Record<string, { active: any; inactive: any }> = {
  Home:      { active: 'home',             inactive: 'home-outline'          },
  Catalogue: { active: 'grid',             inactive: 'grid-outline'          },
  Scan:      { active: 'scan-circle',      inactive: 'scan-circle-outline'   },
  Gold:      { active: 'trending-up',      inactive: 'trending-up-outline'   },
  Contact:   { active: 'call',             inactive: 'call-outline'          },
  Profile:   { active: 'person',           inactive: 'person-outline'        },
  Reels:     { active: 'play-circle',      inactive: 'play-circle-outline'   },
};

function AppTabs({ openProduct, wishlist, cart, setWishlist, setCart, selectedProduct, closeProduct, toggleWishlist, addToCart }: any) {
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom ?? 0;
  const tabBarHeight = Platform.OS === 'android' ? 56 + bottomInset : 60 + bottomInset;

  return (
    <View style={{ flex: 1, backgroundColor: Theme.bgPurpleDark }}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: Theme.gold,
            tabBarInactiveTintColor: '#A08CC0',
            tabBarStyle: {
              backgroundColor: '#FFFFFF',
              borderTopColor: Theme.border,
              borderTopWidth: 1,
              height: tabBarHeight,
              paddingBottom: bottomInset > 0 ? bottomInset : Platform.OS === 'android' ? 5 : 8,
              paddingTop: 5,
              elevation: 20,
              shadowColor: Theme.shadowDark,
              shadowOpacity: 0.25,
              shadowRadius: 12,
            },
            tabBarLabelStyle: {
              fontSize: 9,
              fontWeight: '700',
              letterSpacing: 0.2,
              marginTop: 1,
            },
            tabBarIcon: ({ color, focused }) => {
              const ic = ICONS[route.name] || { active: 'ellipse', inactive: 'ellipse-outline' };

              if (route.name === 'Reels') {
                return (
                  <View style={{
                    width: 38, height: 38, borderRadius: 19,
                    backgroundColor: focused ? '#FF0050' : '#EDE8F5',
                    alignItems: 'center', justifyContent: 'center', marginTop: -6,
                  }}>
                    <Ionicons name={focused ? ic.active : ic.inactive} size={22} color={focused ? '#fff' : '#9B6ED4'} />
                  </View>
                );
              }

              if (route.name === 'Scan') {
                return (
                  <View style={{
                    width: 38, height: 38, borderRadius: 19,
                    backgroundColor: focused ? Theme.gold : '#EDE8F5',
                    alignItems: 'center', justifyContent: 'center', marginTop: -6,
                    shadowColor: Theme.gold, shadowOpacity: focused ? 0.5 : 0,
                    shadowRadius: 6, elevation: focused ? 4 : 0,
                  }}>
                    <Ionicons name={focused ? ic.active : ic.inactive} size={22} color={focused ? '#2D1B5E' : '#9B6ED4'} />
                  </View>
                );
              }

              return <Ionicons name={focused ? ic.active : ic.inactive} size={21} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Home">
            {() => <HomeScreen onOpenProduct={openProduct} wishlist={wishlist} />}
          </Tab.Screen>
          <Tab.Screen name="Catalogue" component={CatalogueScreen} />
          <Tab.Screen name="Scan" component={ScanScreen} options={{ tabBarLabel: 'Scan' }} />
          <Tab.Screen name="Reels" component={ReelsScreen} />
          <Tab.Screen name="Gold" component={GoldRatesScreen} />
          <Tab.Screen name="Contact" component={ContactScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
      <ProductModal
        visible={!!selectedProduct}
        product={selectedProduct}
        onClose={closeProduct}
        onAddToWishlist={toggleWishlist}
        onAddToCart={addToCart}
        isWishlisted={selectedProduct ? wishlist.some((w: Product) => w.id === selectedProduct.id) : false}
      />
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({ ...Ionicons.font });

  // ── FIX 1: Don't block forever if fonts fail to load on device ──
  // If fontsLoaded stays false after 4s (network issue, APK asset issue),
  // we proceed anyway rather than staying stuck on splash forever.
  const [fontTimeout, setFontTimeout] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setFontTimeout(true), 4000);
    return () => clearTimeout(t);
  }, []);

  const [showIntro, setShowIntro] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      setWishlist(await loadWishlist());
      setCart(await loadCart());
    })();
  }, []);

  useEffect(() => { saveWishlist(wishlist); }, [wishlist]);
  useEffect(() => { saveCart(cart); }, [cart]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return unsubscribe;
  }, []);

  // ── FIX 2: Safety net — if IntroScreen's onFinish somehow never fires,
  // force-dismiss intro after 6 seconds so app never stays stuck ──
  useEffect(() => {
    if (!showIntro) return;
    const t = setTimeout(() => {
      console.warn('[SRJ] IntroScreen safety timeout fired — forcing navigation forward');
      setShowIntro(false);
    }, 6000);
    return () => clearTimeout(t);
  }, [showIntro]);

  // ── FIX 1 applied here: proceed if fonts loaded OR timeout hit ──
  if (!fontsLoaded && !fontTimeout) return null;

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={Theme.bgPurpleDark} translucent={false} />
      {showIntro ? (
        <IntroScreen onFinish={() => setShowIntro(false)} />
      ) : (
        <AppTabs
          openProduct={(p: Product) => setSelectedProduct(p)}
          wishlist={wishlist}
          cart={cart}
          setWishlist={setWishlist}
          setCart={setCart}
          selectedProduct={selectedProduct}
          closeProduct={() => setSelectedProduct(null)}
          toggleWishlist={() => {
            if (!selectedProduct) return;
            const exists = wishlist.some(w => w.id === selectedProduct.id);
            setWishlist(exists
              ? wishlist.filter(w => w.id !== selectedProduct.id)
              : [...wishlist, selectedProduct]
            );
          }}
          addToCart={() => {
            if (!selectedProduct) return;
            const i = cart.findIndex(c => c.id === selectedProduct.id);
            let nc: any[];
            if (i >= 0) { nc = [...cart]; nc[i].quantity += 1; }
            else nc = [...cart, { ...selectedProduct, quantity: 1 }];
            setCart(nc);
            setSelectedProduct(null);
          }}
        />
      )}
    </SafeAreaProvider>
  );
}
