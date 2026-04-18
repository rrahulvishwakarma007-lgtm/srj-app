import React, { useState } from 'react';
import { StatusBar, View, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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
import ProductModal from './components/ProductModal';
import { Product } from './lib/types';
import { loadWishlist, saveWishlist, loadCart, saveCart } from './lib/storage';

const Tab = createBottomTabNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({ ...Ionicons.font });
  const [showIntro, setShowIntro] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cart, setCart] = useState<any[]>([]);

  React.useEffect(() => {
    (async () => { setWishlist(await loadWishlist()); setCart(await loadCart()); })();
  }, []);
  React.useEffect(() => { saveWishlist(wishlist); }, [wishlist]);
  React.useEffect(() => { saveCart(cart); }, [cart]);

  const openProduct = (p: Product) => setSelectedProduct(p);
  const closeProduct = () => setSelectedProduct(null);
  const toggleWishlist = () => {
    if (!selectedProduct) return;
    const exists = wishlist.some(w => w.id === selectedProduct.id);
    setWishlist(exists ? wishlist.filter(w => w.id !== selectedProduct.id) : [...wishlist, selectedProduct]);
  };
  const addToCart = () => {
    if (!selectedProduct) return;
    const i = cart.findIndex(c => c.id === selectedProduct.id);
    let nc: any[];
    if (i >= 0) { nc = [...cart]; nc[i].quantity += 1; } else nc = [...cart, { ...selectedProduct, quantity: 1 }];
    setCart(nc); closeProduct();
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={Theme.bgPurpleDark} translucent={false} />
      {showIntro ? (
        <IntroScreen onFinish={() => setShowIntro(false)} />
      ) : (
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
                  height: Platform.OS === 'android' ? 62 : 82,
                  paddingBottom: Platform.OS === 'android' ? 8 : 22,
                  paddingTop: 8,
                  elevation: 20,
                  shadowColor: Theme.shadowDark,
                  shadowOpacity: 0.25,
                  shadowRadius: 12,
                },
                tabBarLabelStyle: {
                  fontSize: 10,
                  fontWeight: '700',
                  letterSpacing: 0.3,
                  marginTop: 2,
                },
                tabBarIcon: ({ color, focused }) => {
                  const icons: Record<string, { active: any; inactive: any }> = {
                    Home:      { active: 'home',        inactive: 'home-outline' },
                    Catalogue: { active: 'grid',        inactive: 'grid-outline' },
                    Gold:      { active: 'trending-up', inactive: 'trending-up-outline' },
                    Contact:   { active: 'call',        inactive: 'call-outline' },
                    Profile:   { active: 'person',      inactive: 'person-outline' },
                  };
                  const ic = icons[route.name] || { active: 'ellipse', inactive: 'ellipse-outline' };
                  return <Ionicons name={focused ? ic.active : ic.inactive} size={22} color={color} />;
                },
              })}
            >
              <Tab.Screen name="Home">{() => <HomeScreen onOpenProduct={openProduct} wishlist={wishlist} />}</Tab.Screen>
              <Tab.Screen name="Catalogue" component={CatalogueScreen} />
              <Tab.Screen name="Gold" component={GoldRatesScreen} />
              <Tab.Screen name="Contact" component={ContactScreen} />
              <Tab.Screen name="Profile" component={ProfileScreen} />
            </Tab.Navigator>
          </NavigationContainer>
          <ProductModal visible={!!selectedProduct} product={selectedProduct} onClose={closeProduct} onAddToWishlist={toggleWishlist} onAddToCart={addToCart} isWishlisted={selectedProduct ? wishlist.some(w => w.id === selectedProduct.id) : false} />
        </View>
      )}
    </SafeAreaProvider>
  );
}
