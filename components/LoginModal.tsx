import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  onClose: () => void;
  onLogin: (name: string) => void;
}

export default function LoginModal({ visible, onClose, onLogin }: Props) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const submit = () => {
    const who = name.trim() || (email ? email.split('@')[0] : 'Guest');
    onLogin(who);
    setName(''); setEmail(''); setPass('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.close} onPress={onClose}><Ionicons name="close" size={26} color="#8C5C2D" /></TouchableOpacity>
        <View style={styles.box}>
          <Text style={styles.title}>Welcome to Shekhar Raja Jewellers</Text>
          <View style={styles.tabs}>
            <TouchableOpacity style={[styles.tab, mode === 'login' && styles.tabActive]} onPress={() => setMode('login')}><Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>Login</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.tab, mode === 'signup' && styles.tabActive]} onPress={() => setMode('signup')}><Text style={[styles.tabText, mode === 'signup' && styles.tabTextActive]}>Sign Up</Text></TouchableOpacity>
          </View>
          {mode === 'signup' && <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#7A5C5C" value={name} onChangeText={setName} />}
          <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor="#7A5C5C" keyboardType="email-address" value={email} onChangeText={setEmail} />
          <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#7A5C5C" secureTextEntry value={pass} onChangeText={setPass} />
          <TouchableOpacity style={styles.btn} onPress={submit}><Text style={styles.btnText}>{mode === 'login' ? 'LOGIN' : 'CREATE ACCOUNT'}</Text></TouchableOpacity>
          <Text style={styles.note}>You can explore the entire showroom without an account.</Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F3ED', justifyContent: 'center', padding: 20 },
  close: { position: 'absolute', top: 48, right: 20, padding: 8 },
  box: { backgroundColor: '#FFF8F0', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#D9C9B8' },
  title: { color: '#1F1414', fontSize: 18, fontWeight: '900', textAlign: 'center', marginBottom: 18, letterSpacing: 0.5 },
  tabs: { flexDirection: 'row', marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#D9C9B8' },
  tabActive: { borderBottomColor: '#8C5C2D' },
  tabText: { color: '#7A5C5C', fontSize: 14, fontWeight: '700' },
  tabTextActive: { color: '#8C5C2D' },
  input: { backgroundColor: '#F8F3ED', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 12, color: '#1F1414', borderWidth: 1, borderColor: '#D9C9B8' },
  btn: { backgroundColor: '#8C5C2D', paddingVertical: 15, borderRadius: 14, alignItems: 'center', marginTop: 6 },
  btnText: { color: '#F8F3ED', fontSize: 14, fontWeight: '800', letterSpacing: 2 },
  note: { color: '#7A5C5C', fontSize: 12, textAlign: 'center', marginTop: 16, lineHeight: 18 },
});