import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert, Dimensions, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Theme, Radius } from '../lib/theme';

const { width } = Dimensions.get('window');
const WHATSAPP = '918377911745';
const WA_URL = (msg: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

const LOCATIONS = [
  { name: 'Flagship Showroom', area: 'Sarafa, Jabalpur', address: 'Dixitpura Road, Sarafa', city: 'Jabalpur, MP 482002', hours: '12:00 PM – 9:00 PM', mapUrl: 'https://www.google.com/maps/place/Shekhar+Raja+Jewellers/@23.1785114,79.9295021,17z' },
  { name: 'Heritage Location', area: 'Napier Town, Jabalpur', address: 'Napier Town', city: 'Jabalpur, MP 482002', hours: '12:00 PM – 9:00 PM', mapUrl: 'https://www.google.com/maps/place/Shekhar+Raja+Jewellers+-Jewellery+Showroom+in+Jabalpur' },
];
const SERVICES  = ['Private Viewing', 'Bespoke Design', 'Valuation & Appraisal', 'Wedding & Trousseau'];
const DATES     = ['Tomorrow', 'Day after', 'This Friday', 'Next Monday'];
const TIMES     = ['11:00 AM', '1:30 PM', '3:00 PM', '5:00 PM'];
const MSG_TYPES = ['Private Viewing', 'Custom Order', 'Valuation', 'Feedback'];

export default function ContactScreen() {
  const [form, setForm]   = useState({ name: '', email: '', phone: '', message: '', type: 'Private Viewing' });
  const [showAppt, setAp] = useState(false);
  const [apptF, setAF]    = useState({ name: '', date: DATES[0], time: TIMES[0], service: SERVICES[0] });
  const [flash, setFlash] = useState('');
  const upd  = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const updA = (k: string, v: string) => setAF(f => ({ ...f, [k]: v }));
  const showFlash = (msg: string, cb?: () => void) => { setFlash(msg); setTimeout(() => { setFlash(''); cb?.(); }, 1400); };

  const submit = () => {
    if (!form.name.trim() || !form.phone.trim()) { Alert.alert('Required', 'Please enter name and phone.'); return; }
    showFlash('MESSAGE SENT ✓', () => Alert.alert('Thank You', 'Our concierge will respond within two hours.'));
    setForm({ name: '', email: '', phone: '', message: '', type: 'Private Viewing' });
  };
  const confirmAppt = () => {
    if (!apptF.name.trim()) { Alert.alert('Name Required', 'Please enter your name.'); return; }
    setAp(false);
    showFlash('APPOINTMENT BOOKED ✓', () => Alert.alert('Confirmed', `Your ${apptF.service} is reserved for ${apptF.date} at ${apptF.time}.`));
    setAF({ name: '', date: DATES[0], time: TIMES[0], service: SERVICES[0] });
  };
  const openWA = () => Linking.openURL(WA_URL('Hello Shekhar Raja Jewellers! I would like to get in touch.')).catch(() => Alert.alert('WhatsApp', `+${WHATSAPP}`));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>EST. 1987  ◆  JABALPUR</Text>
          <Text style={styles.title}>Private Concierge</Text>
          <Text style={styles.subtitle}>Exclusive appointments · Bespoke service</Text>
        </View>
        <View style={styles.goldLine} />

        {/* WhatsApp CTA — most prominent */}
        <TouchableOpacity style={styles.waPrimary} onPress={openWA} activeOpacity={0.88}>
          <View style={styles.waLeft}>
            <View style={styles.waIcon}><Ionicons name="logo-whatsapp" size={24} color="#FFFFFF" /></View>
            <View>
              <Text style={styles.waTitle}>Chat on WhatsApp</Text>
              <Text style={styles.waSub}>Fastest response · Usually replies in minutes</Text>
            </View>
          </View>
          <Ionicons name="arrow-forward" size={20} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>

        {/* Appointment CTA */}
        <TouchableOpacity style={styles.apptBtn} onPress={() => setAp(true)} activeOpacity={0.88}>
          <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
          <Text style={styles.apptBtnTxt}>REQUEST PRIVATE APPOINTMENT</Text>
        </TouchableOpacity>

        {/* Showrooms */}
        <Text style={styles.sectionLabel}>OUR SHOWROOMS</Text>
        {LOCATIONS.map((loc, i) => (
          <View key={i} style={styles.showroom}>
            <View style={styles.showroomHead}>
              <View style={styles.showroomIcon}><Ionicons name="storefront-outline" size={18} color={Theme.purple} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.showroomName}>{loc.name}</Text>
                <Text style={styles.showroomArea}>{loc.area}</Text>
              </View>
            </View>
            <View style={styles.showroomDetail}>
              <Text style={styles.showroomAddr}>{loc.address}</Text>
              <Text style={styles.showroomCity}>{loc.city}</Text>
            </View>
            <View style={styles.hoursMeta}>
              <Ionicons name="time-outline" size={13} color={Theme.purple} />
              <Text style={styles.hoursText}>Open: {loc.hours}</Text>
            </View>
            <TouchableOpacity style={styles.mapBtn} onPress={() => Linking.openURL(loc.mapUrl)} activeOpacity={0.85}>
              <Ionicons name="navigate" size={16} color="#FFFFFF" />
              <Text style={styles.mapBtnTxt}>View on Google Maps</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Divider */}
        <View style={styles.divider}><View style={styles.divLine} /><Text style={styles.divTxt}>OR SEND A MESSAGE</Text><View style={styles.divLine} /></View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.typeRow}>
            {MSG_TYPES.map(t => (
              <TouchableOpacity key={t} style={[styles.typeChip, form.type === t && styles.typeActive]} onPress={() => upd('type', t)}>
                <Text style={[styles.typeTxt, form.type === t && styles.typeTxtActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput style={styles.input} placeholder="Full Name *" placeholderTextColor={Theme.textMuted} value={form.name} onChangeText={v => upd('name', v)} />
          <TextInput style={styles.input} placeholder="Phone Number *" placeholderTextColor={Theme.textMuted} keyboardType="phone-pad" value={form.phone} onChangeText={v => upd('phone', v)} />
          <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor={Theme.textMuted} keyboardType="email-address" value={form.email} onChangeText={v => upd('email', v)} />
          <TextInput style={[styles.input, styles.textarea]} placeholder="Your requirement or message…" placeholderTextColor={Theme.textMuted} multiline value={form.message} onChangeText={v => upd('message', v)} />
          <TouchableOpacity style={styles.sendBtn} onPress={submit} activeOpacity={0.88}>
            <Text style={styles.sendTxt}>SEND TO CONCIERGE</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footNote}>All messages handled personally · Response within two hours</Text>
      </ScrollView>

      {!!flash && (
        <View style={styles.flash}>
          <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
          <Text style={styles.flashText}>{flash}</Text>
        </View>
      )}

      <Modal visible={showAppt} animationType="slide" transparent={false} onRequestClose={() => setAp(false)}>
        <SafeAreaView style={styles.modal} edges={['top', 'bottom']}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setAp(false)} style={styles.modalClose}><Ionicons name="close" size={20} color={Theme.textDark} /></TouchableOpacity>
            <Text style={styles.modalTitle}>Private Appointment</Text>
            <View style={{ width: 36 }} />
          </View>
          <ScrollView contentContainerStyle={styles.modalBody} showsVerticalScrollIndicator={false}>
            <Text style={styles.modalIntro}>Our curator will personally host you. Select your preference.</Text>
            <Text style={styles.modalLabel}>YOUR NAME</Text>
            <TextInput style={styles.modalInput} placeholder="Full Name" placeholderTextColor={Theme.textMuted} value={apptF.name} onChangeText={v => updA('name', v)} />
            <Text style={styles.modalLabel}>PREFERRED DATE</Text>
            <View style={styles.slotRow}>{DATES.map(d => (<TouchableOpacity key={d} style={[styles.slot, apptF.date === d && styles.slotActive]} onPress={() => updA('date', d)}><Text style={[styles.slotTxt, apptF.date === d && styles.slotTxtActive]}>{d}</Text></TouchableOpacity>))}</View>
            <Text style={styles.modalLabel}>TIME SLOT</Text>
            <View style={styles.slotRow}>{TIMES.map(t => (<TouchableOpacity key={t} style={[styles.slot, apptF.time === t && styles.slotActive]} onPress={() => updA('time', t)}><Text style={[styles.slotTxt, apptF.time === t && styles.slotTxtActive]}>{t}</Text></TouchableOpacity>))}</View>
            <Text style={styles.modalLabel}>SERVICE</Text>
            <View style={styles.slotRow}>{SERVICES.map(s => (<TouchableOpacity key={s} style={[styles.slot, { minWidth: width * 0.42 }, apptF.service === s && styles.slotActive]} onPress={() => updA('service', s)}><Text style={[styles.slotTxt, apptF.service === s && styles.slotTxtActive]}>{s}</Text></TouchableOpacity>))}</View>
            <TouchableOpacity style={styles.confirmBtn} onPress={confirmAppt} activeOpacity={0.88}><Text style={styles.confirmTxt}>CONFIRM APPOINTMENT</Text></TouchableOpacity>
            <Text style={styles.modalFine}>A curator will confirm within two hours.</Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.bgPrimary },
  scroll: { paddingBottom: 100 },
  header: { backgroundColor: Theme.bgPurple, alignItems: 'center', paddingHorizontal: 20, paddingTop: 22, paddingBottom: 22 },
  eyebrow:  { color: Theme.gold, fontSize: 11, fontWeight: '800', letterSpacing: 3 },
  title:    { color: '#FFFFFF', fontSize: 30, fontWeight: '900', marginTop: 6 },
  subtitle: { color: Theme.textLightMuted, fontSize: 13, marginTop: 6, textAlign: 'center' },
  goldLine: { height: 3, backgroundColor: Theme.gold },
  waPrimary: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#25D366', marginHorizontal: 16, marginTop: 16, borderRadius: Radius.lg, padding: 18,
    elevation: 4, shadowColor: '#25D366', shadowOpacity: 0.3, shadowRadius: 10,
  },
  waLeft:  { flexDirection: 'row', alignItems: 'center', gap: 14 },
  waIcon:  { width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  waTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  waSub:   { color: 'rgba(255,255,255,0.85)', fontSize: 11, marginTop: 2 },
  apptBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Theme.bgPurple, marginHorizontal: 16, marginTop: 12,
    paddingVertical: 15, borderRadius: Radius.lg,
  },
  apptBtnTxt: { color: '#FFFFFF', fontSize: 13, fontWeight: '900', letterSpacing: 1 },
  sectionLabel: { color: Theme.purple, fontSize: 11, fontWeight: '800', letterSpacing: 3, marginHorizontal: 20, marginTop: 24, marginBottom: 12 },
  showroom: {
    backgroundColor: '#FFFFFF', marginHorizontal: 16, marginBottom: 14,
    borderRadius: Radius.lg, padding: 18,
    borderWidth: 1, borderColor: Theme.border,
    elevation: 2, shadowColor: Theme.shadow, shadowOpacity: 0.08, shadowRadius: 8,
  },
  showroomHead: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  showroomIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: Theme.bgCardPurple, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Theme.purpleBorder },
  showroomName: { color: Theme.textDark, fontSize: 16, fontWeight: '800' },
  showroomArea: { color: Theme.purple, fontSize: 12, fontWeight: '700', marginTop: 2 },
  showroomDetail: { backgroundColor: Theme.bgPrimary, borderRadius: Radius.sm, padding: 12, marginBottom: 10 },
  showroomAddr: { color: Theme.textDark, fontSize: 13, fontWeight: '600', lineHeight: 19 },
  showroomCity: { color: Theme.textMuted, fontSize: 12, marginTop: 2 },
  hoursMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  hoursText: { color: Theme.textMuted, fontSize: 12, fontWeight: '600' },
  mapBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Theme.bgPurple, paddingVertical: 12, borderRadius: Radius.md },
  mapBtnTxt: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 16, marginVertical: 20 },
  divLine: { flex: 1, height: 1, backgroundColor: Theme.border },
  divTxt:  { color: Theme.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 2 },
  form: { backgroundColor: '#FFFFFF', marginHorizontal: 16, borderRadius: Radius.lg, padding: 18, borderWidth: 1, borderColor: Theme.border },
  typeRow:        { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  typeChip:       { paddingHorizontal: 12, paddingVertical: 7, backgroundColor: Theme.bgPrimary, borderRadius: Radius.full, borderWidth: 1, borderColor: Theme.border },
  typeActive:     { backgroundColor: Theme.bgPurple, borderColor: Theme.bgPurple },
  typeTxt:        { color: Theme.textMuted, fontSize: 12, fontWeight: '700' },
  typeTxtActive:  { color: '#FFFFFF' },
  input: { backgroundColor: Theme.bgPrimary, color: Theme.textDark, borderRadius: Radius.md, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, borderWidth: 1, borderColor: Theme.border, marginBottom: 12 },
  textarea: { height: 100, textAlignVertical: 'top' },
  sendBtn: { backgroundColor: Theme.bgPurple, paddingVertical: 16, borderRadius: Radius.md, alignItems: 'center', marginTop: 4 },
  sendTxt: { color: '#FFFFFF', fontSize: 13, fontWeight: '800', letterSpacing: 2 },
  footNote: { color: Theme.textMuted, fontSize: 11, textAlign: 'center', marginTop: 20, marginHorizontal: 20, lineHeight: 17 },
  flash: { position: 'absolute', bottom: 36, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Theme.bgPurple, paddingVertical: 12, paddingHorizontal: 22, borderRadius: Radius.full, borderWidth: 1, borderColor: Theme.gold },
  flashText: { color: Theme.gold, fontSize: 13, fontWeight: '800' },
  modal: { flex: 1, backgroundColor: Theme.bgPrimary },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Theme.border, backgroundColor: '#FFFFFF' },
  modalClose: { backgroundColor: Theme.bgPrimary, padding: 8, borderRadius: Radius.full },
  modalTitle: { color: Theme.textDark, fontSize: 18, fontWeight: '900' },
  modalBody:  { padding: 22, paddingBottom: 60 },
  modalIntro: { color: Theme.textMuted, fontSize: 14, lineHeight: 21, marginBottom: 20 },
  modalLabel: { color: Theme.purple, fontSize: 11, fontWeight: '800', letterSpacing: 2.5, marginTop: 16, marginBottom: 10 },
  modalInput: { backgroundColor: '#FFFFFF', color: Theme.textDark, borderRadius: Radius.md, paddingHorizontal: 14, paddingVertical: 14, fontSize: 15, borderWidth: 1, borderColor: Theme.border },
  slotRow:      { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slot:         { paddingVertical: 10, paddingHorizontal: 16, backgroundColor: '#FFFFFF', borderRadius: Radius.md, borderWidth: 1, borderColor: Theme.border, marginBottom: 4 },
  slotActive:   { backgroundColor: Theme.bgPurple, borderColor: Theme.bgPurple },
  slotTxt:      { color: Theme.textMuted, fontSize: 13, fontWeight: '700' },
  slotTxtActive:{ color: '#FFFFFF' },
  confirmBtn:   { backgroundColor: Theme.bgPurple, paddingVertical: 18, borderRadius: Radius.lg, alignItems: 'center', marginTop: 28 },
  confirmTxt:   { color: Theme.gold, fontSize: 14, fontWeight: '900', letterSpacing: 2 },
  modalFine:    { color: Theme.textMuted, fontSize: 11, textAlign: 'center', marginTop: 12 },
});
