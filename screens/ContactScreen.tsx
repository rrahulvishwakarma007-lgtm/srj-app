import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Modal, Alert, Dimensions, Linking, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Theme, Radius } from '../lib/theme';

const { width } = Dimensions.get('window');
const WHATSAPP = '918377911745';
const PHONE    = '+918377911745';
const WA_URL   = (msg: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

const LOCATIONS = [
  {
    name: 'Flagship Showroom',
    area: 'Sarafa, Jabalpur',
    address: 'Dixitpura Road, Sarafa',
    city: 'Jabalpur, MP 482002',
    hours: '12:00 PM – 9:00 PM',
    days: 'Mon – Sun',
    mapUrl: 'https://www.google.com/maps/place/Shekhar+Raja+Jewellers/@23.1785114,79.9295021,17z',
    tag: 'MAIN',
  },
  {
    name: 'Heritage Location',
    area: 'Napier Town, Jabalpur',
    address: 'Napier Town',
    city: 'Jabalpur, MP 482002',
    hours: '12:00 PM – 9:00 PM',
    days: 'Mon – Sun',
    mapUrl: 'https://www.google.com/maps/place/Shekhar+Raja+Jewellers+-Jewellery+Showroom+in+Jabalpur',
    tag: 'HERITAGE',
  },
];

const SERVICES  = ['Private Viewing', 'Bespoke Design', 'Valuation & Appraisal', 'Wedding & Trousseau'];
const DATES     = ['Tomorrow', 'Day after', 'This Friday', 'Next Monday'];
const TIMES     = ['11:00 AM', '1:30 PM', '3:00 PM', '5:00 PM'];
const MSG_TYPES = ['Private Viewing', 'Custom Order', 'Valuation', 'Feedback'];

const TRUST_ITEMS = [
  { icon: 'shield-checkmark-outline', label: 'BIS Hallmarked',  sub: 'All jewellery certified' },
  { icon: 'refresh-outline',          label: 'Easy Exchange',   sub: 'Lifetime exchange policy' },
  { icon: 'star-outline',             label: 'Est. 1987',       sub: '37+ years of trust' },
];

export default function ContactScreen() {
  const [form, setForm]   = useState({ name: '', email: '', phone: '', message: '', type: 'Private Viewing' });
  const [showAppt, setAp] = useState(false);
  const [apptF, setAF]    = useState({ name: '', date: DATES[0], time: TIMES[0], service: SERVICES[0] });
  const [flash, setFlash] = useState('');

  const upd  = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const updA = (k: string, v: string) => setAF(f => ({ ...f, [k]: v }));

  const showFlash = (msg: string, cb?: () => void) => {
    setFlash(msg);
    setTimeout(() => { setFlash(''); cb?.(); }, 1400);
  };

  const submit = () => {
    if (!form.name.trim() || !form.phone.trim()) {
      Alert.alert('Required', 'Please enter your name and phone number.'); return;
    }
    showFlash('MESSAGE SENT ✓', () =>
      Alert.alert('Thank You', `We'll reach out to you at ${form.phone} within two hours.`)
    );
    setForm({ name: '', email: '', phone: '', message: '', type: 'Private Viewing' });
  };

  const confirmAppt = () => {
    if (!apptF.name.trim()) { Alert.alert('Name Required', 'Please enter your name.'); return; }
    setAp(false);
    showFlash('APPOINTMENT BOOKED ✓', () =>
      Alert.alert('Confirmed ✓', `Your ${apptF.service} is reserved for\n${apptF.date} at ${apptF.time}.\n\nWe look forward to welcoming you!`)
    );
    setAF({ name: '', date: DATES[0], time: TIMES[0], service: SERVICES[0] });
  };

  const openWA  = () => Linking.openURL(WA_URL('Hello Shekhar Raja Jewellers! I would like to get in touch.')).catch(() => Alert.alert('WhatsApp', PHONE));
  const openCall= () => Linking.openURL(`tel:${PHONE}`).catch(() => Alert.alert('Call', PHONE));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>EST. 1987  ◆  JABALPUR, MP</Text>
          <Text style={styles.title}>Get in Touch</Text>
          <Text style={styles.subtitle}>We'd love to hear from you</Text>
        </View>
        <View style={styles.goldLine} />

        {/* ── Primary Contact Buttons ── */}
        <View style={styles.contactBtns}>
          {/* WhatsApp */}
          <TouchableOpacity style={styles.waPrimary} onPress={openWA} activeOpacity={0.88}>
            <View style={styles.waIcon}>
              <Ionicons name="logo-whatsapp" size={26} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.waTitle}>Chat on WhatsApp</Text>
              <Text style={styles.waSub}>Usually replies in minutes</Text>
            </View>
            <Ionicons name="arrow-forward" size={18} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>

          {/* Call */}
          <TouchableOpacity style={styles.callBtn} onPress={openCall} activeOpacity={0.88}>
            <View style={styles.callIcon}>
              <Ionicons name="call" size={22} color={Theme.purple} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.callTitle}>Call Showroom</Text>
              <Text style={styles.callSub}>+91 83779 11745</Text>
            </View>
            <Ionicons name="arrow-forward" size={18} color={Theme.textMuted} />
          </TouchableOpacity>
        </View>

        {/* ── Book Appointment CTA ── */}
        <TouchableOpacity style={styles.apptBtn} onPress={() => setAp(true)} activeOpacity={0.88}>
          <Ionicons name="calendar" size={20} color={Theme.gold} />
          <View style={{ flex: 1 }}>
            <Text style={styles.apptBtnTitle}>Request Private Appointment</Text>
            <Text style={styles.apptBtnSub}>Select date, time & service</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Theme.gold} />
        </TouchableOpacity>

        {/* ── Trust Badges ── */}
        <View style={styles.trustRow}>
          {TRUST_ITEMS.map((t, i) => (
            <View key={i} style={styles.trustCard}>
              <View style={styles.trustIcon}>
                <Ionicons name={t.icon as any} size={20} color={Theme.purple} />
              </View>
              <Text style={styles.trustLabel}>{t.label}</Text>
              <Text style={styles.trustSub}>{t.sub}</Text>
            </View>
          ))}
        </View>

        {/* ── Our Showrooms ── */}
        <Text style={styles.sectionLabel}>OUR SHOWROOMS</Text>
        {LOCATIONS.map((loc, i) => (
          <View key={i} style={styles.showroom}>
            {/* Tag */}
            <View style={styles.showroomTag}>
              <Text style={styles.showroomTagTxt}>{loc.tag}</Text>
            </View>

            <View style={styles.showroomHead}>
              <View style={styles.showroomIconWrap}>
                <Ionicons name="storefront-outline" size={20} color={Theme.purple} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.showroomName}>{loc.name}</Text>
                <Text style={styles.showroomArea}>{loc.area}</Text>
              </View>
            </View>

            {/* Address */}
            <View style={styles.addrCard}>
              <Ionicons name="location-outline" size={16} color={Theme.purple} />
              <View style={{ flex: 1 }}>
                <Text style={styles.showroomAddr}>{loc.address}</Text>
                <Text style={styles.showroomCity}>{loc.city}</Text>
              </View>
            </View>

            {/* Hours */}
            <View style={styles.hoursCard}>
              <Ionicons name="time-outline" size={16} color={Theme.success} />
              <View>
                <Text style={styles.hoursOpen}>Open Now · {loc.hours}</Text>
                <Text style={styles.hoursDays}>{loc.days}</Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.showroomActions}>
              <TouchableOpacity
                style={styles.mapBtn}
                onPress={() => Linking.openURL(loc.mapUrl)}
                activeOpacity={0.85}
              >
                <Ionicons name="navigate" size={16} color="#FFFFFF" />
                <Text style={styles.mapBtnTxt}>Get Directions</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.waShowroomBtn}
                onPress={() => Linking.openURL(WA_URL(`Hello! I'd like to visit your ${loc.name} at ${loc.address}. Please share details.`))}
                activeOpacity={0.85}
              >
                <Ionicons name="logo-whatsapp" size={16} color="#25D366" />
                <Text style={styles.waShowroomTxt}>WhatsApp</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* ── Divider ── */}
        <View style={styles.divider}>
          <View style={styles.divLine} />
          <Text style={styles.divTxt}>SEND A MESSAGE</Text>
          <View style={styles.divLine} />
        </View>

        {/* ── Message Form ── */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>Private Note to Our Concierge</Text>

          {/* Type chips */}
          <View style={styles.typeRow}>
            {MSG_TYPES.map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.typeChip, form.type === t && styles.typeActive]}
                onPress={() => upd('type', t)}
              >
                <Text style={[styles.typeTxt, form.type === t && styles.typeTxtActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputRow}>
            <Ionicons name="person-outline" size={16} color={Theme.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name *"
              placeholderTextColor={Theme.textMuted}
              value={form.name}
              onChangeText={v => upd('name', v)}
            />
          </View>

          <View style={styles.inputRow}>
            <Ionicons name="call-outline" size={16} color={Theme.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number *"
              placeholderTextColor={Theme.textMuted}
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={v => upd('phone', v)}
            />
          </View>

          <View style={styles.inputRow}>
            <Ionicons name="mail-outline" size={16} color={Theme.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor={Theme.textMuted}
              keyboardType="email-address"
              value={form.email}
              onChangeText={v => upd('email', v)}
            />
          </View>

          <TextInput
            style={[styles.inputStandalone, styles.textarea]}
            placeholder="Your requirement or message…"
            placeholderTextColor={Theme.textMuted}
            multiline
            value={form.message}
            onChangeText={v => upd('message', v)}
          />

          <TouchableOpacity style={styles.sendBtn} onPress={submit} activeOpacity={0.88}>
            <Ionicons name="send" size={16} color="#FFFFFF" />
            <Text style={styles.sendTxt}>SEND TO CONCIERGE</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footNote}>
          🔒 Your details are private and handled only by our senior concierge.
          Response guaranteed within two hours during business hours.
        </Text>

      </ScrollView>

      {/* ── Flash Banner ── */}
      {!!flash && (
        <View style={styles.flash}>
          <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
          <Text style={styles.flashText}>{flash}</Text>
        </View>
      )}

      {/* ── Appointment Modal ── */}
      <Modal visible={showAppt} animationType="slide" transparent={false} onRequestClose={() => setAp(false)}>
        <SafeAreaView style={styles.modal} edges={['top', 'bottom']}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setAp(false)} style={styles.modalClose}>
              <Ionicons name="close" size={20} color={Theme.textDark} />
            </TouchableOpacity>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.modalTitle}>Private Appointment</Text>
              <Text style={styles.modalTitleSub}>Shekhar Raja Jewellers</Text>
            </View>
            <View style={{ width: 36 }} />
          </View>
          <View style={styles.goldLine} />

          <ScrollView contentContainerStyle={styles.modalBody} showsVerticalScrollIndicator={false}>
            <View style={styles.modalIntroCard}>
              <Ionicons name="diamond-outline" size={20} color={Theme.purple} />
              <Text style={styles.modalIntro}>
                Our curator will personally host you. Select your preference below and we'll confirm within two hours.
              </Text>
            </View>

            <Text style={styles.modalLabel}>YOUR NAME</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Full Name"
              placeholderTextColor={Theme.textMuted}
              value={apptF.name}
              onChangeText={v => updA('name', v)}
            />

            <Text style={styles.modalLabel}>PREFERRED DATE</Text>
            <View style={styles.slotRow}>
              {DATES.map(d => (
                <TouchableOpacity
                  key={d}
                  style={[styles.slot, apptF.date === d && styles.slotActive]}
                  onPress={() => updA('date', d)}
                >
                  <Text style={[styles.slotTxt, apptF.date === d && styles.slotTxtActive]}>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalLabel}>TIME SLOT</Text>
            <View style={styles.slotRow}>
              {TIMES.map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.slot, apptF.time === t && styles.slotActive]}
                  onPress={() => updA('time', t)}
                >
                  <Text style={[styles.slotTxt, apptF.time === t && styles.slotTxtActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalLabel}>SERVICE REQUIRED</Text>
            <View style={styles.slotRow}>
              {SERVICES.map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.slot, { minWidth: width * 0.42 }, apptF.service === s && styles.slotActive]}
                  onPress={() => updA('service', s)}
                >
                  <Text style={[styles.slotTxt, apptF.service === s && styles.slotTxtActive]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.confirmBtn} onPress={confirmAppt} activeOpacity={0.88}>
              <Ionicons name="calendar-outline" size={18} color={Theme.gold} />
              <Text style={styles.confirmTxt}>CONFIRM APPOINTMENT</Text>
            </TouchableOpacity>

            <Text style={styles.modalFine}>
              A senior curator will personally confirm your appointment within two hours.
            </Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.bgPrimary },
  scroll:    { paddingBottom: 100 },

  // Header
  header: {
    backgroundColor: Theme.bgPurple,
    alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 24, paddingBottom: 24,
  },
  eyebrow:  { color: Theme.gold, fontSize: 11, fontWeight: '800', letterSpacing: 3 },
  title:    { color: '#FFFFFF', fontSize: 32, fontWeight: '900', marginTop: 8, letterSpacing: 0.5 },
  subtitle: { color: Theme.textLightMuted, fontSize: 13, marginTop: 6 },
  goldLine: { height: 3, backgroundColor: Theme.gold },

  // Contact buttons
  contactBtns: { padding: 16, gap: 12 },
  waPrimary: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#25D366', borderRadius: Radius.lg, padding: 18,
    elevation: 5, shadowColor: '#25D366', shadowOpacity: 0.35, shadowRadius: 12,
  },
  waIcon:  { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  waTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  waSub:   { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 2 },

  callBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#FFFFFF', borderRadius: Radius.lg, padding: 18,
    borderWidth: 1.5, borderColor: Theme.purpleBorder,
    elevation: 2, shadowColor: Theme.shadow, shadowOpacity: 0.08, shadowRadius: 8,
  },
  callIcon:  { width: 50, height: 50, borderRadius: 25, backgroundColor: Theme.bgCardPurple, alignItems: 'center', justifyContent: 'center' },
  callTitle: { color: Theme.textDark, fontSize: 16, fontWeight: '800' },
  callSub:   { color: Theme.purple, fontSize: 13, fontWeight: '700', marginTop: 2 },

  // Appointment CTA
  apptBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Theme.bgDark,
    marginHorizontal: 16, marginBottom: 16,
    borderRadius: Radius.lg, padding: 18,
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.3)',
  },
  apptBtnTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  apptBtnSub:   { color: Theme.textLightMuted, fontSize: 11, marginTop: 2 },

  // Trust badges
  trustRow: { flexDirection: 'row', marginHorizontal: 16, gap: 10, marginBottom: 8 },
  trustCard: {
    flex: 1, alignItems: 'center', backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg, paddingVertical: 16,
    borderWidth: 1, borderColor: Theme.border,
    elevation: 1, shadowColor: Theme.shadow, shadowOpacity: 0.05, shadowRadius: 4,
  },
  trustIcon:  { width: 42, height: 42, borderRadius: 21, backgroundColor: Theme.bgCardPurple, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  trustLabel: { color: Theme.textDark, fontSize: 11, fontWeight: '800', textAlign: 'center' },
  trustSub:   { color: Theme.textMuted, fontSize: 9, textAlign: 'center', marginTop: 3, paddingHorizontal: 4 },

  // Section label
  sectionLabel: {
    color: Theme.purple, fontSize: 11, fontWeight: '800',
    letterSpacing: 3, marginHorizontal: 20, marginTop: 20, marginBottom: 12,
  },

  // Showroom cards
  showroom: {
    backgroundColor: '#FFFFFF', marginHorizontal: 16, marginBottom: 14,
    borderRadius: Radius.lg, padding: 18,
    borderWidth: 1, borderColor: Theme.border,
    elevation: 3, shadowColor: Theme.shadow, shadowOpacity: 0.08, shadowRadius: 10,
  },
  showroomTag: {
    alignSelf: 'flex-start', backgroundColor: Theme.bgPurple,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full, marginBottom: 12,
  },
  showroomTagTxt: { color: Theme.gold, fontSize: 9, fontWeight: '900', letterSpacing: 2 },
  showroomHead:   { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  showroomIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: Theme.bgCardPurple, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Theme.purpleBorder },
  showroomName:   { color: Theme.textDark, fontSize: 17, fontWeight: '800' },
  showroomArea:   { color: Theme.purple, fontSize: 12, fontWeight: '700', marginTop: 2 },
  addrCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: Theme.bgPrimary, borderRadius: Radius.md, padding: 12, marginBottom: 10 },
  showroomAddr:   { color: Theme.textDark, fontSize: 13, fontWeight: '600', lineHeight: 19 },
  showroomCity:   { color: Theme.textMuted, fontSize: 12, marginTop: 2 },
  hoursCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#E8F5E9', borderRadius: Radius.md, padding: 10, marginBottom: 14 },
  hoursOpen:  { color: Theme.success, fontSize: 13, fontWeight: '700' },
  hoursDays:  { color: Theme.success, fontSize: 11, marginTop: 1, opacity: 0.8 },
  showroomActions: { flexDirection: 'row', gap: 10 },
  mapBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Theme.bgPurple, paddingVertical: 12, borderRadius: Radius.md,
  },
  mapBtnTxt: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  waShowroomBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#E8FFF2', paddingVertical: 12, borderRadius: Radius.md,
    borderWidth: 1, borderColor: '#25D366',
  },
  waShowroomTxt: { color: '#25D366', fontSize: 13, fontWeight: '800' },

  // Divider
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 16, marginVertical: 22 },
  divLine: { flex: 1, height: 1, backgroundColor: Theme.border },
  divTxt:  { color: Theme.textMuted, fontSize: 10, fontWeight: '800', letterSpacing: 2 },

  // Form
  form: { backgroundColor: '#FFFFFF', marginHorizontal: 16, borderRadius: Radius.lg, padding: 18, borderWidth: 1, borderColor: Theme.border },
  formTitle: { color: Theme.textDark, fontSize: 16, fontWeight: '800', marginBottom: 14 },
  typeRow:   { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  typeChip:  { paddingHorizontal: 12, paddingVertical: 7, backgroundColor: Theme.bgPrimary, borderRadius: Radius.full, borderWidth: 1, borderColor: Theme.border },
  typeActive:    { backgroundColor: Theme.bgPurple, borderColor: Theme.bgPurple },
  typeTxt:       { color: Theme.textMuted, fontSize: 12, fontWeight: '700' },
  typeTxtActive: { color: '#FFFFFF' },

  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Theme.bgPrimary, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Theme.border, marginBottom: 12,
    paddingHorizontal: 14,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: Theme.textDark, fontSize: 15, paddingVertical: 13 },
  inputStandalone: {
    backgroundColor: Theme.bgPrimary, color: Theme.textDark,
    borderRadius: Radius.md, paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 15, borderWidth: 1, borderColor: Theme.border, marginBottom: 14,
  },
  textarea: { height: 110, textAlignVertical: 'top' },
  sendBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Theme.bgPurple, paddingVertical: 16, borderRadius: Radius.md,
  },
  sendTxt: { color: '#FFFFFF', fontSize: 13, fontWeight: '800', letterSpacing: 2 },

  footNote: { color: Theme.textMuted, fontSize: 11, textAlign: 'center', marginTop: 20, marginHorizontal: 20, lineHeight: 18 },

  // Flash
  flash: {
    position: 'absolute', bottom: 36, alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Theme.bgPurple,
    paddingVertical: 12, paddingHorizontal: 24, borderRadius: Radius.full,
    borderWidth: 1, borderColor: Theme.gold,
    elevation: 8, shadowColor: Theme.shadowDark, shadowOpacity: 0.3, shadowRadius: 10,
  },
  flashText: { color: Theme.gold, fontSize: 13, fontWeight: '800', letterSpacing: 1 },

  // Modal
  modal:       { flex: 1, backgroundColor: Theme.bgPrimary },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: Theme.border,
    backgroundColor: Theme.bgPurple,
  },
  modalClose:    { backgroundColor: 'rgba(255,255,255,0.15)', padding: 8, borderRadius: Radius.full },
  modalTitle:    { color: '#FFFFFF', fontSize: 17, fontWeight: '900' },
  modalTitleSub: { color: Theme.textLightMuted, fontSize: 11, marginTop: 2 },
  modalBody:     { padding: 22, paddingBottom: 60 },
  modalIntroCard:{ flexDirection: 'row', gap: 12, alignItems: 'flex-start', backgroundColor: Theme.bgCardPurple, borderRadius: Radius.md, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: Theme.purpleBorder },
  modalIntro:    { flex: 1, color: Theme.textDark, fontSize: 13, lineHeight: 20 },
  modalLabel:    { color: Theme.purple, fontSize: 11, fontWeight: '800', letterSpacing: 2.5, marginTop: 18, marginBottom: 10 },
  modalInput:    { backgroundColor: '#FFFFFF', color: Theme.textDark, borderRadius: Radius.md, paddingHorizontal: 14, paddingVertical: 14, fontSize: 15, borderWidth: 1, borderColor: Theme.border },
  slotRow:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slot:          { paddingVertical: 10, paddingHorizontal: 16, backgroundColor: '#FFFFFF', borderRadius: Radius.md, borderWidth: 1, borderColor: Theme.border, marginBottom: 4 },
  slotActive:    { backgroundColor: Theme.bgPurple, borderColor: Theme.bgPurple },
  slotTxt:       { color: Theme.textMuted, fontSize: 13, fontWeight: '700' },
  slotTxtActive: { color: '#FFFFFF' },
  confirmBtn:    {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Theme.bgPurple, paddingVertical: 18, borderRadius: Radius.lg, alignItems: 'center', marginTop: 28,
  },
  confirmTxt:    { color: Theme.gold, fontSize: 14, fontWeight: '900', letterSpacing: 2 },
  modalFine:     { color: Theme.textMuted, fontSize: 11, textAlign: 'center', marginTop: 14, lineHeight: 18 },
});
