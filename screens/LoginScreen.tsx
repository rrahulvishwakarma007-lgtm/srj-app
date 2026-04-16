import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { login } from '../lib/auth';

interface Props {
  onLogin: (name: string) => void;
  onGoSignUp: () => void;
}

export default function LoginScreen({ onLogin, onGoSignUp }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const doLogin = async () => {
    if (!email || !password) { Alert.alert('Missing', 'Please enter email and password.'); return; }
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.ok) onLogin(res.session.name);
    else Alert.alert('Login Failed', res.error);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'center' }}>
        <View style={styles.center}>
          <Text style={styles.brand}>SHEKHAR RAJA</Text>
          <Text style={styles.subtitle}>JEWELLERS</Text>
          <Text style={styles.title}>Welcome Back</Text>

          <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#4F3636" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
          <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#4F3636" secureTextEntry value={password} onChangeText={setPassword} />

          <TouchableOpacity style={styles.btn} onPress={doLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#F8F3ED" /> : <Text style={styles.btnText}>SIGN IN</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.createBtn} onPress={onGoSignUp} activeOpacity={0.88}>
            <Text style={styles.createText}>CREATE ACCOUNT</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onGoSignUp} style={{ marginTop: 10 }}>
            <Text style={styles.link}>Already registered? Use the button above</Text>
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
  btn: { width: '100%', backgroundColor: '#8C5C2D', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#F8F3ED', fontSize: 15, fontWeight: '800', letterSpacing: 2 },
  createBtn: { width: '100%', backgroundColor: '#7A4B6A', paddingVertical: 15, borderRadius: 16, alignItems: 'center', marginTop: 12 },
  createText: { color: '#F8F3ED', fontSize: 14, fontWeight: '800', letterSpacing: 2 },
  link: { color: '#4F3636', fontSize: 13, textAlign: 'center' },
});