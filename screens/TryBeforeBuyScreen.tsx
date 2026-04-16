import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { products, Product } from '../lib/data';

export default function TryBeforeBuyScreen() {
  const [selected, setSelected] = useState<Product>(products[0]);
  const [worn, setWorn] = useState(true);

  const pos = selected.category === 'Necklaces' ? { top: 148, left: 130 } :
              selected.category === 'Earrings' ? { top: 108, left: 96 } :
              selected.category === 'Bracelets' ? { top: 196, left: 78 } : { top: 122, left: 132 };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.h1}>Try Before You Buy</Text><Text style={styles.sub}>Virtual mirror • See it on you</Text></View>

      {/* Mirror Frame */}
      <View style={styles.mirror}>
        <View style={styles.face}>
          {/* Simple elegant face silhouette */}
          <View style={styles.head} />
          <View style={styles.hair} />
          {/* Jewellery overlay (visible when "worn") */}
          {worn && <View style={[styles.jewel, pos]}><Ionicons name={selected.icon as any} size={selected.category==='Earrings'?34:42} color={selected.color} /></View>}
        </View>
        <Text style={styles.mirrorLabel}>{worn ? 'Wearing ' + selected.name : 'Jewellery removed'}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={[styles.btn, worn && styles.btnOn]} onPress={() => setWorn(!worn)}>
          <Ionicons name={worn ? 'eye-off' : 'eye'} size={18} color={worn ? '#F8F3ED' : '#F5EDE3'} />
          <Text style={[styles.btnText, worn && { color: '#F8F3ED' }]}>{worn ? 'REMOVE' : 'WEAR'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.pick}>Choose a piece</Text>
      <FlatList
        data={products}
        keyExtractor={(p) => String(p.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.pickCard, selected.id === item.id && styles.pickActive]} onPress={() => setSelected(item)}>
            <Ionicons name={item.icon as any} size={28} color={item.color} />
            <Text style={styles.pickName} numberOfLines={1}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2A1B4D' }, // PLUM — HomeScreen theme
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 },
  h1: { color: '#F5EDE3', fontSize: 24, fontWeight: '900', letterSpacing: 1 },
  sub: { color: '#D4AF37', fontSize: 13, fontWeight: '700', letterSpacing: 1.5, marginTop: 2 },
  mirror: { margin: 20, backgroundColor: '#FFF8F0', borderRadius: 28, padding: 22, alignItems: 'center', borderWidth: 1, borderColor: '#D9C9B8' },
  face: { width: 220, height: 260, backgroundColor: '#EDE3D8', borderRadius: 110, position: 'relative', overflow: 'hidden', alignItems: 'center' },
  head: { position: 'absolute', top: 54, width: 108, height: 132, backgroundColor: '#D9C4A7', borderRadius: 54 },
  hair: { position: 'absolute', top: 28, width: 148, height: 72, backgroundColor: '#3D2B2B', borderRadius: 74 },
  jewel: { position: 'absolute' },
  mirrorLabel: { color: '#1F1414', fontSize: 12, fontWeight: '700', marginTop: 16, letterSpacing: 1 },
  controls: { alignItems: 'center', marginTop: 4 },
  btn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FFF8F0', paddingVertical: 12, paddingHorizontal: 28, borderRadius: 22, borderWidth: 1, borderColor: '#D9C9B8' },
  btnOn: { backgroundColor: '#D4AF37', borderColor: '#D4AF37' },
  btnText: { color: '#F5EDE3', fontSize: 13, fontWeight: '800', letterSpacing: 1.5 },
  pick: { color: '#1F1414', fontSize: 13, fontWeight: '800', letterSpacing: 1.2, paddingHorizontal: 20, marginTop: 18, marginBottom: 10 },
  pickCard: { width: 110, backgroundColor: '#FFF8F0', borderRadius: 16, padding: 12, marginRight: 12, alignItems: 'center', borderWidth: 1, borderColor: '#D9C9B8' },
  pickActive: { borderColor: '#D4AF37', backgroundColor: '#F8F3ED' },
  pickName: { color: '#1F1414', fontSize: 11, fontWeight: '700', marginTop: 6, textAlign: 'center' },
});