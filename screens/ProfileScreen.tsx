import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Linking, Alert, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Theme, Radius } from '../lib/theme';

const WHATSAPP = '918377911745';
const CALL_NO  = 'tel:+918377911745';

const MENU_ITEMS = [
  { icon: 'heart-outline',         label: 'My Wishlist',        },
  { icon: 'time-outline',          label: 'Enquiry History',    },
  { icon: 'calendar-outline',      label: 'My Appointments',    },
  { icon: 'notifications-outline', label: 'Notifications',      },
  { icon: 'shield-checkmark-outline', label: 'BIS Hallmark Info',},
  { icon: 'information-circle-outline', label: 'About SRJ',     },
];

export default function ProfileScreen() {
  const [mode, setMode]     = useState<'login' | 'signup'>('login');
  const [loggedIn, setLogin]= useState(false);
  const [form, setForm]     = useState({ name: '', phone: '', email: '', pass: '' });
  const [notif, setNotif]   = useState(true);

  const upd = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.phone.trim()) { Alert.alert('Required', 'Please enter your phone number.'); return; }
    setLogin(true);
    Alert.alert(
      mode === 'login' ? 'Welcome Back!' : 'Account Created!',
      `You are now signed in to Shekhar Raja Jewellers, ${form.name || 'valued customer'}.`
    );
  };

  const openWhatsApp = () =>
    Linking.openURL(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hello Shekhar Raja Jewellers!')}`)
      .catch(() => Alert.alert('WhatsApp', `+${WHATSAPP}`));

  const openCall = () => Linking.openURL(CALL_NO).catch(() => Alert.alert('Call', `+${WHATSAPP}`));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>SHEKHAR RAJA JEWELLERS</Text>
          <Text style={styles.title}>My Account</Text>
        </View>
        <View style={styles.goldLine} />

        {/* ── Profile Avatar / Welcome ── */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Ionicons name={loggedIn ? 'person' : 'person-outline'} size={40} color={Theme.gold} />
          </View>
          {loggedIn ? (
            <View style={{ alignItems: 'center', marginTop: 12 }}>
              <Text style={styles.welcomeName}>Welcome, {form.name || 'Valued Customer'}</Text>
              <Text style={styles.welcomeSub}>{form.phone}</Text>
              <TouchableOpacity onPress={() => setLogin(false)} style={styles.logoutBtn}>
                <Text style={styles.logoutTxt}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ alignItems: 'center', marginTop: 12 }}>
              <Text style={styles.welcomeName}>Welcome to SRJ</Text>
              <Text style={styles.welcomeSub}>Sign in to manage your wishlist & appointments</Text>
            </View>
          )}
        </View>

        {/* ── Auth Form (if not logged in) ── */}
        {!loggedIn && (
          <View style={styles.card}>
            {/* Tab switcher */}
            <View style={styles.tabRow}>
              {(['login', 'signup'] as const).map(m => (
                <TouchableOpacity
                  key={m}
                  style={[styles.tab, mode === m && styles.tabActive]}
                  onPress={() => setMode(m)}
                >
                  <Text style={[styles.tabTxt, mode === m && styles.tabTxtActive]}>
                    {m === 'login' ? 'Login' : 'Sign Up'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {mode === 'signup' && (
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor={Theme.textMuted}
                value={form.name}
                onChangeText={v => upd('name', v)}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Phone Number *"
              placeholderTextColor={Theme.textMuted}
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={v => upd('phone', v)}
            />

            {mode === 'signup' && (
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor={Theme.textMuted}
                keyboardType="email-address"
                value={form.email}
                onChangeText={v => upd('email', v)}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={Theme.textMuted}
              secureTextEntry
              value={form.pass}
              onChangeText={v => upd('pass', v)}
            />

            <TouchableOpacity style={styles.primaryBtn} onPress={submit} activeOpacity={0.88}>
              <Text style={styles.primaryBtnTxt}>
                {mode === 'login' ? 'LOGIN' : 'CREATE ACCOUNT'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Contact Us ── */}
        <Text style={styles.sectionLabel}>CONTACT US</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.waBtn} onPress={openWhatsApp} activeOpacity={0.88}>
            <Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" />
            <View>
              <Text style={styles.waBtnTitle}>Chat on WhatsApp</Text>
              <Text style={styles.waBtnSub}>Fastest response — usually within minutes</Text>
            </View>
            <Ionicons name="arrow-forward" size={16} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.callBtn} onPress={openCall} activeOpacity={0.88}>
            <Ionicons name="call" size={18} color={Theme.purple} />
            <Text style={styles.callBtnTxt}>Call Showroom  +91 83779 11745</Text>
          </TouchableOpacity>
        </View>

        {/* ── Quick Menu ── */}
        <Text style={styles.sectionLabel}>QUICK ACCESS</Text>
        <View style={styles.card}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.menuRow, i < MENU_ITEMS.length - 1 && styles.menuBorder]}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIcon}>
                  <Ionicons name={item.icon as any} size={18} color={Theme.purple} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Theme.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Preferences ── */}
        <Text style={styles.sectionLabel}>PREFERENCES</Text>
        <View style={styles.card}>
          <View style={styles.prefRow}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIcon}>
                <Ionicons name="notifications-outline" size={18} color={Theme.purple} />
              </View>
              <View>
                <Text style={styles.menuLabel}>Push Notifications</Text>
                <Text style={styles.prefSub}>Gold rate alerts & offers</Text>
              </View>
            </View>
            <Switch
              value={notif}
              onValueChange={setNotif}
              trackColor={{ false: Theme.border, true: Theme.purpleLight }}
              thumbColor={notif ? Theme.purple : '#ccc'}
            />
          </View>

          {[
            { label: 'Currency',    value: 'INR (₹)',  icon: 'cash-outline' },
            { label: 'Language',    value: 'English',  icon: 'language-outline' },
            { label: 'App Version', value: 'v2.1.0',   icon: 'information-circle-outline' },
          ].map((p, i) => (
            <View key={i} style={[styles.prefRow, styles.menuBorder]}>
              <View style={styles.menuLeft}>
                <View style={styles.menuIcon}>
                  <Ionicons name={p.icon as any} size={18} color={Theme.purple} />
                </View>
                <Text style={styles.menuLabel}>{p.label}</Text>
              </View>
              <Text style={styles.prefValue}>{p.value}</Text>
            </View>
          ))}
        </View>

        {/* ── Store Info strip ── */}
        <View style={styles.storeStrip}>
          <Ionicons name="diamond" size={16} color={Theme.gold} />
          <Text style={styles.storeStripText}>
            Shekhar Raja Jewellers · Est. 1987 · Jabalpur, MP
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.bgPrimary },
  scroll:    { paddingBottom: 90 },

  // Header
  header: {
    backgroundColor: Theme.bgPurple,
    paddingHorizontal: 20, paddingTop: 18, paddingBottom: 18,
  },
  eyebrow: { color: Theme.gold, fontSize: 10, fontWeight: '800', letterSpacing: 2.5, marginBottom: 4 },
  title:   { color: '#FFFFFF', fontSize: 28, fontWeight: '900' },
  goldLine:{ height: 3, backgroundColor: Theme.gold },

  // Avatar section
  avatarSection: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: Theme.border,
  },
  avatarCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Theme.bgCardPurple,
    borderWidth: 2, borderColor: Theme.purpleBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  welcomeName: { color: Theme.textDark, fontSize: 18, fontWeight: '800', marginTop: 4 },
  welcomeSub:  { color: Theme.textMuted, fontSize: 13, marginTop: 4, textAlign: 'center', paddingHorizontal: 30 },
  logoutBtn:   { marginTop: 10, paddingHorizontal: 20, paddingVertical: 7, borderRadius: Radius.full, backgroundColor: Theme.bgPrimary, borderWidth: 1, borderColor: Theme.border },
  logoutTxt:   { color: Theme.textMuted, fontSize: 13, fontWeight: '700' },

  // Section label
  sectionLabel: {
    color: Theme.purple, fontSize: 11, fontWeight: '800',
    letterSpacing: 3, marginHorizontal: 16, marginTop: 22, marginBottom: 10,
  },

  // Cards
  card: {
    backgroundColor: '#FFFFFF', marginHorizontal: 16,
    borderRadius: Radius.lg, padding: 18,
    borderWidth: 1, borderColor: Theme.border,
    elevation: 2, shadowColor: Theme.shadow, shadowOpacity: 0.07, shadowRadius: 8,
  },

  // Auth tabs
  tabRow: { flexDirection: 'row', backgroundColor: Theme.bgPrimary, borderRadius: Radius.md, padding: 4, marginBottom: 16 },
  tab:    { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: Radius.sm },
  tabActive:   { backgroundColor: Theme.bgPurple },
  tabTxt:      { color: Theme.textMuted, fontWeight: '700', fontSize: 14 },
  tabTxtActive:{ color: '#FFFFFF' },

  input: {
    backgroundColor: Theme.bgPrimary, color: Theme.textDark,
    borderRadius: Radius.md, paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 15, borderWidth: 1, borderColor: Theme.border, marginBottom: 12,
  },
  primaryBtn: {
    backgroundColor: Theme.bgPurple, paddingVertical: 16,
    borderRadius: Radius.md, alignItems: 'center', marginTop: 4,
  },
  primaryBtnTxt: { color: '#FFFFFF', fontSize: 14, fontWeight: '900', letterSpacing: 1.5 },

  // WhatsApp button
  waBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#25D366', borderRadius: Radius.lg, padding: 16,
    marginBottom: 10,
  },
  waBtnTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  waBtnSub:   { color: 'rgba(255,255,255,0.85)', fontSize: 11, marginTop: 2 },

  // Call button
  callBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    borderWidth: 1.5, borderColor: Theme.purpleBorder,
    paddingVertical: 13, borderRadius: Radius.lg,
    backgroundColor: Theme.bgCardPurple,
  },
  callBtnTxt: { color: Theme.purple, fontSize: 14, fontWeight: '800' },

  // Menu rows
  menuRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14,
  },
  menuBorder: { borderTopWidth: 1, borderTopColor: Theme.borderLight },
  menuLeft:   { flexDirection: 'row', alignItems: 'center', gap: 14 },
  menuIcon:   {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Theme.bgCardPurple, alignItems: 'center', justifyContent: 'center',
  },
  menuLabel:  { color: Theme.textDark, fontSize: 14, fontWeight: '700' },

  // Preferences
  prefRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  prefSub:  { color: Theme.textMuted, fontSize: 11, marginTop: 2 },
  prefValue:{ color: Theme.textMuted, fontSize: 13, fontWeight: '600' },

  // Store strip
  storeStrip: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginTop: 24, marginBottom: 8,
  },
  storeStripText: { color: Theme.textMuted, fontSize: 12, fontWeight: '600' },
});
