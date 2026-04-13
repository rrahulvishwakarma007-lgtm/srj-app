import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GoldRate } from '../lib/types';
import { initialGoldRates } from '../lib/data';
import GoldCalculator from '../components/GoldCalculator';

export default function GoldRatesScreen() {
  const [rates, setRates] = useState<GoldRate[]>(initialGoldRates);
  const [refreshing, setRefreshing] = useState(false);

  const refreshRates = () => {
    setRefreshing(true);
    setTimeout(() => {
      const updated = rates.map(r => {
        const delta = (Math.random() - 0.48) * 120;
        const newPrice = Math.max(50, Math.round(r.price + delta));
        const change = ((newPrice - r.price) / r.price) * 100;
        return { ...r, price: newPrice, change: parseFloat(change.toFixed(1)) };
      });
      setRates(updated);
      setRefreshing(false);
    }, 700);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshRates} tintColor="#B8975E" />} contentContainerStyle={{ padding: 20, paddingBottom: 110 }}>
        <View style={styles.header}><Text style={styles.title}>Today's Rates</Text><TouchableOpacity style={styles.refreshBtn} onPress={refreshRates}><Ionicons name="refresh" size={18} color="#B8975E" /><Text style={styles.refreshText}>Update</Text></TouchableOpacity></View>
        {rates.map((rate, index) => (
          <View key={index} style={styles.rateCard}>
            <View style={styles.rateLeft}>
              <Text style={styles.rateType}>{rate.type}</Text>
              <Text style={styles.rateUnit}>{rate.unit}</Text>
            </View>
            <View style={styles.rateRight}>
              <Text style={styles.ratePrice}>₹{rate.price.toLocaleString('en-IN')}</Text>
              <View style={[styles.changeBadge, rate.change >= 0 ? styles.up : styles.down]}>
                <Ionicons name={rate.change >= 0 ? 'arrow-up' : 'arrow-down'} size={12} color={rate.change >= 0 ? '#2E7D32' : '#C62828'} />
                <Text style={[styles.changeText, { color: rate.change >= 0 ? '#2E7D32' : '#C62828' }]}>{Math.abs(rate.change)}%</Text>
              </View>
            </View>
          </View>
        ))}
        <GoldCalculator rates={rates} />
        <View style={styles.note}><Ionicons name="information-circle" size={16} color="#7A5C5C" /><Text style={styles.noteText}>Rates are indicative and update every 30 minutes. Final billing at counter.</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F3ED' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { color: '#3D2B2B', fontSize: 24, fontWeight: '800' },
  refreshBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFF8F0', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#D9C9B8' },
  refreshText: { color: '#B8975E', fontSize: 13, fontWeight: '600' },
  rateCard: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#FFF8F0', borderRadius: 16, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: '#D9C9B8' },
  rateLeft: {},
  rateType: { color: '#3D2B2B', fontSize: 18, fontWeight: '700' },
  rateUnit: { color: '#7A5C5C', fontSize: 12, marginTop: 2 },
  rateRight: { alignItems: 'flex-end' },
  ratePrice: { color: '#B8975E', fontSize: 22, fontWeight: '800' },
  changeBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, marginTop: 6, gap: 4 },
  up: { backgroundColor: '#E8F5E9' },
  down: { backgroundColor: '#FFEBEE' },
  changeText: { fontSize: 12, fontWeight: '700' },
  note: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#FFF8F0', padding: 14, borderRadius: 12, marginTop: 20, borderWidth: 1, borderColor: '#D9C9B8' },
  noteText: { color: '#7A5C5C', fontSize: 12, lineHeight: 18, flex: 1 },
});