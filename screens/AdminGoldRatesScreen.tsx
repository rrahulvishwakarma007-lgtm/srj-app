import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, Radius } from '../lib/theme';

const ADMIN_PASSWORD = 'SRJ@1987';
const STORAGE_KEY = 'SRJ_GOLD_RATES';

interface RateFields {
  gold24k: string;
  gold22k: string;
  gold20k: string;
  gold18k: string;
  note: string;
}

const RATE_CONFIG = [
  { key: 'gold24k', label: '24K Gold (999)' },
  { key: 'gold22k', label: '22K Gold (916)' },
  { key: 'gold20k', label: '20K Gold (833)' },
  { key: 'gold18k', label: '18K Gold (750)' },
] as const;

export default function AdminGoldRatesScreen({ onClose }: any) {

  const [authed, setAuthed] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [passError, setPassError] = useState('');

  const [fields, setFields] = useState<RateFields>({
    gold24k: '', gold22k: '', gold20k: '', gold18k: '', note: '',
  });

  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState('');

  // 🔥 LOAD SAVED DATA
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        if (data) {
          const parsed = JSON.parse(data);
          setFields(parsed.fields);
          setLastSaved(parsed.time);
        }
      } catch (e) {
        console.log('Load error', e);
      }
    };

    loadData();
  }, []);

  // 🔥 AUTO CALCULATE
  const handleGold24kChange = (val: string) => {
    const rate = parseFloat(val);

    if (!isNaN(rate)) {
      setFields(f => ({
        ...f,
        gold24k: val,
        gold22k: Math.round(rate * 0.9166).toString(),
        gold20k: Math.round(rate * 0.8333).toString(),
        gold18k: Math.round(rate * 0.7500).toString(),
      }));
    } else {
      setFields(f => ({ ...f, gold24k: val }));
    }
  };

  // 🔐 LOGIN
  const login = () => {
    if (passInput === ADMIN_PASSWORD) {
      setAuthed(true);
      setPassError('');
    } else {
      setPassError('Wrong password');
      setPassInput('');
    }
  };

  // 💾 SAVE DATA
  const save = async () => {
    if (!fields.gold24k || !fields.gold22k) {
      Alert.alert('Required', 'Enter 24K & 22K');
      return;
    }

    setSaving(true);

    const now = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          fields,
          time: now,
        })
      );

      setLastSaved(now);
      Alert.alert('Saved ✅', `Rates saved at ${now}`);
    } catch (e) {
      Alert.alert('Error', 'Failed to save');
    }

    setSaving(false);
  };

  // 🔐 LOGIN SCREEN
  if (!authed) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loginWrap}>
          <Text style={styles.loginTitle}>Admin Login</Text>

          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={passInput}
            onChangeText={setPassInput}
          />

          {!!passError && <Text style={styles.error}>{passError}</Text>}

          <TouchableOpacity style={styles.btn} onPress={login}>
            <Text style={styles.btnText}>LOGIN</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // 🧠 ADMIN PANEL
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        <View style={styles.header}>
          <Text style={styles.title}>Gold Rates</Text>
          <Text style={styles.sub}>
            {lastSaved ? `Saved at ${lastSaved}` : 'No saved data'}
          </Text>
        </View>

        <ScrollView style={{ padding: 16 }}>
          {RATE_CONFIG.map((r) => (
            <View key={r.key} style={{ marginBottom: 14 }}>
              <Text style={styles.label}>{r.label}</Text>

              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={fields[r.key]}
                onChangeText={(v) =>
                  r.key === 'gold24k'
                    ? handleGold24kChange(v)
                    : setFields(f => ({ ...f, [r.key]: v }))
                }
              />
            </View>
          ))}

          <Text style={styles.label}>Note</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            multiline
            value={fields.note}
            onChangeText={(v) => setFields(f => ({ ...f, note: v }))}
          />

          <TouchableOpacity style={styles.btn} onPress={save}>
            {saving
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnText}>SAVE</Text>
            }
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.bgPrimary },

  loginWrap: { flex: 1, justifyContent: 'center', padding: 20 },

  loginTitle: { fontSize: 22, fontWeight: '900', marginBottom: 20 },

  header: { padding: 16, backgroundColor: Theme.bgPurple },

  title: { color: '#fff', fontSize: 18, fontWeight: '900' },
  sub: { color: '#ccc', marginTop: 4 },

  label: { fontWeight: '700', marginBottom: 6 },

  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: Radius.md,
  },

  btn: {
    backgroundColor: Theme.bgPurple,
    padding: 16,
    marginTop: 20,
    borderRadius: Radius.lg,
    alignItems: 'center',
  },

  btnText: { color: '#fff', fontWeight: '900' },

  error: { color: 'red', marginBottom: 10 },
});