import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme, Card, Button } from '../lib/theme';
import { products, initialGoldRates } from '../lib/data';
import { Product } from '../lib/types';

interface Props { onOpenProduct: (p: Product) => void; }

const OCCASIONS = ['Wedding', 'Festive', 'Daily Wear', 'Gifting'];

export default function HomeScreen({ onOpenProduct }: Props) {
  const trending = products.slice(0, 4);
  const featured = products.slice(4, 8);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>
        {/* HERO BANNER */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}><Ionicons name="diamond" size={54} color={Theme.gold} /></View>
          <Text style={styles.heroTitle}>Shekhar Raja</Text>
          <Text style={styles.heroTag}>EST. 1975 • JEWELLERS</Text>
          <Text style={styles.heroSub}>Timeless craftsmanship in 22K gold</Text>
        </View>

        {/* TRENDING IN YOUR CITY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending in Your City</Text>
          <FlatList horizontal data={trending} keyExtractor={i => String(i.id)} contentContainerStyle={{ paddingHorizontal: 16 }} renderItem={({ item }) => (
            <TouchableOpacity style={styles.trendCard} activeOpacity={0.92} onPress={() => onOpenProduct(item)}>
              <View style={[styles.trendImg, { backgroundColor: Theme.gold + '22' }]}><Ionicons name={item.icon as any} size={40} color={Theme.gold} /></View>
              <Text style={styles.trendName}>{item.name}</Text>
            </TouchableOpacity>
          )} />
        </View>

        {/* LIVE GOLD INSIGHTS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Live Gold Insights</Text>
          <View style={styles.goldCard}>
            {initialGoldRates.slice(0, 3).map((r, i) => (
              <View key={i} style={styles.goldRow}><Text style={styles.goldType}>{r.type}</Text><Text style={styles.goldPrice}>₹{r.price.toLocaleString('en-IN')} {r.unit}</Text></View>
            ))}
            <Text style={styles.goldNote}>Rates update every 30 minutes</Text>
          </View>
        </View>

        {/* SHOP BY OCCASION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Occasion</Text>
          <View style={styles.occRow}>
            {OCCASIONS.map(o => (
              <TouchableOpacity key={o} style={styles.occChip}><Text style={styles.occText}>{o}</Text></TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FEATURED COLLECTIONS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Collections</Text>
          <FlatList horizontal data={featured} keyExtractor={i => String(i.id)} contentContainerStyle={{ paddingHorizontal: 16 }} renderItem={({ item }) => (
            <TouchableOpacity style={styles.featCard} onPress={() => onOpenProduct(item)}>
              <View style={[styles.featImg, { backgroundColor: Theme.gold + '20' }]}><Ionicons name={item.icon as any} size={36} color={Theme.gold} /></View>
              <Text style={styles.featName}>{item.name}</Text>
            </TouchableOpacity>
          )} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.bgPrimary },
  hero: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24, backgroundColor: Theme.bgSecondary, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  heroIcon: { width: 92, height: 92, borderRadius: 46, backgroundColor: Theme.bgCard + '22', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  heroTitle: { ...Theme.serifHeavy, color: Theme.gold, fontSize: 32, letterSpacing: 4 },
  heroTag: { color: Theme.textOnDarkMuted, fontSize: 12, letterSpacing: 3, marginTop: 4 },
  heroSub: { color: Theme.textOnDark, fontSize: 14, marginTop: 10, textAlign: 'center' },
  section: { marginTop: 28, paddingHorizontal: 20 },
  sectionTitle: { ...Theme.serif, color: Theme.textOnDark, fontSize: 20, letterSpacing: 1, marginBottom: 14 },
  trendCard: { width: 140, marginRight: 12, backgroundColor: Theme.bgCard, borderRadius: Card.borderRadius, padding: 12, borderWidth: Card.borderWidth, borderColor: Card.borderColor },
  trendImg: { height: 92, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  trendName: { ...Theme.sansBold, color: Theme.textOnCream, fontSize: 13, lineHeight: 17 },
  goldCard: { backgroundColor: Theme.bgCard, borderRadius: Card.borderRadius, padding: 18, borderWidth: Card.borderWidth, borderColor: Card.borderColor },
  goldRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  goldType: { ...Theme.sansBold, color: Theme.textOnCream, fontSize: 15 },
  goldPrice: { color: Theme.gold, fontSize: 15, fontWeight: '700' },
  goldNote: { color: Theme.textOnCreamMuted, fontSize: 11, marginTop: 8 },
  occRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  occChip: { backgroundColor: Theme.bgCard, paddingVertical: 10, paddingHorizontal: 18, borderRadius: 22, borderWidth: 1, borderColor: Theme.gold + '66' },
  occText: { color: Theme.textOnCream, fontSize: 13, fontWeight: '600' },
  featCard: { width: 150, marginRight: 12, backgroundColor: Theme.bgCard, borderRadius: Card.borderRadius, padding: 14, borderWidth: Card.borderWidth, borderColor: Card.borderColor },
  featImg: { height: 84, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  featName: { ...Theme.sansBold, color: Theme.textOnCream, fontSize: 13, lineHeight: 17 },
});