import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Modal, Alert, Dimensions, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const LOCATIONS = [
  {
    name: 'Flagship Store',
    line1: 'Sarafa, Jabalpur',
    line2: 'Dixitpura Road, Sarafa',
    city: 'Jabalpur, Madhya Pradesh 482002',
    sep: '◆',
    hours: '12:00 PM – 9:00 PM',
    mapLabel: 'View on Map',
    mapUrl: 'https://www.google.com/maps/place/Shekhar+Raja+Jewellers/@23.1785114,79.9295021,17z/data=!3m1!4b1!4m6!3m5!1s0x3981ae3d671cf21b:0x61c29052be4591a7!8m2!3d23.1785114!4d79.932077!16s%2Fg%2F119x3s7zw',
  },
  {
    name: 'Heritage Location',
    line1: 'Napier Town, Jabalpur',
    line2: 'Napier Town',
    city: 'Jabalpur, Madhya Pradesh 482002',
    sep: '◆',
    hours: '12:00 PM – 9:00 PM',
    mapLabel: 'Get Directions · View on Map',
    mapUrl: 'https://www.google.com/maps/place/Shekhar+Raja+Jewellers+-Jewellery+Showroom+in+Jabalpur+%7CHallmark+Jewellery+in+Jabalpur+%7CLatest+gold+Jewellery+in+Jabalpur/@23.1599761,79.9230616,17z/data=!3m1!4b1!4m6!3m5!1s0x3981af003db9063f:0xd27d564668e14db!8m2!3d23.1599712!4d79.9279325!16s%2Fg%2F11wmjdylwz',
  },
];

const SERVICES = ['Private Viewing', 'Bespoke Design', 'Valuation & Appraisal', 'Wedding & Trousseau'];
const DATES = ['Tomorrow', 'Day after', 'This Friday', 'Next Monday'];
const TIMES = ['11:00 AM', '1:30 PM', '3:00 PM', '5:00 PM'];

