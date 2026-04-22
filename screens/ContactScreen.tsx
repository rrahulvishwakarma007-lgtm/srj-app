import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Modal, Alert, Dimensions, Linking, Image,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { saveEnquiry, saveAppointment } from '../lib/firestore';

const { width: W } = Dimensions.get('window');

const GOLD        = '#C9A84C';
const GOLD_LIGHT  = '#F0D080';
const PURPLE_DARK = '#2D1B5E';
const PURPLE_MID  = '#4A2080';
const BG          = '#F0EBFF';
const BG_CARD     = '#FFFFFF';
const BORDER      = '#DDD5F0';
const TEXT_DARK   = '#1A0A3E';
const TEXT_MID    = '#4A3570';
const TEXT_LIGHT  = '#8B7BAF';
const WHATSAPP    = '#25D366';
const GREEN       = '#16a34a';

const PHONE  = '+918377911745';
const WA_NUM = '918377911745';
const WA_URL = (msg: string) => `https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`;

// Fallback images if Firebase fails
const FALLBACK_IMAGES = [
  'https://shekharrajajewellers.com/wp-content/uploads/2026/01/IMG_20260111_125559.jpg',
  'https://shekharrajajewellers.com/wp-content/uploads/2026/01/IMG_20260111_125632.jpg',
];

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

const SERVICES  = ['Private Viewing', 'Bespoke Design', 'Valuation', 'Wedding & Trousseau'];
const DATES     = ['Tomorrow', 'Day after', 'This Friday', 'Next Monday'];
const TIMES     = ['11:00 AM', '1:30 PM', '3:00 PM', '5:00 PM'];
const MSG_TYPES = ['Private Viewing', 'Custom Order', 'Valuation', 'Feedback'];

const TRUST = [
  { icon: 'shield-checkmark', label: 'BIS Hallmarked',  sub: 'All jewellery certified' },
  { icon: 'refresh',          label: 'Easy Exchange',   sub: 'Lifetime exchange policy' },
  { icon: 'star',             label: 'Est. 1987',       sub: '37+ years of trust' },
];

