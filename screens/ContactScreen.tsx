import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LOCATIONS = [
  { name: 'Main Showroom', address: '28, Jewellery Lane, Karol Bagh, New Delhi 110005', phone: '+91 11 4567 8901', hours: '10:00 AM - 8:00 PM' },
  { name: 'South Delhi Atelier', address: 'B-12, Defence Colony, New Delhi 110024', phone: '+91 11 4987 6543', hours: '11:00 AM - 7:00 PM' },
];

export default function ContactScreen() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', type: 'Inquiry' });
  const [submitted, setSubmitted] = useState(false);
  const [showAppointment, setShowAppointment] = useState(false);
  const [appt, setAppt] = useState({ name: '', date: 'Tomorrow', time: '11:00 AM', service: 'Private Viewing' });

  const update = (k: string, v: string) => setForm({ ...form, [k]: v });

  const submitForm = () => {
    if (!form.name || !form.email || !form.message) {
      Alert.alert('Missing Details', 'Please fill name, email, and message.');
      return;
    }
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', message: '', type: 'Inquiry' }); Alert.alert('Thank You', 'Our concierge will reach you within 2 hours.'); }, 900);
  };

  const bookAppointment = () => {
    if (!appt.name) { Alert.alert('Name Required', 'Please enter your name.'); return; }
    setShowAppointment(false);
    Alert.alert('Appointment Confirmed', `Your private appointment is booked for ${appt.date} at ${appt.time}. We look forward to welcoming you, ${appt.name.split(' ')[0]}.`);
    setAppt({ ...appt, name: '' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }}>
        <Text style={styles.title}>Visit Us</Text>
        {LOCATIONS.map((loc, i) => (
          <View key={i} style={styles.storeCard}>
            <Text style={styles.storeName}>{loc.name}</Text>
            <Text style={styles.storeAddr}>{loc.address}</Text>
            <View style={styles.storeRow}><Ionicons name="call" size={16} color="#B8975E" /><Text style={styles.storeMeta}>{loc.phone}</Text></View>
            <View style={styles.storeRow}><Ionicons name="time" size={16} color="#B8975E" /><Text style={styles.storeMeta}>{loc.hours}</Text></View>
          </View>
        ))}
        <TouchableOpacity style={styles.apptBtn} onPress={() => setShowAppointment(true)}><Ionicons name="calendar" size={18} color="#F8F3ED" /><Text style={styles.apptText}>BOOK PRIVATE APPOINTMENT</Text></TouchableOpacity>

        <View style={styles.formSection}>
          <Text style={styles.formTitle}>Send Us a Message</Text>
          <View style={styles.typeRow}>{['Inquiry', 'Custom Order', 'Valuation', 'Feedback'].map(t => (<TouchableOpacity key={t} style={[styles.typeChip, form.type === t && styles.typeActive]} onPress={() => update('type', t)}><Text style={[styles.typeText, form.type === t && styles.typeTextActive]}>{t}</Text></TouchableOpacity>))}</View>
          <TextInput style={styles.input} placeholder="Your Name" placeholderTextColor="#7A5C5C" value={form.name} onChangeText={(v) => update('name', v)} />
          <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor="#7A5C5C" keyboardType="email-address" value={form.email} onChangeText={(v) => update('email', v)} />
          <TextInput style={styles.input} placeholder="Phone Number" placeholderTextColor="#7A5C5C" keyboardType="phone-pad" value={form.phone} onChangeText={(v) => update('phone', v)} />
          <TextInput style={[styles.input, styles.textarea]} placeholder="Your message or requirement..." placeholderTextColor="#7A5C5C" multiline numberOfLines={4} value={form.message} onChangeText={(v) => update('message', v)} />
          <TouchableOpacity style={styles.submitBtn} onPress={submitForm}><Text style={styles.submitText}>SEND MESSAGE</Text></TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={showAppointment} animationType="slide" transparent={false} onRequestClose={() => setShowAppointment(false)}>
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}><TouchableOpacity onPress={() => setShowAppointment(false)}><Ionicons name="close" size={24} color="#B8975E" /></TouchableOpacity><Text style={styles.modalTitle}>Private Appointment</Text><View style={{ width: 24 }} /></View>
          <View style={styles.modalBody}>
            <Text style={styles.modalLabel}>Name</Text>
            <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#7A5C5C" value={appt.name} onChangeText={(v) => setAppt({ ...appt, name: v })} />
            <Text style={styles.modalLabel}>Preferred Date</Text>
            {['Tomorrow', 'Day after', 'This Friday'].map(d => (<TouchableOpacity key={d} style={[styles.slot, appt.date === d && styles.slotActive]} onPress={() => setAppt({ ...appt, date: d })}><Text style={[styles.slotText, appt.date === d && styles.slotTextActive]}>{d}</Text></TouchableOpacity>))}
            <Text style={styles.modalLabel}>Time Slot</Text>
            {['11:00 AM', '2:00 PM', '4:30 PM'].map(t => (<TouchableOpacity key={t} style={[styles.slot, appt.time === t && styles.slotActive]} onPress={() => setAppt({ ...appt, time: t })}><Text style={[styles.slotText, appt.time === t && styles.slotTextActive]}>{t}</Text></TouchableOpacity>))}
            <Text style={styles.modalLabel}>Service</Text>
            {['Private Viewing', 'Bespoke Design', 'Valuation', 'Wedding Shopping'].map(s => (<TouchableOpacity key={s} style={[styles.slot, appt.service === s && styles.slotActive]} onPress={() => setAppt({ ...appt, service: s })}><Text style={[styles.slotText, appt.service === s && styles.slotTextActive]}>{s}</Text></TouchableOpacity>))}
            <TouchableOpacity style={styles.bookBtn} onPress={bookAppointment}><Text style={styles.bookText}>CONFIRM APPOINTMENT</Text></TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F3ED' },
  title: { color: '#3D2B2B', fontSize: 26, fontWeight: '800', marginBottom: 16 },
  storeCard: { backgroundColor: '#FFF8F0', borderRadius: 16, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: '#D9C9B8' },
  storeName: { color: '#B8975E', fontSize: 16, fontWeight: '700' },
  storeAddr: { color: '#3D2B2B', fontSize: 13, marginTop: 6, lineHeight: 18 },
  storeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  storeMeta: { color: '#7A5C5C', fontSize: 13 },
  apptBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, backgroundColor: '#C48B8E', paddingVertical: 16, borderRadius: 14, marginTop: 8, marginBottom: 28 },
  apptText: { color: '#F8F3ED', fontSize: 15, fontWeight: '800', letterSpacing: 1 },
  formSection: { marginTop: 8 },
  formTitle: { color: '#3D2B2B', fontSize: 18, fontWeight: '700', marginBottom: 14 },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  typeChip: { paddingHorizontal: 12, paddingVertical: 7, backgroundColor: '#FFF8F0', borderRadius: 18, borderWidth: 1, borderColor: '#D9C9B8' },
  typeActive: { backgroundColor: '#C48B8E' },
  typeText: { color: '#B8975E', fontSize: 12, fontWeight: '600' },
  typeTextActive: { color: '#F8F3ED' },
  input: { backgroundColor: '#FFF8F0', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, color: '#3D2B2B', fontSize: 15, borderWidth: 1, borderColor: '#D9C9B8', marginBottom: 12 },
  textarea: { height: 110, textAlignVertical: 'top' },
  submitBtn: { backgroundColor: '#C48B8E', paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 8 },
  submitText: { color: '#F8F3ED', fontSize: 15, fontWeight: '800', letterSpacing: 1 },
  modal: { flex: 1, backgroundColor: '#F8F3ED' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#D9C9B8' },
  modalTitle: { color: '#3D2B2B', fontSize: 18, fontWeight: '700' },
  modalBody: { padding: 20 },
  modalLabel: { color: '#7A5C5C', fontSize: 12, marginTop: 16, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  slot: { paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#FFF8F0', borderRadius: 12, borderWidth: 1, borderColor: '#D9C9B8', marginBottom: 8 },
  slotActive: { backgroundColor: '#C48B8E', borderColor: '#C48B8E' },
  slotText: { color: '#3D2B2B', fontSize: 15 },
  slotTextActive: { color: '#F8F3ED', fontWeight: '700' },
  bookBtn: { backgroundColor: '#C48B8E', paddingVertical: 18, borderRadius: 14, alignItems: 'center', marginTop: 24 },
  bookText: { color: '#F8F3ED', fontSize: 15, fontWeight: '800', letterSpacing: 1 },
});