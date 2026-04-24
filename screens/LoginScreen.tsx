import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Theme, Radius } from '../lib/theme';

const { width, height } = Dimensions.get('window');

// ─── Floating Label Input ─────────────────────────────────────────────────────
const FloatingInput = ({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
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
    outputRange: ['rgba(255,255,255,0.3)', '#D4AF37'],
  });
  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0.10)', '#D4AF37'],
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

// ─── Main Modal ───────────────────────────────────────────────────────────────
export default function LoginModal({ visible, onClose, onSignupPress }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Entrance animations
  const cardAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      cardAnim.setValue(0);
      contentAnim.setValue(0);
      Animated.sequence([
        Animated.spring(cardAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 16,
          bounciness: 6,
        }),
        Animated.timing(contentAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(cardAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setEmail('');
      setPassword('');
      onClose();
    });
  };

  const handlePressIn = () =>
    Animated.spring(buttonScale, { toValue: 0.96, useNativeDriver: true, speed: 30 }).start();
  const handlePressOut = () =>
    Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true, speed: 30 }).start();

  const signin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setEmail('');
      setPassword('');
      onClose();
    } catch (e: any) {
      let msg = 'Something went wrong. Please try again.';
      if (e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
        msg = 'Incorrect email or password.';
      } else if (e.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      } else if (e.code === 'auth/too-many-requests') {
        msg = 'Too many attempts. Please try again later.';
      } else if (e.code === 'auth/network-request-failed') {
        msg = 'No internet connection. Please check your network.';
      }
      Alert.alert('Login Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const cardTranslateY = cardAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [80, 0],
  });

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      {/* Backdrop */}
      <Animated.View style={[styles.overlay, { opacity: cardAnim }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={handleClose} activeOpacity={1} />
      </Animated.View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        pointerEvents="box-none"
      >
        <Animated.View
          style={[
            styles.card,
            {
              opacity: cardAnim,
              transform: [{ translateY: cardTranslateY }],
            },
          ]}
        >
          {/* Close button */}
          <TouchableOpacity style={styles.closeBtn} onPress={handleClose} activeOpacity={0.7}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>

          {/* Brand mark */}
          <Animated.View
            style={[styles.brandBlock, { opacity: contentAnim }]}
          >
            <View style={styles.diamondRow}>
              <View style={[styles.diamond, styles.diamondSm]} />
              <View style={styles.diamond} />
              <View style={[styles.diamond, styles.diamondSm]} />
            </View>
            <Text style={styles.brandName}>SHEKHAR RAJA</Text>
          </Animated.View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.divLine} />
            <Text style={styles.divDot}>✦</Text>
            <View style={styles.divLine} />
          </View>

          {/* Title */}
          <Animated.View style={{ opacity: contentAnim }}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your jewellery account</Text>
          </Animated.View>

          {/* Fields */}
          <View style={styles.form}>
            <FloatingInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <FloatingInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              rightElement={
                <TouchableOpacity
                  onPress={() => setShowPassword(s => !s)}
                  style={styles.eyeBtn}
                  activeOpacity={0.7}
                >
                  <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text>
                </TouchableOpacity>
              }
            />

            {/* Forgot password */}
            <TouchableOpacity style={styles.forgotBtn} activeOpacity={0.7}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login button */}
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={signin}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={1}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#1a1209" size="small" />
              ) : (
                <>
                  <Text style={styles.buttonText}>Sign In</Text>
                  <Text style={styles.buttonIcon}>→</Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Divider */}
          <View style={[styles.dividerRow, { marginTop: 20 }]}>
            <View style={styles.divLine} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.divLine} />
          </View>

          {/* Sign up nudge */}
          <View style={styles.signupRow}>
            <Text style={styles.signupPrompt}>New to Shekhar Raja? </Text>
            <TouchableOpacity onPress={onSignupPress} activeOpacity={0.7}>
              <Text style={styles.signupLink}>Create account</Text>
            </TouchableOpacity>
          </View>

          {/* Skip */}
          <TouchableOpacity onPress={handleClose} style={styles.skipBtn} activeOpacity={0.7}>
            <Text style={styles.skipText}>Continue without login</Text>
          </TouchableOpacity>

          {/* Bottom jewel note */}
          <Text style={styles.bottomNote}>💎 Members access exclusive collections first</Text>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
    pointerEvents: 'box-none',
  },

  // Card — bottom sheet style
  card: {
    backgroundColor: '#0e0b14',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: Platform.OS === 'ios' ? 44 : 32,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(212,175,55,0.18)',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },

  // Close button
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 20,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontWeight: '700',
  },

  // Brand
  brandBlock: {
    alignItems: 'center',
    marginBottom: 14,
  },
  diamondRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  diamond: {
    width: 12,
    height: 12,
    backgroundColor: '#D4AF37',
    transform: [{ rotate: '45deg' }],
  },
  diamondSm: {
    width: 7,
    height: 7,
    backgroundColor: 'rgba(212,175,55,0.5)',
  },
  brandName: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 5,
  },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  divLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(212,175,55,0.15)',
  },
  divDot: {
    color: '#D4AF37',
    fontSize: 9,
  },
  orText: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 12,
    letterSpacing: 1,
  },

  // Title
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.38)',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 0,
    letterSpacing: 0.2,
  },

  // Form
  form: {
    marginTop: 20,
    gap: 14,
    marginBottom: 6,
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
  eyeBtn: { padding: 4 },
  eyeIcon: { fontSize: 16 },

  // Forgot
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: -4,
  },
  forgotText: {
    color: '#D4AF37',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // Button
  button: {
    backgroundColor: '#D4AF37',
    paddingVertical: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
    marginTop: 16,
  },
  buttonDisabled: { opacity: 0.7 },
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

  // Sign up
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  signupPrompt: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 13,
  },
  signupLink: {
    color: '#D4AF37',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Skip
  skipBtn: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 4,
  },
  skipText: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 12,
    letterSpacing: 0.3,
  },

  // Bottom note
  bottomNote: {
    color: 'rgba(212,175,55,0.35)',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 14,
    fontStyle: 'italic',
    letterSpacing: 0.4,
  },
});
