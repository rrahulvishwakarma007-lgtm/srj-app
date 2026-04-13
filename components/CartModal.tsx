import React from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartItem } from '../lib/types';

interface Props {
  visible: boolean;
  items: CartItem[];
  onClose: () => void;
  onRemove: (id: number) => void;
  onCheckout: () => void;
}

export default function CartModal({ visible, items, onClose, onRemove, onCheckout }: Props) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} color="#B8975E" /></TouchableOpacity>
          <Text style={styles.title}>Your Cart ({items.length})</Text>
          <View style={{ width: 24 }} />
        </View>
        {items.length === 0 ? (
          <View style={styles.empty}><Ionicons name="cart-outline" size={64} color="#D9C9B8" /><Text style={styles.emptyText}>Your cart is empty</Text></View>
        ) : (
          <>
            <FlatList
              data={items}
              keyExtractor={(i) => String(i.id)}
              contentContainerStyle={{ padding: 16 }}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemMeta}>{item.weight}g • {item.purity} • Qty {item.quantity}</Text>
                    <Text style={styles.itemPrice}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</Text>
                  </View>
                  <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.removeBtn}><Ionicons name="trash-outline" size={18} color="#7A5C5C" /></TouchableOpacity>
                </View>
              )}
            />
            <View style={styles.totalBar}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{total.toLocaleString('en-IN')}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutBtn} onPress={onCheckout}>
              <Text style={styles.checkoutText}>PROCEED TO CHECKOUT</Text>
            </TouchableOpacity>
          </>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F3ED' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#D9C9B8' },
  title: { color: '#3D2B2B', fontSize: 20, fontWeight: '900', letterSpacing: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#7A5C5C', fontSize: 16, marginTop: 16 },
  item: { flexDirection: 'row', backgroundColor: '#FFF8F0', borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#D9C9B8' },
  itemInfo: { flex: 1 },
  itemName: { color: '#3D2B2B', fontSize: 16, fontWeight: '600' },
  itemMeta: { color: '#7A5C5C', fontSize: 12, marginTop: 4 },
  itemPrice: { color: '#B8975E', fontSize: 18, fontWeight: '700', marginTop: 8 },
  removeBtn: { padding: 8 },
  totalBar: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderTopWidth: 1, borderTopColor: '#D9C9B8', backgroundColor: '#FFF8F0' },
  totalLabel: { color: '#7A5C5C', fontSize: 14 },
  totalValue: { color: '#D4AF37', fontSize: 26, fontWeight: '900', letterSpacing: 0.4 },
  checkoutBtn: { margin: 16, backgroundColor: '#D4AF37', paddingVertical: 19, borderRadius: 18, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  checkoutText: { color: '#F8F3ED', fontSize: 15, fontWeight: '800', letterSpacing: 1 },
});