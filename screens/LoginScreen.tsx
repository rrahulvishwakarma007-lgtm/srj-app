import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Theme, Radius } from '../lib/theme';

export default function LoginModal({ visible, onClose }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Enter email & password");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (e: any) {
      Alert.alert("Login Failed", e.message);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Save your favourites 💎</Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor={Theme.textMuted}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor={Theme.textMuted}
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={signin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.skip}>Continue without login</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
  },

  card: {
    backgroundColor: Theme.bgPurpleDark,
    borderRadius: Radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
  },

  subtitle: {
    color: Theme.textMuted,
    marginBottom: 16,
  },

  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: Radius.lg,
    padding: 12,
    color: '#fff',
    marginBottom: 10,
  },

  button: {
    backgroundColor: Theme.gold,
    padding: 14,
    borderRadius: Radius.lg,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#2D1B5E',
    fontWeight: '900',
  },

  skip: {
    color: Theme.textMuted,
    textAlign: 'center',
    marginTop: 14,
  },
});