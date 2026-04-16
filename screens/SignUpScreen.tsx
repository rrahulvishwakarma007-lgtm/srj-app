import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { register, login } from '../lib/auth';

interface Props {
  onSignedUp: (name: string) => void;
  onGoLogin: () => void;
}

export default function SignUpScreen({ onSignedUp, onGoLogin }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const doSignUp = async () => {
    if (!name || !email || !password) { Alert.alert('Missing', 'Please fill all fields.'); return; }
    if (password.length < 4) { Alert.alert('Weak Password', 'Use at least 4 characters.'); return; }
    setLoading(true);
    const res = await register(name, email, password);
    if (res.ok) {
      // Auto-login after signup
      const l = await login(email, password);
      setLoading(false);
      if (l.ok) onSignedUp(l.session.name);
      else onGoLogin();
    } else {
      setLoading(false);
      Alert.alert('Sign Up Failed', res.error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'center' }}>
        <View style={styles.center}>
          <Text style={styles.brand}>SHEKHAR RAJA</Text>
          <Text style={styles.subtitle}>JEWELLERS</Text>
          <Text style={styles.title}>Create Your Account</Text>

          <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#4F3636" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#4F3636" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
          <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#4F3636" secureTextEntry value={password} onChangeText={setPassword} />

          <TouchableOpacity style={styles.btn} onPress={doSignUp} disabled={loading}>
            {loading ? <ActivityIndicator color="#F8F3ED" /> : <Text style={styles.btnText}>CREATE ACCOUNT</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={onGoLogin} style={{ marginTop: 18 }}>
            <Text style={styles.link}>Already a member? <Text style={styles.linkBold}>Sign In</Text></Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F3ED', padding: 24 },
  center: { alignItems: 'center' },
  brand: { color: '#1F1414', fontSize: 26, fontWeight: '900', letterSpacing: 4 },
  subtitle: { color: '#7A4B6A', fontSize: 13, fontWeight: '700', letterSpacing: 3, marginBottom: 28 },
  title: { color: '#1F1414', fontSize: 22, fontWeight: '800', marginBottom: 26, letterSpacing: 1 },
  input: { width: '100%', backgroundColor: '#FFF8F0', borderWidth: 1, borderColor: '#D9C9B8', borderRadius: 14, paddingHorizontal: 18, paddingVertical: 14, fontSize: 16, color: '#1F1414', marginBottom: 14 },
  btn: { width: '100%', backgroundColor: '#7A4B6A', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#F8F3ED', fontSize: 15, fontWeight: '800', letterSpacing: 2 },
  link: { color: '#4F3636', fontSize: 14 },
  linkBold: { color: '#8C5C2D', fontWeight: '700' },
});