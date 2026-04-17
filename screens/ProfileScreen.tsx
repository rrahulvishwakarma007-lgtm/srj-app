import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme, Card } from '../lib/theme';

export default function ProfileScreen() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [form, setForm] = useState({ name: '', email: '', phone: '', pass: '' });

  const submit = () => Alert.alert(mode === 'login' ? 'Welcome back' : 'Account Created', 'You are now signed in to Shekhar Raja.');
  const whatsapp = () => Linking.openURL('https://wa.me/919999999999?text=Hello%20Shekhar%20Raja%20Jewellers');
  const call = () => Linking.openURL('tel:+911145678901');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>
        <View style={styles.header}><Text style={styles.title}>Profile</Text></View>

        {/* AUTH */}
        <View style={styles.card}>
          <View style={styles.tabRow}><TouchableOpacity style={[styles.tab, mode === 'login' && styles.tabOn]} onPress={() => setMode('login')}><Text style={[styles.tabTxt, mode === 'login' && styles.tabTxtOn]}>Login</Text></TouchableOpacity><TouchableOpacity style={[styles.tab, mode === 'signup' && styles.tabOn]} onPress={() => setMode('signup')}><Text style={[styles.tabTxt, mode === 'signup' && styles.tabTxtOn]}>Sign Up</Text></TouchableOpacity></View>
          {mode === 'signup' && <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor={Theme.textOnCreamMuted} value={form.name} onChangeText={v => setForm({ ...form, name: v })} />}
          <TextInput style={styles.input} placeholder="Email" placeholderTextColor={Theme.textOnCreamMuted} keyboardType="email-address" value={form.email} onChangeText={v => setForm({ ...form, email: v })} />
          <TextInput style={styles.input} placeholder="Phone" placeholderTextColor={Theme.textOnCreamMuted} keyboardType="phone-pad" value={form.phone} onChangeText={v => setForm({ ...form, phone: v })} />
          <TextInput style={styles.input} placeholder="Password" placeholderTextColor={Theme.textOnCreamMuted} secureTextEntry value={form.pass} onChangeText={v => setForm({ ...form, pass: v })} />
          <TouchableOpacity style={styles.primary} onPress={submit}><Text style={styles.primaryTxt}>{mode === 'login' ? 'LOGIN' : 'CREATE ACCOUNT'}</Text></TouchableOpacity>
        </View>

        {/* CONTACT */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Us</Text>
          <TouchableOpacity style={styles.cta} onPress={whatsapp}><Ionicons name="logo-whatsapp" size={20} color="#fff" /><Text style={styles.ctaTxt}>Chat on WhatsApp</Text></TouchableOpacity>
          <TouchableOpacity style={styles.ctaOutline} onPress={call}><Ionicons name="call" size={20} color={Theme.gold} /><Text style={styles.ctaOutTxt}>Call Showroom</Text></TouchableOpacity>
        </View>

        {/* SETTINGS */}
        <View style={styles.card}><Text style={styles.cardTitle}>Preferences</Text><Text style={styles.setting}>Notifications: On</Text><Text style={styles.setting}>Currency: INR</Text><Text style={styles.setting}>Language: English</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.bgPrimary },
  header: { padding: 20 },
  title: { ...Theme.serifHeavy, color: Theme.textOnDark, fontSize: 26, letterSpacing: 1 },
  card: { marginHorizontal: 16, marginTop: 12, backgroundColor: Theme.bgCard, borderRadius: Card.borderRadius, padding: 18, borderWidth: Card.borderWidth, borderColor: Card.borderColor },
  tabRow: { flexDirection: 'row', marginBottom: 12 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabOn: { backgroundColor: Theme.gold },
  tabTxt: { color: Theme.textOnCream, fontWeight: '700' },
  tabTxtOn: { color: Theme.btnPrimaryText },
  input: { backgroundColor: Theme.bgPrimary + '33', borderRadius: 12, padding: 14, marginBottom: 10, color: Theme.textOnCream, fontSize: 15 },
  primary: { ...Button.primary, marginTop: 6 },
  primaryTxt: { color: Theme.btnPrimaryText, fontWeight: '800', letterSpacing: 1.5 },
  cardTitle: { ...Theme.sansBold, color: Theme.textOnCream, fontSize: 15, marginBottom: 12 },
  cta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: Theme.whatsapp, paddingVertical: 14, borderRadius: 24, marginBottom: 10 },
  ctaTxt: { color: '#fff', fontWeight: '800', fontSize: 14 },
  ctaOutline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderWidth: 1.5, borderColor: Theme.gold, paddingVertical: 13, borderRadius: 24 },
  ctaOutTxt: { color: Theme.gold, fontWeight: '800', fontSize: 14 },
  setting: { color: Theme.textOnCreamMuted, fontSize: 14, paddingVertical: 6 },
});