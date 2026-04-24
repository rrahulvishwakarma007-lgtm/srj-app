import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Theme, Radius } from '../lib/theme';

const { width, height } = Dimensions.get('window');

// ─── Animated Input Field ─────────────────────────────────────────────────────
const FloatingInput = ({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  rightElement,
}: any) => {
  const [focused, setFocused] = useState(false);
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setFocused(true);
    Animated.parallel([
      Animated.timing(labelAnim, { toValue: 1, duration: 180, useNativeDriver: false }),
      Animated.timing(borderAnim, { toValue: 1, duration: 200, useNativeDriver: false }),
    ]).start();
  };

  const handleBlur = () => {
    setFocused(false);
    Animated.timing(borderAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
    if (!value) {
      Animated.timing(labelAnim, { toValue: 0, duration: 180, useNativeDriver: false }).start();
    }
  };

  const labelTop = labelAnim.interpolate({ inputRange: [0, 1], outputRange: [16, -8] });
  const labelSize = labelAnim.interpolate({ inputRange: [0, 1], outputRange: [15, 11] });
  const labelColor = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0.35)', '#D4AF37'],
  });
  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0.12)', '#D4AF37'],
  });

  return (
    <Animated.View style={[styles.floatWrapper, { borderColor }]}>
      <Animated.Text
        style={[styles.floatLabel, { top: labelTop, fontSize: labelSize, color: labelColor }]}
        pointerEvents="none"
      >
        {label}
      </Animated.Text>
      <View style={styles.floatRow}>
        <TextInput
          style={styles.floatInput}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          placeholderTextColor="transparent"
        />
        {rightElement}
      </View>
    </Animated.View>
  );
};

