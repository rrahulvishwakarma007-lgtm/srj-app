import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

interface GoldRate { type: string; price: number; unit: string; }

interface Props {
  rates: GoldRate[];
}

export default function GoldCalculator({ rates }: Props) {
  const [weight, setWeight] = useState('10');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selected = rates[selectedIndex];
  const numWeight = parseFloat(weight) || 0;
  const perGram = selected.price / 10;
  const total = Math.round(perGram * numWeight);

  const resultScale = useSharedValue(1);
  const resultStyle = useAnimatedStyle(() => ({ transform: [{ scale: resultScale.value }] }));

  useEffect(() => {
    resultScale.value = withSpring(1.06, { damping: 12, stiffness: 180 });
    setTimeout(() => { resultScale.value = withSpring(1, { damping: 14, stiffness: 200 }); }, 90);
  }, [total]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Price Calculator</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Metal Type</Text>
        <View style={styles.pickerWrap}>
          {rates.map((r, i) => (
            <TouchableOpacity key={i} style={[styles.pill, i === selectedIndex && styles.pillActive]} onPress={() => setSelectedIndex(i)}>
              <Text style={[styles.pillText, i === selectedIndex && styles.pillTextActive]}>{r.type}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Weight (grams)</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={weight} onChangeText={setWeight} placeholder="10" placeholderTextColor="#7A5C5C" />
      </View>
      <View style={styles.result}>
        <Text style={styles.resultLabel}>Estimated Price</Text>
        <Animated.Text style={[styles.resultValue, resultStyle]}>₹{total.toLocaleString('en-IN')}</Animated.Text>
        <Text style={styles.resultNote}>Based on {selected.price.toLocaleString('en-IN')} {selected.unit}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#FFF8F0', borderRadius: 18, padding: 18, marginTop: 16, borderWidth: 1, borderColor: '#D9C9B8' },
  title: { color: '#3D2B2B', fontSize: 17, fontWeight: '900', marginBottom: 16, letterSpacing: 0.5 },
  row: { marginBottom: 14 },
  label: { color: '#7A5C5C', fontSize: 12, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.2 },
  pickerWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#F8F3ED', borderRadius: 20, borderWidth: 1, borderColor: '#D9C9B8' },
  pillActive: { backgroundColor: '#B8975E', borderColor: '#B8975E' },
  pillText: { color: '#B8975E', fontSize: 13, fontWeight: '700', letterSpacing: 0.3 },
  pillTextActive: { color: '#F8F3ED' },
  input: { backgroundColor: '#F8F3ED', color: '#3D2B2B', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, fontSize: 18, borderWidth: 1, borderColor: '#D9C9B8' },
  result: { backgroundColor: '#F8F3ED', borderRadius: 14, padding: 18, marginTop: 10, alignItems: 'center' },
  resultLabel: { color: '#7A5C5C', fontSize: 12, letterSpacing: 1 },
  resultValue: { color: '#B8975E', fontSize: 28, fontWeight: '900', marginTop: 6, letterSpacing: 0.5 },
  resultNote: { color: '#7A5C5C', fontSize: 11, marginTop: 5 },
});