export default function ContactScreen() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', type: 'Private Viewing' });
  const [showAppt, setShowAppt] = useState(false);
  const [appt, setAppt] = useState({ name: '', date: DATES[0], time: TIMES[0], service: SERVICES[0] });
  const [success, setSuccess] = useState('');

  const update = (k: string, v: string) => setForm({ ...form, [k]: v });

  const submitMessage = () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      Alert.alert('Details Required', 'Please provide your name, email, and a brief message.');
      return;
    }
    setSuccess('MESSAGE SENT');
    setTimeout(() => {
      setSuccess('');
      setForm({ name: '', email: '', phone: '', message: '', type: 'Private Viewing' });
      Alert.alert('Thank You', 'Our private concierge will contact you within two hours.');
    }, 800);
  };

  const confirmAppointment = () => {
    if (!appt.name.trim()) { Alert.alert('Name Required', 'Please enter your full name.'); return; }
    setShowAppt(false);
    setSuccess('APPOINTMENT BOOKED');
    setTimeout(() => {
      setSuccess('');
      Alert.alert(
        'Appointment Confirmed',
        `Your private ${appt.service} is reserved for ${appt.date} at ${appt.time}.\n\nWe look forward to welcoming you, ${appt.name.split(' ')[0]}.`
      );
      setAppt({ name: '', date: DATES[0], time: TIMES[0], service: SERVICES[0] });
    }, 600);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Elegant Header */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>EST. 1975</Text>
          <Text style={styles.title}>Private Concierge</Text>
          <Text style={styles.subtitle}>Exclusive appointments • Bespoke service • By invitation</Text>
        </View>

        {/* Showrooms — Jabalpur Locations */}
        <Text style={styles.sectionLabel}>OUR SHOWROOMS</Text>
        {LOCATIONS.map((loc, i) => (
          <View key={i} style={styles.showroom}>
            <View style={styles.showroomHeader}>
              <Ionicons name="diamond-outline" size={22} color="#8C5C2D" />
              <Text style={styles.showroomName}>{loc.name}</Text>
            </View>
            <Text style={styles.showroomLine}>{loc.line1}</Text>
            <Text style={styles.showroomLine}>{loc.line2}</Text>
            <Text style={styles.showroomCity}>{loc.city}</Text>
            <Text style={styles.showroomSep}>{loc.sep}</Text>
            <View style={styles.showroomMeta}>
              <View style={styles.metaChip}><Ionicons name="time" size={14} color="#8C5C2D" /><Text style={styles.metaTxt}>Showroom Hours  ·  {loc.hours}</Text></View>
            </View>
            <TouchableOpacity style={styles.mapBtn} onPress={() => Linking.openURL(loc.mapUrl)} activeOpacity={0.85}>
              <Ionicons name="navigate" size={16} color="#F8F3ED" />
              <Text style={styles.mapBtnText}>{loc.mapLabel}</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Primary CTA — Request Private Appointment */}
        <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.9} onPress={() => setShowAppt(true)}>
          <Ionicons name="calendar" size={20} color="#F8F3ED" />
          <Text style={styles.primaryBtnText}>REQUEST PRIVATE APPOINTMENT</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}><View style={styles.divLine} /><Text style={styles.divText}>OR</Text><View style={styles.divLine} /></View>

        {/* Premium Message Form */}
        <Text style={styles.sectionLabel}>SEND A PRIVATE NOTE</Text>
        <View style={styles.form}>
          <View style={styles.typeRow}>
            {['Private Viewing', 'Custom Order', 'Valuation', 'Feedback'].map(t => (
              <TouchableOpacity key={t} style={[styles.typeChip, form.type === t && styles.typeActive]} onPress={() => update('type', t)}>
                <Text style={[styles.typeText, form.type === t && styles.typeTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#EDE3D5" value={form.name} onChangeText={v => update('name', v)} />
          <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor="#EDE3D5" keyboardType="email-address" value={form.email} onChangeText={v => update('email', v)} />
          <TextInput style={styles.input} placeholder="Phone Number" placeholderTextColor="#EDE3D5" keyboardType="phone-pad" value={form.phone} onChangeText={v => update('phone', v)} />
          <TextInput style={[styles.input, styles.textarea]} placeholder="Your private message or requirement..." placeholderTextColor="#EDE3D5" multiline value={form.message} onChangeText={v => update('message', v)} />
          <TouchableOpacity style={styles.sendBtn} activeOpacity={0.9} onPress={submitMessage}>
            <Text style={styles.sendText}>SEND TO CONCIERGE</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footNote}>All inquiries are handled personally by our senior concierge. Response within two hours.</Text>
      </ScrollView>

      {/* Success Banner */}
      {!!success && (
        <View style={styles.success}><Ionicons name="checkmark-circle" size={18} color="#F8F3ED" /><Text style={styles.successText}>{success}</Text></View>
      )}

      {/* Private Appointment Modal — Ultra Luxury */}
      <Modal visible={showAppt} animationType="slide" transparent={false} onRequestClose={() => setShowAppt(false)}>
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAppt(false)}><Ionicons name="close" size={26} color="#D4AF37" /></TouchableOpacity>
            <Text style={styles.modalTitle}>Private Appointment</Text>
            <View style={{ width: 26 }} />
          </View>
          <ScrollView contentContainerStyle={styles.modalBody}>
            <Text style={styles.modalIntro}>Our concierge will personally host you. Select your preference below.</Text>

            <Text style={styles.modalLabel}>YOUR NAME</Text>
            <TextInput style={styles.modalInput} placeholder="Full Name" placeholderTextColor="#EDE3D5" value={appt.name} onChangeText={v => setAppt({ ...appt, name: v })} />

            <Text style={styles.modalLabel}>PREFERRED DATE</Text>
            <View style={styles.slotRow}>{DATES.map(d => (
              <TouchableOpacity key={d} style={[styles.slot, appt.date === d && styles.slotActive]} onPress={() => setAppt({ ...appt, date: d })}>
                <Text style={[styles.slotText, appt.date === d && styles.slotTextActive]}>{d}</Text>
              </TouchableOpacity>
            ))}</View>

            <Text style={styles.modalLabel}>TIME SLOT</Text>
            <View style={styles.slotRow}>{TIMES.map(t => (
              <TouchableOpacity key={t} style={[styles.slot, appt.time === t && styles.slotActive]} onPress={() => setAppt({ ...appt, time: t })}>
                <Text style={[styles.slotText, appt.time === t && styles.slotTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}</View>

            <Text style={styles.modalLabel}>SERVICE</Text>
            <View style={styles.slotRowWrap}>{SERVICES.map(s => (
              <TouchableOpacity key={s} style={[styles.slot, appt.service === s && styles.slotActive, { minWidth: width * 0.42 }]} onPress={() => setAppt({ ...appt, service: s })}>
                <Text style={[styles.slotText, appt.service === s && styles.slotTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}</View>

            <TouchableOpacity style={styles.confirmBtn} activeOpacity={0.9} onPress={confirmAppointment}>
              <Text style={styles.confirmText}>CONFIRM PRIVATE APPOINTMENT</Text>
            </TouchableOpacity>
            <Text style={styles.modalFine}>A senior curator will confirm within two hours.</Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2A1B4D' }, // PLUM — HomeScreen theme
  scroll: { paddingHorizontal: 22, paddingTop: 30, paddingBottom: 120 },
  header: { alignItems: 'center', marginBottom: 22 },
  eyebrow: { color: '#D4AF37', fontSize: 12, fontWeight: '800', letterSpacing: 3 },
  title: { color: '#F5EDE3', fontSize: 30, fontWeight: '900', letterSpacing: 1.5, marginTop: 4 },
  subtitle: { color: '#EDE3D5', fontSize: 13, marginTop: 8, textAlign: 'center', letterSpacing: 1 },

  sectionLabel: { color: '#D4AF37', fontSize: 12, fontWeight: '800', letterSpacing: 3, marginTop: 24, marginBottom: 10 },

  // Showroom Cards — Ultra Premium
  showroom: { backgroundColor: '#FFF8F0', borderRadius: 20, padding: 20, marginBottom: 14, borderWidth: 1, borderColor: '#D9C9B8' },
  showroomHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  showroomName: { color: '#F5EDE3', fontSize: 18, fontWeight: '900', letterSpacing: 0.5 },
  showroomAddr: { color: '#F5EDE3', fontSize: 14, lineHeight: 20 },
  showroomMeta: { flexDirection: 'row', gap: 12, marginTop: 12, flexWrap: 'wrap' },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F8F3ED', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14, borderWidth: 1, borderColor: '#D9C9B8' },
  metaTxt: { color: '#EDE3D5', fontSize: 12, fontWeight: '600' },
  showroomLine: { color: '#1F1414', fontSize: 14, lineHeight: 20 },
  showroomCity: { color: '#4F3636', fontSize: 13, marginTop: 2 },
  showroomSep: { color: '#8C5C2D', fontSize: 16, fontWeight: '900', marginVertical: 8, textAlign: 'center' },
  mapBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#7A4B6A', paddingVertical: 12, paddingHorizontal: 18, borderRadius: 16, marginTop: 14 },
  mapBtnText: { color: '#F8F3ED', fontSize: 13, fontWeight: '800', letterSpacing: 1 },

  // Primary CTA
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#D4AF37', paddingVertical: 18, borderRadius: 18, marginTop: 16, marginBottom: 8 },
  primaryBtnText: { color: '#F8F3ED', fontSize: 14, fontWeight: '800', letterSpacing: 2 },

  // Divider
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 20 },
  divLine: { flex: 1, height: 1, backgroundColor: '#D9C9B8' },
  divText: { color: '#D4AF37', fontSize: 11, fontWeight: '700', letterSpacing: 2 },

  // Form
  form: { backgroundColor: '#FFF8F0', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#D9C9B8' },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  typeChip: { paddingHorizontal: 12, paddingVertical: 7, backgroundColor: '#F8F3ED', borderRadius: 16, borderWidth: 1, borderColor: '#D9C9B8' },
  typeActive: { backgroundColor: '#D4AF37', borderColor: '#D4AF37' },
  typeText: { color: '#D4AF37', fontSize: 12, fontWeight: '700' },
  typeTextActive: { color: '#F8F3ED' },
  input: { backgroundColor: '#F8F3ED', color: '#F5EDE3', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, borderWidth: 1, borderColor: '#D9C9B8', marginBottom: 12 },
  textarea: { height: 100, textAlignVertical: 'top' },
  sendBtn: { backgroundColor: '#D4AF37', paddingVertical: 17, borderRadius: 16, alignItems: 'center', marginTop: 4 },
  sendText: { color: '#F8F3ED', fontSize: 14, fontWeight: '800', letterSpacing: 2 },

  footNote: { color: '#EDE3D5', fontSize: 11, textAlign: 'center', marginTop: 22, lineHeight: 18, letterSpacing: 0.5 },

  // Success
  success: { position: 'absolute', bottom: 40, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#D4AF37', paddingVertical: 10, paddingHorizontal: 22, borderRadius: 22 },
  successText: { color: '#F8F3ED', fontSize: 13, fontWeight: '800', letterSpacing: 1 },

  // Modal — Ultra Luxury Appointment
  modal: { flex: 1, backgroundColor: '#F8F3ED' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#D9C9B8' },
  modalTitle: { color: '#F5EDE3', fontSize: 20, fontWeight: '900', letterSpacing: 1 },
  modalBody: { padding: 22, paddingBottom: 60 },
  modalIntro: { color: '#EDE3D5', fontSize: 14, lineHeight: 22, marginBottom: 20 },
  modalLabel: { color: '#D4AF37', fontSize: 11, fontWeight: '800', letterSpacing: 2.5, marginTop: 14, marginBottom: 8 },
  modalInput: { backgroundColor: '#FFF8F0', color: '#F5EDE3', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, borderWidth: 1, borderColor: '#D9C9B8' },
  slotRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slotRowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slot: { paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#FFF8F0', borderRadius: 14, borderWidth: 1, borderColor: '#D9C9B8', marginBottom: 6 },
  slotActive: { backgroundColor: '#D4AF37', borderColor: '#D4AF37' },
  slotText: { color: '#F5EDE3', fontSize: 14, fontWeight: '700' },
  slotTextActive: { color: '#F8F3ED' },
  confirmBtn: { backgroundColor: '#D4AF37', paddingVertical: 19, borderRadius: 18, alignItems: 'center', marginTop: 26 },
  confirmText: { color: '#F8F3ED', fontSize: 14, fontWeight: '900', letterSpacing: 2 },
  modalFine: { color: '#EDE3D5', fontSize: 11, textAlign: 'center', marginTop: 14, letterSpacing: 0.5 },
});