// ─── Password Strength Bar ────────────────────────────────────────────────────
const PasswordStrength = ({ password }: { password: string }) => {
  const getStrength = () => {
    if (!password) return { score: 0, label: '', color: 'transparent' };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 1) return { score: 1, label: 'Weak', color: '#FF3B5C' };
    if (score <= 3) return { score: 3, label: 'Fair', color: '#FFB340' };
    return { score: 5, label: 'Strong', color: '#34C759' };
  };

  const { score, label, color } = getStrength();
  if (!password) return null;

  return (
    <View style={styles.strengthContainer}>
      <View style={styles.strengthBars}>
        {[1, 2, 3, 4, 5].map(i => (
          <View
            key={i}
            style={[
              styles.strengthBar,
              { backgroundColor: i <= score ? color : 'rgba(255,255,255,0.1)' },
            ]}
          />
        ))}
      </View>
      <Text style={[styles.strengthLabel, { color }]}>{label}</Text>
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function SignupScreen({ onClose }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // Animated values
  const buttonScale = useRef(new Animated.Value(1)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () =>
    Animated.spring(buttonScale, { toValue: 0.96, useNativeDriver: true, speed: 30 }).start();
  const handlePressOut = () =>
    Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true, speed: 30 }).start();

  const toggleAgree = () => {
    setAgreed(a => {
      Animated.spring(checkAnim, {
        toValue: a ? 0 : 1,
        useNativeDriver: true,
        speed: 25,
      }).start();
      return !a;
    });
  };

  const validateEmail = (e: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const signup = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert('Missing Fields', 'Please fill in all details.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }
    if (!agreed) {
      Alert.alert('Terms & Conditions', 'Please agree to the terms to continue.');
      return;
    }

    try {
      setLoading(true);
      const userCred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await setDoc(doc(db, 'users', userCred.user.uid), {
        name: name.trim(),
        email: email.trim(),
        createdAt: new Date(),
      });
      Alert.alert('Welcome! ✦', `Account created for ${name.trim()}.`);
      onClose && onClose();
    } catch (e: any) {
      let msg = e.message;
      if (e.code === 'auth/email-already-in-use') msg = 'This email is already registered.';
      if (e.code === 'auth/network-request-failed') msg = 'Network error. Check your connection.';
      Alert.alert('Signup Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const checkScale = checkAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });

  return (
    <SafeAreaView style={styles.container}>
      {/* Decorative background circles */}
      <View style={styles.bgCircle1} pointerEvents="none" />
      <View style={styles.bgCircle2} pointerEvents="none" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Brand Header ── */}
          <View style={styles.header}>
            <View style={styles.diamondRow}>
              <View style={styles.diamond} />
              <View style={[styles.diamond, styles.diamondSm]} />
              <View style={[styles.diamond, styles.diamondSm]} />
            </View>
            <Text style={styles.brandName}>SHEKHAR RAJA</Text>
            <Text style={styles.brandSub}>Fine Jewellery</Text>
            <View style={styles.dividerRow}>
              <View style={styles.divLine} />
              <Text style={styles.divDot}>✦</Text>
              <View style={styles.divLine} />
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join our exclusive jewellery family</Text>
          </View>

          {/* ── Form ── */}
          <View style={styles.form}>
            <FloatingInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            <FloatingInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <FloatingInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              rightElement={
                <TouchableOpacity onPress={() => setShowPassword(s => !s)} style={styles.eyeBtn}>
                  <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text>
                </TouchableOpacity>
              }
            />

            <PasswordStrength password={password} />

            {/* Terms checkbox */}
            <TouchableOpacity style={styles.termsRow} onPress={toggleAgree} activeOpacity={0.8}>
              <View style={[styles.checkbox, agreed && styles.checkboxActive]}>
                <Animated.Text
                  style={[styles.checkmark, { transform: [{ scale: checkScale }], opacity: checkAnim }]}
                >
                  ✓
                </Animated.Text>
              </View>
              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text style={styles.termsLink}>Terms & Conditions</Text>
                {' '}and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>

            {/* Sign Up button */}
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={signup}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#1a1209" size="small" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Create Account</Text>
                    <Text style={styles.buttonIcon}>→</Text>
                  </>
                )}
              </TouchableOpacity>
            </Animated.View>

            {/* Divider */}
            <View style={styles.orRow}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>or</Text>
              <View style={styles.orLine} />
            </View>

            {/* Skip */}
            <TouchableOpacity onPress={onClose} style={styles.skipBtn} activeOpacity={0.7}>
              <Text style={styles.skipText}>Continue without account</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom note */}
          <Text style={styles.bottomNote}>✦ Exclusive members get early access to new collections</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0b14',
  },
  bgCircle1: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: 'rgba(212,175,55,0.04)',
    top: -width * 0.2,
    right: -width * 0.25,
  },
  bgCircle2: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: 'rgba(212,175,55,0.03)',
    bottom: height * 0.1,
    left: -width * 0.2,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    flexGrow: 1,
  },

  // Header
  header: {
    alignItems: 'center',
    paddingTop: 32,
    marginBottom: 36,
  },
  diamondRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  diamond: {
    width: 14,
    height: 14,
    backgroundColor: '#D4AF37',
    transform: [{ rotate: '45deg' }],
  },
  diamondSm: {
    width: 8,
    height: 8,
    backgroundColor: 'rgba(212,175,55,0.5)',
  },
  brandName: {
    color: '#D4AF37',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 6,
  },
  brandSub: {
    color: 'rgba(212,175,55,0.6)',
    fontSize: 11,
    letterSpacing: 4,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '60%',
    marginVertical: 18,
  },
  divLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(212,175,55,0.25)',
  },
  divDot: {
    color: '#D4AF37',
    fontSize: 10,
    marginHorizontal: 8,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    marginTop: 6,
    letterSpacing: 0.3,
  },

  // Form
  form: {
    gap: 16,
  },

  // Floating input
  floatWrapper: {
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 10,
    position: 'relative',
  },
  floatLabel: {
    position: 'absolute',
    left: 16,
    color: 'rgba(255,255,255,0.35)',
    backgroundColor: 'transparent',
  },
  floatRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  floatInput: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    paddingVertical: 0,
    paddingTop: 4,
  },
  eyeBtn: {
    padding: 4,
  },
  eyeIcon: {
    fontSize: 16,
  },

  // Password strength
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: -6,
    paddingHorizontal: 2,
  },
  strengthBars: {
    flexDirection: 'row',
    gap: 4,
    flex: 1,
  },
  strengthBar: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    width: 46,
    textAlign: 'right',
  },

  // Terms
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: 'rgba(212,175,55,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxActive: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  checkmark: {
    color: '#1a1209',
    fontSize: 12,
    fontWeight: '900',
  },
  termsText: {
    flex: 1,
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
    lineHeight: 18,
  },
  termsLink: {
    color: '#D4AF37',
    fontWeight: '600',
  },

  // Button
  button: {
    backgroundColor: '#D4AF37',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#1a1209',
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 0.8,
  },
  buttonIcon: {
    color: '#1a1209',
    fontSize: 18,
    fontWeight: '700',
  },

  // Or divider
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  orText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
    letterSpacing: 1,
  },

  // Skip
  skipBtn: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  skipText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 13,
    letterSpacing: 0.3,
  },

  // Bottom note
  bottomNote: {
    color: 'rgba(212,175,55,0.4)',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 32,
    letterSpacing: 0.5,
    fontStyle: 'italic',
  },
});
