import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

import { Theme, Radius } from '../lib/theme';

export default function SignupScreen({ onClose }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signup = async () => {
    if (!name || !email || !password) {
      Alert.alert("Missing Fields", "Please fill all details");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Weak Password", "Minimum 6 characters required");
      return;
    }

    try {
      setLoading(true);

      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      // 🔥 Save user in Firestore
      await setDoc(doc(db, "users", userCred.user.uid), {
        name: name,
        email: email,
        createdAt: new Date()
      });

      Alert.alert("Success", "Account created successfully");
      onClose && onClose();

    } catch (e: any) {
      Alert.alert("Signup Failed", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join Shekhar Raja Jewellers</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <TextInput
          placeholder="Full Name"
          placeholderTextColor={Theme.textMuted}
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

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

        {/* Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={signup}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>
            {loading ? "Creating..." : "Sign Up"}
          </Text>
        </TouchableOpacity>

        {/* Skip */}
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.skip}>Continue without signup</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.bgPurpleDark,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },

  header: {
    marginBottom: 40,
  },

  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
  },

  subtitle: {
    color: Theme.textMuted,
    marginTop: 6,
  },

  form: {
    gap: 14,
  },

  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: Radius.lg,
    padding: 14,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },

  button: {
    backgroundColor: Theme.gold,
    padding: 16,
    borderRadius: Radius.lg,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#2D1B5E',
    fontWeight: '900',
    fontSize: 15,
  },

  skip: {
    color: Theme.textMuted,
    textAlign: 'center',
    marginTop: 16,
    fontSize: 13,
  },
});