import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Theme, Radius } from '../lib/theme';

// ── CHANGE THIS PASSWORD ──────────────────────────────────────────────────
const ADMIN_PASSWORD = 'SRJ@1987';

interface RateFields {
  gold24k: string;
  gold22k: string;
  gold20k: string;
  gold18k: string;
  note: string;
}
const RATE_CONFIG = [
  { key: 'gold24k', label: '24K Gold (999)', placeholder: 'e.g. 9850', metal: 'gold' },
  { key: 'gold22k', label: '22K Gold (916)', placeholder: 'e.g. 9020', metal: 'gold' },
  { key: 'gold20k', label: '20K Gold (833)', placeholder: 'e.g. 8200', metal: 'gold' },
  { key: 'gold18k', label: '18K Gold (750)', placeholder: 'e.g. 7380', metal: 'gold' },
] as const;
export default function AdminGoldRatesScreen({ onClose }: { onClose: () => void }) {
  // Auth
  const [authed, setAuthed]       = useState(false);
  const [passInput, setPassInput] = useState('');
  const [passError, setPassError] = useState('');

  // Form
 const [fields, setFields] = useState<RateFields>({
  gold24k: '', gold22k: '', gold20k: '', gold18k: '', note: '',
});
  const [saving, setSaving]       = useState(false);
  const [lastSaved, setLastSaved] = useState('');
  const [loading, setLoading]     = useState(true);

  // Load existing rates when authed
  useEffect(() => {
    if (!authed) return;
    const unsub = onSnapshot(doc(db, 'goldRates', 'today'), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setFields({
  gold24k: String(d.gold24k || ''),
  gold22k: String(d.gold22k || ''),
  gold20k: String(d.gold20k || ''),
  gold18k: String(d.gold18k || ''),
  note: d.note || '',
});
        if (d.updatedAt) {
          try {
            const date = d.updatedAt.toDate();
            setLastSaved(date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }));
          } catch {}
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, [authed]);

  // Auto-calculate lower karats from 24K
const handleGold24kChange = (val: string) => {
  const rate24k = parseFloat(val);
  if (!isNaN(rate24k) && rate24k > 0) {
    setFields(f => ({
      ...f,
      gold24k: val,
      gold22k: Math.round(rate24k * 0.9166).toString(),
      gold20k: Math.round(rate24k * 0.8333).toString(),
      gold18k: Math.round(rate24k * 0.7500).toString(),
    }));
  } else {
    setFields(f => ({ ...f, gold24k: val }));
  }
};

  const login = () => {
    if (passInput === ADMIN_PASSWORD) {
      setAuthed(true);
      setPassError('');
    } else {
      setPassError('Incorrect password. Please try again.');
      setPassInput('');
    }
  };

  const save = async () => {
    // Validate at least 24K and 22K filled
    if (!fields.gold24k || !fields.gold22k) {
      Alert.alert('Required', 'Please enter at least 24K and 22K gold rates.');
      return;
    }

    const parseNum = (v: string) => parseFloat(v) || 0;

    // Sanity check — rates should be reasonable
    const g24 = parseNum(fields.gold24k);
    if (g24 < 5000 || g24 > 20000) {
      Alert.alert('Check Rate', `24K rate ₹${g24} seems unusual. Please verify.`);
      return;
    }

    try {
      setSaving(true);
      await setDoc(doc(db, 'goldRates', 'today'), {
  gold24k: parseNum(fields.gold24k),
  gold22k: parseNum(fields.gold22k),
  gold20k: parseNum(fields.gold20k),
  gold18k: parseNum(fields.gold18k),
        note:      fields.note.trim(),
        updatedAt: serverTimestamp(),
        updatedBy: 'Shekhar Raja Team',
      });

      const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
      setLastSaved(now);
      Alert.alert('✅ Saved!', `Gold rates updated successfully at ${now}.\n\nAll customers will see the new rates immediately.`);
    } catch (e) {
      Alert.alert('Error', 'Could not save rates. Please check your internet connection.');
    } finally {
      setSaving(false);
    }
  };

  // ── Login Screen ──────────────────────────────────────────────────────
  if (!authed) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.loginWrap}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={22} color={Theme.textMuted} />
          </TouchableOpacity>

          <View style={styles.loginIconWrap}>
            <Ionicons name="lock-closed" size={36} color={Theme.gold} />
          </View>

          <Text style={styles.loginTitle}>Admin Access</Text>
          <Text style={styles.loginSub}>Enter password to update gold rates</Text>

          <TextInput
            style={styles.passInput}
            placeholder="Enter password"
            placeholderTextColor={Theme.textMuted}
            secureTextEntry
            value={passInput}
            onChangeText={setPassInput}
            onSubmitEditing={login}
            autoFocus
          />

          {!!passError && (
            <Text style={styles.passError}>{passError}</Text>
          )}

          <TouchableOpacity style={styles.loginBtn} onPress={login} activeOpacity={0.88}>
            <Text style={styles.loginBtnTxt}>LOGIN</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Admin Panel ───────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* Header */}
        <View style={styles.adminHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.adminTitle}>Update Gold Rates</Text>
            <Text style={styles.adminSub}>
              {lastSaved ? `Last saved at ${lastSaved}` : 'Not updated today yet'}
            </Text>
          </View>
          <View style={{ width: 38 }} />
        </View>
        <View style={styles.goldLine} />

        {loading ? (
          <View style={styles.centerWrap}>
            <ActivityIndicator size="large" color={Theme.purple} />
            <Text style={styles.loadingTxt}>Loading current rates…</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.adminScroll} showsVerticalScrollIndicator={false}>

            {/* Auto-calculate tip */}
            <View style={styles.tipCard}>
              <Ionicons name="bulb-outline" size={18} color={Theme.gold} />
              <Text style={styles.tipText}>
                <Text style={{ fontWeight: '800' }}>Tip:</Text> Enter 24K rate first — lower karats will auto-calculate!
              </Text>
            </View>

            {/* Gold rates */}
            <Text style={styles.sectionLabel}>GOLD RATES (₹ per 10 grams)</Text>
            {RATE_CONFIG.filter(r => r.metal === 'gold').map((r) => (
              <View key={r.key} style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>{r.label}</Text>
                <View style={styles.fieldRow}>
                  <Text style={styles.rupeeSymbol}>₹</Text>
                  <TextInput
                    style={styles.fieldInput}
                    placeholder={r.placeholder}
                    placeholderTextColor={Theme.textMuted}
                    keyboardType="numeric"
                    value={fields[r.key]}
                    onChangeText={v => r.key === 'gold24k'
                      ? handleGold24kChange(v)
                      : setFields(f => ({ ...f, [r.key]: v }))
                    }
                  />
                  {r.key === 'gold24k' && (
                    <View style={styles.mainBadge}>
                      <Text style={styles.mainBadgeTxt}>BASE</Text>
                    </View>
                  )}
                  {r.key !== 'gold24k' && (
                    <View style={styles.autoBadge}>
                      <Text style={styles.autoBadgeTxt}>AUTO</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}

          

            {/* Note */}
            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>NOTE FOR CUSTOMERS (optional)</Text>
            <TextInput
              style={[styles.fieldInput, styles.noteInput]}
              placeholder="e.g. Rates may change after 6 PM · Festival special rates available"
              placeholderTextColor={Theme.textMuted}
              multiline
              value={fields.note}
              onChangeText={v => setFields(f => ({ ...f, note: v }))}
            />

            {/* Preview */}
            {!!fields.gold22k && (
              <View style={styles.previewCard}>
                <Text style={styles.previewTitle}>Preview — What customers will see</Text>
                {RATE_CONFIG.filter(r => r.metal === 'gold' && fields[r.key]).map(r => (
                  <View key={r.key} style={styles.previewRow}>
                    <Text style={styles.previewLabel}>{r.label}</Text>
                    <Text style={styles.previewPrice}>
                      ₹{parseInt(fields[r.key] || '0').toLocaleString('en-IN')}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Save button */}
            <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={saving} activeOpacity={0.88}>
              {saving
                ? <ActivityIndicator color="#FFFFFF" />
                : <>
                    <Ionicons name="cloud-upload-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.saveBtnTxt}>SAVE & PUBLISH RATES</Text>
                  </>
              }
            </TouchableOpacity>

            <Text style={styles.saveNote}>
              Rates will be visible to all customers immediately after saving.
            </Text>
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.bgPrimary },

  // Login
  loginWrap:    { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  loginIconWrap:{ width: 90, height: 90, borderRadius: 45, backgroundColor: Theme.bgCardPurple, alignItems: 'center', justifyContent: 'center', marginBottom: 20, borderWidth: 2, borderColor: Theme.purpleBorder },
  loginTitle:   { color: Theme.textDark, fontSize: 24, fontWeight: '900', marginBottom: 8 },
  loginSub:     { color: Theme.textMuted, fontSize: 14, marginBottom: 28, textAlign: 'center' },
  passInput:    { width: '100%', backgroundColor: '#FFFFFF', borderRadius: Radius.md, paddingHorizontal: 18, paddingVertical: 15, fontSize: 16, borderWidth: 1.5, borderColor: Theme.border, color: Theme.textDark, marginBottom: 10, textAlign: 'center', letterSpacing: 3 },
  passError:    { color: Theme.danger, fontSize: 13, marginBottom: 10, textAlign: 'center' },
  loginBtn:     { width: '100%', backgroundColor: Theme.bgPurple, paddingVertical: 16, borderRadius: Radius.lg, alignItems: 'center', marginTop: 8 },
  loginBtnTxt:  { color: '#FFFFFF', fontSize: 15, fontWeight: '900', letterSpacing: 2 },
  closeBtn:     { position: 'absolute', top: 16, right: 16, padding: 8, backgroundColor: Theme.bgSecondary, borderRadius: Radius.full },

  // Admin header
  adminHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.bgPurple, paddingHorizontal: 16, paddingVertical: 14 },
  adminTitle:  { color: '#FFFFFF', fontSize: 17, fontWeight: '900' },
  adminSub:    { color: Theme.textLightMuted, fontSize: 11, marginTop: 2 },
  goldLine:    { height: 3, backgroundColor: Theme.gold },

  adminScroll: { padding: 16, paddingBottom: 60 },
  centerWrap:  { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  loadingTxt:  { color: Theme.textMuted, marginTop: 16, fontSize: 14 },

  tipCard: {
    flexDirection: 'row', gap: 10, alignItems: 'center',
    backgroundColor: Theme.bgCardGold, borderRadius: Radius.md, padding: 14,
    borderWidth: 1, borderColor: Theme.borderGold, marginBottom: 20,
  },
  tipText: { flex: 1, color: Theme.textDark, fontSize: 13, lineHeight: 19 },

  sectionLabel: { color: Theme.purple, fontSize: 11, fontWeight: '800', letterSpacing: 3, marginBottom: 12 },

  fieldWrap:    { marginBottom: 14 },
  fieldLabel:   { color: Theme.textDark, fontSize: 13, fontWeight: '700', marginBottom: 6 },
  fieldRow:     { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: Radius.md, borderWidth: 1.5, borderColor: Theme.border, paddingHorizontal: 14, overflow: 'hidden' },
  rupeeSymbol:  { color: Theme.purple, fontSize: 18, fontWeight: '800', marginRight: 6 },
  fieldInput:   { flex: 1, fontSize: 18, fontWeight: '700', color: Theme.textDark, paddingVertical: 14 },
  mainBadge:    { backgroundColor: Theme.bgPurple, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  mainBadgeTxt: { color: '#FFFFFF', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  autoBadge:    { backgroundColor: Theme.bgCardPurple, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  autoBadgeTxt: { color: Theme.purple, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  noteInput:    { height: 90, textAlignVertical: 'top', backgroundColor: '#FFFFFF', borderRadius: Radius.md, borderWidth: 1.5, borderColor: Theme.border, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: Theme.textDark },

  previewCard:  { backgroundColor: '#FFFFFF', borderRadius: Radius.lg, padding: 18, borderWidth: 1, borderColor: Theme.border, marginTop: 20, marginBottom: 16 },
  previewTitle: { color: Theme.textDark, fontSize: 13, fontWeight: '800', marginBottom: 12, letterSpacing: 0.3 },
  previewRow:   { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Theme.borderLight },
  previewLabel: { color: Theme.textMuted, fontSize: 14, fontWeight: '600' },
  previewPrice: { color: Theme.purple, fontSize: 16, fontWeight: '900' },

  saveBtn:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: Theme.bgPurple, paddingVertical: 18, borderRadius: Radius.lg, marginTop: 8 },
  saveBtnTxt:   { color: '#FFFFFF', fontSize: 15, fontWeight: '900', letterSpacing: 1.5 },
  saveNote:     { color: Theme.textMuted, fontSize: 11, textAlign: 'center', marginTop: 12, lineHeight: 17 },
});
