import React, { useState, useEffect } from 'react';
import { StatusBar, View, Platform } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
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

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

const Tab = createBottomTabNavigator();

const ICONS: Record<string, { active: any; inactive: any }> = {
  Home:      { active: 'home', inactive: 'home-outline' },
  Catalogue: { active: 'grid', inactive: 'grid-outline' },
  Scan:      { active: 'scan-circle', inactive: 'scan-circle-outline' },
  Gold:      { active: 'trending-up', inactive: 'trending-up-outline' },
  Contact:   { active: 'call', inactive: 'call-outline' },
  Profile:   { active: 'person', inactive: 'person-outline' },
};

function AppTabs({
  openProduct,
  wishlist,
  cart,
  selectedProduct,
  closeProduct,
  toggleWishlist,
  addToCart
}: any) {
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom ?? 0;

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
              height: 60 + bottomInset,
              paddingBottom: bottomInset,
              paddingTop: 5,
            },
            tabBarIcon: ({ color, focused }) => {
              const ic = ICONS[route.name];
              return (
                <Ionicons
                  name={focused ? ic.active : ic.inactive}
                  size={22}
                  color={color}
                />
              );
            },
          })}
        >
          <Tab.Screen name="Home">
            {() => <HomeScreen onOpenProduct={openProduct} wishlist={wishlist} />}
          </Tab.Screen>

          <Tab.Screen name="Catalogue" component={CatalogueScreen} />
          <Tab.Screen name="Scan" component={ScanScreen} />
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
  console.log("APP STARTED");

  const [user, setUser] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cart, setCart] = useState<any[]>([]);

  // Load storage
  useEffect(() => {
    (async () => {
      setWishlist(await loadWishlist());
      setCart(await loadCart());
    })();
  }, []);

  useEffect(() => { saveWishlist(wishlist); }, [wishlist]);
  useEffect(() => { saveCart(cart); }, [cart]);

  // Firebase auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return unsubscribe;
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Theme.bgPurpleDark}
      />

      <AppTabs
        openProduct={(p: Product) => setSelectedProduct(p)}
        wishlist={wishlist}
        cart={cart}
        selectedProduct={selectedProduct}
        closeProduct={() => setSelectedProduct(null)}

        toggleWishlist={() => {
          if (!selectedProduct) return;
          const exists = wishlist.some(w => w.id === selectedProduct.id);

          setWishlist(
            exists
              ? wishlist.filter(w => w.id !== selectedProduct.id)
              : [...wishlist, selectedProduct]
          );
        }}

        addToCart={() => {
          if (!selectedProduct) return;

          const i = cart.findIndex(c => c.id === selectedProduct.id);
          let nc;

          if (i >= 0) {
            nc = [...cart];
            nc[i].quantity += 1;
          } else {
            nc = [...cart, { ...selectedProduct, quantity: 1 }];
          }

          setCart(nc);
          setSelectedProduct(null);
        }}
      />
    </SafeAreaProvider>
  );
}