export default function ContactScreen() {
  const insets = useSafeAreaInsets();

  // State
  const [form, setForm]         = useState({ name: '', email: '', phone: '', message: '', type: 'Private Viewing' });
  const [showAppt, setShowAppt] = useState(false);
  const [apptF, setApptF]       = useState({ name: '', phone: '', date: DATES[0], time: TIMES[0], service: SERVICES[0] });
  const [flash, setFlash]       = useState('');
  const [imgIdx, setImgIdx]     = useState(0);
  const [images, setImages]     = useState<string[]>(FALLBACK_IMAGES);
  const [imgLoading, setImgLoading] = useState(true);
  const [saving, setSaving]     = useState(false);

  // Fetch showroom images from Firebase contact collection
  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'contact'));
        const urls: string[] = [];
        snap.forEach(doc => {
          const data = doc.data();
          // Each doc may have image, image2, image3 etc.
          Object.keys(data).forEach(key => {
            if (key.startsWith('image') && typeof data[key] === 'string') {
              urls.push(data[key]);
            }
          });
        });
        if (urls.length > 0) setImages(urls);
      } catch (e) {
        console.warn('Could not fetch contact images:', e);
        // Keep fallback images
      } finally {
        setImgLoading(false);
      }
    })();
  }, []);

  const upd  = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const updA = (k: string, v: string) => setApptF(f => ({ ...f, [k]: v }));

  const showFlash = (msg: string) => {
    setFlash(msg);
    setTimeout(() => setFlash(''), 2000);
  };

  // Submit enquiry — saves to Firestore AND opens WhatsApp
  const submit = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      Alert.alert('Required', 'Please enter your name and phone number.');
      return;
    }
    setSaving(true);
    try {
      // Save to Firebase Firestore
      await saveEnquiry({
        name:    form.name,
        phone:   form.phone,
        email:   form.email,
        type:    form.type,
        message: form.message,
      });
      // Also open WhatsApp
      const msg = `Hello! I'm ${form.name} (${form.phone}). Enquiry type: ${form.type}. ${form.message}`;
      Linking.openURL(WA_URL(msg));
      showFlash('ENQUIRY SAVED ✓');
      setForm({ name: '', email: '', phone: '', message: '', type: 'Private Viewing' });
    } catch (e) {
      // Even if Firebase fails, still open WhatsApp
      const msg = `Hello! I'm ${form.name} (${form.phone}). Enquiry type: ${form.type}. ${form.message}`;
      Linking.openURL(WA_URL(msg));
      showFlash('MESSAGE SENT ✓');
    } finally {
      setSaving(false);
    }
  };

  // Confirm appointment — saves to Firestore AND opens WhatsApp
  const confirmAppt = async () => {
    if (!apptF.name.trim()) { Alert.alert('Name Required', 'Please enter your name.'); return; }
    setSaving(true);
    try {
      await saveAppointment({
        name:    apptF.name,
        phone:   apptF.phone,
        date:    apptF.date,
        time:    apptF.time,
        service: apptF.service,
      });
    } catch (e) {
      console.warn('saveAppointment error:', e);
    } finally {
      setSaving(false);
    }
    const msg = `Hello! I'd like to book a ${apptF.service} appointment.\nName: ${apptF.name}\nPhone: ${apptF.phone}\nDate: ${apptF.date}\nTime: ${apptF.time}`;
    setShowAppt(false);
    Linking.openURL(WA_URL(msg));
    showFlash('APPOINTMENT BOOKED ✓');
    setApptF({ name: '', phone: '', date: DATES[0], time: TIMES[0], service: SERVICES[0] });
  };

  const openWA   = () => Linking.openURL(WA_URL('Hello Shekhar Raja Jewellers! I would like to get in touch.'));
  const openCall = () => Linking.openURL(`tel:${PHONE}`);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerEst}>EST. 1987  ◆  JABALPUR, MP</Text>
          <Text style={styles.headerTitle}>Get in Touch</Text>
          <Text style={styles.headerSub}>We'd love to hear from you</Text>
        </View>
        <View style={styles.headerIcon}>
          <Ionicons name="storefront" size={26} color={GOLD} />
        </View>
      </View>
      <View style={styles.goldLine} />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >

        {/* ── SHOWROOM IMAGES (from Firebase) ── */}
        <View style={styles.imgSection}>
          {imgLoading ? (
            <View style={styles.imgPlaceholder}>
              <ActivityIndicator color={GOLD} size="small" />
              <Text style={styles.imgLoadingText}>Loading showroom photos...</Text>
            </View>
          ) : (
            <>
              {/* Thumbnails row */}
              <View style={styles.imgRow}>
                {images.map((uri, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[styles.imgThumb, imgIdx === i && styles.imgThumbActive]}
                    onPress={() => setImgIdx(i)}
                    activeOpacity={0.85}
                  >
                    <Image source={{ uri }} style={styles.thumbImg} resizeMode="cover" />
                    {imgIdx === i && (
                      <View style={styles.imgActiveDot}>
                        <Ionicons name="eye" size={11} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Main large image */}
              <View style={styles.imgMainWrap}>
                <Image
                  source={{ uri: images[imgIdx] }}
                  style={styles.imgMain}
                  resizeMode="cover"
                />
                <View style={styles.imgOverlay}>
                  <View style={styles.imgOverlayLeft}>
                    <Ionicons name="storefront" size={14} color={GOLD} style={{ marginRight: 6 }} />
                    <Text style={styles.imgOverlayText}>Shekhar Raja Jewellers</Text>
                  </View>
                  <Text style={styles.imgOverlaySubText}>Jabalpur, MP</Text>
                </View>
                {/* Firebase badge */}
                <View style={styles.firebaseBadge}>
                  <Ionicons name="cloud-done" size={11} color={GOLD} />
                  <Text style={styles.firebaseBadgeText}>Live from Firebase</Text>
                </View>
                {/* Image counter */}
                <View style={styles.imgCounter}>
                  <Text style={styles.imgCounterText}>{imgIdx + 1} / {images.length}</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* ── PRIMARY CONTACT BUTTONS ── */}
        <View style={styles.contactBtns}>
          <TouchableOpacity style={styles.waBtn} onPress={openWA} activeOpacity={0.88}>
            <View style={styles.waIconWrap}>
              <Ionicons name="logo-whatsapp" size={26} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.waTitle}>Chat on WhatsApp</Text>
              <Text style={styles.waSub}>Usually replies in minutes</Text>
            </View>
            <Ionicons name="arrow-forward" size={18} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.callBtn} onPress={openCall} activeOpacity={0.88}>
            <View style={styles.callIconWrap}>
              <Ionicons name="call" size={22} color={PURPLE_MID} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.callTitle}>Call Showroom</Text>
              <Text style={styles.callSub}>+91 83779 11745</Text>
            </View>
            <Ionicons name="arrow-forward" size={18} color={TEXT_LIGHT} />
          </TouchableOpacity>
        </View>

        {/* ── BOOK APPOINTMENT ── */}
        <TouchableOpacity
          style={styles.apptBtn}
          onPress={() => setShowAppt(true)}
          activeOpacity={0.88}
        >
          <Ionicons name="calendar" size={22} color={GOLD} />
          <View style={{ flex: 1 }}>
            <Text style={styles.apptTitle}>Request Private Appointment</Text>
            <Text style={styles.apptSub}>Saved to our system + confirmed on WhatsApp</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={GOLD} />
        </TouchableOpacity>

        {/* ── TRUST BADGES ── */}
        <View style={styles.trustRow}>
          {TRUST.map((t, i) => (
            <View key={i} style={styles.trustCard}>
              <View style={styles.trustIcon}>
                <Ionicons name={t.icon as any} size={20} color={PURPLE_MID} />
              </View>
              <Text style={styles.trustLabel}>{t.label}</Text>
              <Text style={styles.trustSub}>{t.sub}</Text>
            </View>
          ))}
        </View>

        {/* ── SHOWROOM LOCATIONS ── */}
        <Text style={styles.sectionLabel}>OUR SHOWROOMS</Text>
        {LOCATIONS.map((loc, i) => (
          <View key={i} style={styles.showroom}>
            <View style={styles.showroomTagWrap}>
              <Text style={styles.showroomTag}>{loc.tag}</Text>
            </View>
            <View style={styles.showroomHead}>
              <View style={styles.showroomIconWrap}>
                <Ionicons name="storefront-outline" size={20} color={PURPLE_MID} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.showroomName}>{loc.name}</Text>
                <Text style={styles.showroomArea}>{loc.area}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={15} color={PURPLE_MID} />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoText}>{loc.address}</Text>
                <Text style={styles.infoSub}>{loc.city}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={15} color={GREEN} />
              <View>
                <Text style={[styles.infoText, { color: GREEN }]}>Open · {loc.hours}</Text>
                <Text style={styles.infoSub}>{loc.days}</Text>
              </View>
            </View>
            <View style={styles.showroomActions}>
              <TouchableOpacity
                style={styles.dirBtn}
                onPress={() => Linking.openURL(loc.mapUrl)}
                activeOpacity={0.85}
              >
                <Ionicons name="navigate" size={15} color="#fff" />
                <Text style={styles.dirBtnText}>Directions</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.waSmallBtn}
                onPress={() => Linking.openURL(WA_URL(`Hello! I'd like to visit your ${loc.name} at ${loc.address}.`))}
                activeOpacity={0.85}
              >
                <Ionicons name="logo-whatsapp" size={15} color={WHATSAPP} />
                <Text style={styles.waSmallText}>WhatsApp</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* ── MESSAGE FORM ── */}
        <View style={styles.formDivider}>
          <View style={styles.divLine} />
          <Text style={styles.divText}>SEND A MESSAGE</Text>
          <View style={styles.divLine} />
        </View>

        <View style={styles.form}>
          <View style={styles.formTitleRow}>
            <Text style={styles.formTitle}>Private Note to Our Concierge</Text>
            <View style={styles.savedBadge}>
              <Ionicons name="cloud-done" size={11} color={GREEN} />
              <Text style={styles.savedBadgeText}>Saved to Firebase</Text>
            </View>
          </View>

          <View style={styles.typeRow}>
            {MSG_TYPES.map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.typeChip, form.type === t && styles.typeActive]}
                onPress={() => upd('type', t)}
              >
                <Text style={[styles.typeText, form.type === t && styles.typeTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputRow}>
            <Ionicons name="person-outline" size={16} color={TEXT_LIGHT} style={{ marginRight: 10 }} />
            <TextInput
              style={styles.inputField}
              placeholder="Full Name *"
              placeholderTextColor={TEXT_LIGHT}
              value={form.name}
              onChangeText={v => upd('name', v)}
            />
          </View>
          <View style={styles.inputRow}>
            <Ionicons name="call-outline" size={16} color={TEXT_LIGHT} style={{ marginRight: 10 }} />
            <TextInput
              style={styles.inputField}
              placeholder="Phone Number *"
              placeholderTextColor={TEXT_LIGHT}
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={v => upd('phone', v)}
            />
          </View>
          <View style={styles.inputRow}>
            <Ionicons name="mail-outline" size={16} color={TEXT_LIGHT} style={{ marginRight: 10 }} />
            <TextInput
              style={styles.inputField}
              placeholder="Email Address"
              placeholderTextColor={TEXT_LIGHT}
              keyboardType="email-address"
              value={form.email}
              onChangeText={v => upd('email', v)}
            />
          </View>
          <TextInput
            style={styles.textarea}
            placeholder="Your requirement or message…"
            placeholderTextColor={TEXT_LIGHT}
            multiline
            numberOfLines={4}
            value={form.message}
            onChangeText={v => upd('message', v)}
          />

          <TouchableOpacity
            style={[styles.sendBtn, saving && styles.sendBtnDisabled]}
            onPress={submit}
            activeOpacity={0.88}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={GOLD} size="small" style={{ marginRight: 8 }} />
            ) : (
              <Ionicons name="send" size={16} color={GOLD} style={{ marginRight: 8 }} />
            )}
            <Text style={styles.sendText}>{saving ? 'SAVING...' : 'SEND TO CONCIERGE'}</Text>
          </TouchableOpacity>

          <Text style={styles.footNote}>
            🔒 Your details are saved securely to Firebase and handled only by our senior concierge. Response guaranteed within 2 hours.
          </Text>
        </View>
      </ScrollView>

      {/* ── FLASH BANNER ── */}
      {!!flash && (
        <View style={styles.flash}>
          <Ionicons name="checkmark-circle" size={18} color={GOLD} style={{ marginRight: 6 }} />
          <Text style={styles.flashText}>{flash}</Text>
        </View>
      )}

      {/* ── APPOINTMENT MODAL ── */}
      <Modal
        visible={showAppt}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowAppt(false)}
      >
        <View style={[styles.modal, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAppt(false)} style={styles.modalClose}>
              <Ionicons name="close" size={22} color={TEXT_DARK} />
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
              <Ionicons name="diamond-outline" size={20} color={PURPLE_MID} />
              <Text style={styles.modalIntro}>
                Our curator will personally host you. Your booking is saved to our system and confirmed on WhatsApp within 2 hours.
              </Text>
            </View>

            <Text style={styles.modalLabel}>YOUR NAME</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Full Name"
              placeholderTextColor={TEXT_LIGHT}
              value={apptF.name}
              onChangeText={v => updA('name', v)}
            />

            <Text style={styles.modalLabel}>YOUR PHONE</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Phone Number"
              placeholderTextColor={TEXT_LIGHT}
              keyboardType="phone-pad"
              value={apptF.phone}
              onChangeText={v => updA('phone', v)}
            />

            <Text style={styles.modalLabel}>PREFERRED DATE</Text>
            <View style={styles.slotRow}>
              {DATES.map(d => (
                <TouchableOpacity
                  key={d}
                  style={[styles.slot, apptF.date === d && styles.slotActive]}
                  onPress={() => updA('date', d)}
                >
                  <Text style={[styles.slotText, apptF.date === d && styles.slotTextActive]}>{d}</Text>
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
                  <Text style={[styles.slotText, apptF.time === t && styles.slotTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalLabel}>SERVICE REQUIRED</Text>
            <View style={styles.slotRow}>
              {SERVICES.map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.slot, { minWidth: W * 0.42 }, apptF.service === s && styles.slotActive]}
                  onPress={() => updA('service', s)}
                >
                  <Text style={[styles.slotText, apptF.service === s && styles.slotTextActive]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.confirmBtn, saving && styles.sendBtnDisabled]}
              onPress={confirmAppt}
              activeOpacity={0.88}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" size="small" style={{ marginRight: 8 }} />
              ) : (
                <Ionicons name="logo-whatsapp" size={20} color="#fff" style={{ marginRight: 8 }} />
              )}
              <Text style={styles.confirmText}>
                {saving ? 'SAVING...' : 'CONFIRM ON WHATSAPP'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.modalFine}>
              Your appointment is saved to Firebase and a senior curator will confirm within 2 hours.
            </Text>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root:     { flex: 1, backgroundColor: PURPLE_DARK },
  scroll:   { flex: 1, backgroundColor: BG },
  goldLine: { height: 3, backgroundColor: GOLD },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: PURPLE_DARK, paddingHorizontal: 16, paddingVertical: 16,
  },
  headerEst:   { color: GOLD, fontSize: 10, fontWeight: '800', letterSpacing: 3 },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '900', marginTop: 4 },
  headerSub:   { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 },
  headerIcon: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(201,168,76,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },

  // Images
  imgSection:      { backgroundColor: BG_CARD, padding: 14, borderBottomWidth: 1, borderBottomColor: BORDER },
  imgPlaceholder:  { height: 120, alignItems: 'center', justifyContent: 'center', gap: 8 },
  imgLoadingText:  { color: TEXT_LIGHT, fontSize: 12 },
  imgRow:          { flexDirection: 'row', gap: 10, marginBottom: 10 },
  imgThumb:        { flex: 1, borderRadius: 10, overflow: 'hidden', borderWidth: 2, borderColor: BORDER },
  imgThumbActive:  { borderColor: GOLD },
  thumbImg:        { width: '100%', height: 70 },
  imgActiveDot: {
    position: 'absolute', top: 5, right: 5,
    backgroundColor: GOLD, borderRadius: 9,
    width: 18, height: 18, alignItems: 'center', justifyContent: 'center',
  },
  imgMainWrap:      { borderRadius: 14, overflow: 'hidden', position: 'relative' },
  imgMain:          { width: '100%', height: 210 },
  imgOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(45,27,94,0.65)', padding: 12,
  },
  imgOverlayLeft:    { flexDirection: 'row', alignItems: 'center' },
  imgOverlayText:    { color: '#fff', fontSize: 13, fontWeight: '800' },
  imgOverlaySubText: { color: GOLD_LIGHT, fontSize: 11, marginTop: 3 },
  firebaseBadge: {
    position: 'absolute', top: 10, left: 10,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(45,27,94,0.75)', borderRadius: 99,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  firebaseBadgeText: { color: GOLD, fontSize: 9, fontWeight: '700' },
  imgCounter: {
    position: 'absolute', top: 10, right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 99,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  imgCounterText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  // Contact buttons
  contactBtns: { padding: 16, gap: 12, backgroundColor: BG },
  waBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: WHATSAPP, borderRadius: 16, padding: 16,
    elevation: 4, shadowColor: WHATSAPP, shadowOpacity: 0.3, shadowRadius: 8,
  },
  waIconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  waTitle:    { color: '#fff', fontSize: 16, fontWeight: '800' },
  waSub:      { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },
  callBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: BG_CARD, borderRadius: 16, padding: 16,
    borderWidth: 1.5, borderColor: BORDER,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6,
  },
  callIconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#EDE8F5', alignItems: 'center', justifyContent: 'center' },
  callTitle:    { color: TEXT_DARK, fontSize: 16, fontWeight: '800' },
  callSub:      { color: PURPLE_MID, fontSize: 13, fontWeight: '700', marginTop: 2 },

  apptBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: PURPLE_DARK, marginHorizontal: 16, marginBottom: 16,
    borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.35)',
  },
  apptTitle: { color: '#fff', fontSize: 15, fontWeight: '800' },
  apptSub:   { color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 2 },

  trustRow: { flexDirection: 'row', marginHorizontal: 16, gap: 10, marginBottom: 8 },
  trustCard: {
    flex: 1, alignItems: 'center', backgroundColor: BG_CARD,
    borderRadius: 14, paddingVertical: 14,
    borderWidth: 1, borderColor: BORDER,
  },
  trustIcon:  { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EDE8F5', alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  trustLabel: { color: TEXT_DARK, fontSize: 10, fontWeight: '800', textAlign: 'center' },
  trustSub:   { color: TEXT_LIGHT, fontSize: 9, textAlign: 'center', marginTop: 2, paddingHorizontal: 4 },

  sectionLabel: {
    color: PURPLE_MID, fontSize: 11, fontWeight: '800',
    letterSpacing: 3, marginHorizontal: 16, marginTop: 16, marginBottom: 10,
  },

  showroom: {
    backgroundColor: BG_CARD, marginHorizontal: 16, marginBottom: 12,
    borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: BORDER,
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 8,
  },
  showroomTagWrap:  { alignSelf: 'flex-start', backgroundColor: PURPLE_DARK, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99, marginBottom: 10 },
  showroomTag:      { color: GOLD, fontSize: 9, fontWeight: '900', letterSpacing: 2 },
  showroomHead:     { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  showroomIconWrap: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#EDE8F5', alignItems: 'center', justifyContent: 'center' },
  showroomName:     { color: TEXT_DARK, fontSize: 16, fontWeight: '800' },
  showroomArea:     { color: PURPLE_MID, fontSize: 12, fontWeight: '700', marginTop: 2 },
  infoRow:          { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: BG, borderRadius: 10, padding: 10, marginBottom: 8 },
  infoText:         { color: TEXT_DARK, fontSize: 13, fontWeight: '600' },
  infoSub:          { color: TEXT_LIGHT, fontSize: 11, marginTop: 2 },
  showroomActions:  { flexDirection: 'row', gap: 10, marginTop: 4 },
  dirBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: PURPLE_MID, borderRadius: 12, paddingVertical: 10,
  },
  dirBtnText:  { color: '#fff', fontSize: 13, fontWeight: '700' },
  waSmallBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: BG_CARD, borderRadius: 12, paddingVertical: 10,
    borderWidth: 1.5, borderColor: WHATSAPP,
  },
  waSmallText: { color: WHATSAPP, fontSize: 13, fontWeight: '700' },

  formDivider: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 20, marginBottom: 4 },
  divLine:     { flex: 1, height: 1, backgroundColor: BORDER },
  divText:     { color: TEXT_LIGHT, fontSize: 11, fontWeight: '700', letterSpacing: 2, marginHorizontal: 10 },

  form:      { marginHorizontal: 16, marginTop: 12, backgroundColor: BG_CARD, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: BORDER },
  formTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  formTitle: { color: TEXT_DARK, fontSize: 15, fontWeight: '800' },
  savedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#dcfce7', borderRadius: 99,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  savedBadgeText: { color: GREEN, fontSize: 9, fontWeight: '700' },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  typeChip: {
    paddingHorizontal: 12, paddingVertical: 6,
    backgroundColor: BG, borderRadius: 99, borderWidth: 1, borderColor: BORDER,
  },
  typeActive:     { backgroundColor: PURPLE_DARK, borderColor: PURPLE_DARK },
  typeText:       { color: TEXT_MID, fontSize: 12, fontWeight: '700' },
  typeTextActive: { color: '#fff' },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: BG, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1, borderColor: BORDER, marginBottom: 10,
  },
  inputField: { flex: 1, fontSize: 14, color: TEXT_DARK },
  textarea: {
    backgroundColor: BG, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1, borderColor: BORDER,
    fontSize: 14, color: TEXT_DARK,
    minHeight: 90, textAlignVertical: 'top', marginBottom: 14,
  },
  sendBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: PURPLE_DARK, borderRadius: 28, paddingVertical: 14,
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.4)',
  },
  sendBtnDisabled: { opacity: 0.6 },
  sendText:  { color: GOLD, fontSize: 14, fontWeight: '900', letterSpacing: 1 },
  footNote:  { color: TEXT_LIGHT, fontSize: 11, textAlign: 'center', marginTop: 12, lineHeight: 17 },

  flash: {
    position: 'absolute', bottom: 30, alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: PURPLE_DARK, paddingVertical: 10, paddingHorizontal: 20,
    borderRadius: 24, borderWidth: 1, borderColor: GOLD,
  },
  flashText: { color: GOLD, fontSize: 13, fontWeight: '700' },

  modal:       { flex: 1, backgroundColor: BG },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: BG_CARD, paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: BORDER,
  },
  modalClose:    { width: 36, height: 36, borderRadius: 18, backgroundColor: BG, alignItems: 'center', justifyContent: 'center' },
  modalTitle:    { color: TEXT_DARK, fontSize: 17, fontWeight: '800' },
  modalTitleSub: { color: GOLD, fontSize: 11, fontWeight: '700', marginTop: 2 },
  modalBody:     { padding: 20, paddingBottom: 40 },
  modalIntroCard:{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: BG_CARD, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: BORDER, marginBottom: 20 },
  modalIntro:    { flex: 1, color: TEXT_MID, fontSize: 13, lineHeight: 20 },
  modalLabel:    { color: PURPLE_MID, fontSize: 11, fontWeight: '800', letterSpacing: 2, marginBottom: 8, marginTop: 16 },
  modalInput: {
    backgroundColor: BG_CARD, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1, borderColor: BORDER, fontSize: 14, color: TEXT_DARK,
    marginBottom: 4,
  },
  slotRow:        { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slot:           { paddingHorizontal: 14, paddingVertical: 9, backgroundColor: BG_CARD, borderRadius: 99, borderWidth: 1, borderColor: BORDER },
  slotActive:     { backgroundColor: PURPLE_DARK, borderColor: PURPLE_DARK },
  slotText:       { color: TEXT_MID, fontSize: 13, fontWeight: '600' },
  slotTextActive: { color: '#fff', fontWeight: '700' },
  confirmBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: WHATSAPP, borderRadius: 28, paddingVertical: 15, marginTop: 24,
  },
  confirmText: { color: '#fff', fontSize: 15, fontWeight: '900', letterSpacing: 0.5 },
  modalFine:   { color: TEXT_LIGHT, fontSize: 11, textAlign: 'center', marginTop: 14, lineHeight: 17 },
});
