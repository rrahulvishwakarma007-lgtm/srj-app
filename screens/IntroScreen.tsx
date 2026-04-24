import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Theme, Radius } from '../lib/theme';

const { width, height } = Dimensions.get('window');

const BRAND   = 'SHEKHAR RAJA';
const TAGLINE = 'Fine Jewellery Since 1987';
const SUB     = 'The Official Collection App';

interface Props { onFinish: () => void; }

// ─── Single floating letter ───────────────────────────────────────────────────
function FloatLetter({ char, delay, index }: { char: string; delay: number; index: number }) {
  const y        = useRef(new Animated.Value(20)).current;
  const opacity  = useRef(new Animated.Value(0)).current;
  const floatY   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1, duration: 400, delay, easing: Easing.out(Easing.quad), useNativeDriver: true,
      }),
      Animated.timing(y, {
        toValue: 0, duration: 500, delay, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true,
      }),
    ]).start(() => {
      // Continuous float after entrance
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatY, {
            toValue: -8, duration: 1600 + index * 80,
            easing: Easing.inOut(Easing.sin), useNativeDriver: true,
          }),
          Animated.timing(floatY, {
            toValue: 6, duration: 1800 + index * 60,
            easing: Easing.inOut(Easing.sin), useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  return (
    <Animated.Text
      style={[
        styles.letter,
        { opacity, transform: [{ translateY: Animated.add(y, floatY) }] },
      ]}
    >
      {char === ' ' ? '\u00A0' : char}
    </Animated.Text>
  );
}

// ─── Pulsing ring ─────────────────────────────────────────────────────────────
function PulseRing({ delay = 0, size = 120 }: { delay?: number; size?: number }) {
  const scale   = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.timing(scale,   { toValue: 1.8, duration: 1800, delay, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0,   duration: 1800, delay, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        width: size, height: size, borderRadius: size / 2,
        borderWidth: 1.5, borderColor: '#D4AF37',
        opacity, transform: [{ scale }],
      }}
    />
  );
}

// ─── Sparkle dot ─────────────────────────────────────────────────────────────
function Sparkle({ x, y: top, delay }: { x: number; y: number; delay: number }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.spring(scale,   { toValue: 1, useNativeDriver: true, speed: 20 }),
        ]),
        Animated.delay(600),
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: true }),
          Animated.timing(scale,   { toValue: 0, duration: 500, useNativeDriver: true }),
        ]),
        Animated.delay(1200),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute', left: x, top,
        opacity, transform: [{ scale }],
      }}
    >
      <Text style={{ color: '#D4AF37', fontSize: 12 }}>✦</Text>
    </Animated.View>
  );
}

// ─── Main Intro Screen ────────────────────────────────────────────────────────
export default function IntroScreen({ onFinish }: Props) {
  const logoScale    = useRef(new Animated.Value(0)).current;
  const logoOpacity  = useRef(new Animated.Value(0)).current;
  const ringOpacity  = useRef(new Animated.Value(0)).current;
  const contentFade  = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(50)).current;
  const btnSlide     = useRef(new Animated.Value(60)).current;
  const btnOpacity   = useRef(new Animated.Value(0)).current;
  const lineWidth    = useRef(new Animated.Value(0)).current;
  const screenFade   = useRef(new Animated.Value(1)).current;
  const btnScale     = useRef(new Animated.Value(1)).current;

  const finish = () => {
    Animated.timing(screenFade, {
      toValue: 0, duration: 400, easing: Easing.in(Easing.quad), useNativeDriver: true,
    }).start(() => onFinish());
  };

  const handlePressIn  = () => Animated.spring(btnScale, { toValue: 0.95, useNativeDriver: true, speed: 30 }).start();
  const handlePressOut = () => Animated.spring(btnScale, { toValue: 1,    useNativeDriver: true, speed: 30 }).start();

  useEffect(() => {
    // 1. Logo pops in
    Animated.parallel([
      Animated.spring(logoScale,   { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }),
      Animated.timing(logoOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    // 2. Rings fade in
    Animated.timing(ringOpacity, { toValue: 1, duration: 500, delay: 300, useNativeDriver: true }).start();

    // 3. Content rises
    Animated.parallel([
      Animated.timing(contentFade,  { toValue: 1, duration: 700, delay: 600, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(contentSlide, { toValue: 0, duration: 700, delay: 600, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();

    // 4. Divider line grows
    Animated.timing(lineWidth, { toValue: 1, duration: 600, delay: 1000, easing: Easing.out(Easing.quad), useNativeDriver: false }).start();

    // 5. Button rises
    Animated.parallel([
      Animated.timing(btnOpacity, { toValue: 1, duration: 500, delay: 1400, useNativeDriver: true }),
      Animated.spring(btnSlide,   { toValue: 0, delay: 1400, friction: 7, tension: 50, useNativeDriver: true }),
    ]).start();

    // Auto-finish after 6s
    const t = setTimeout(finish, 6000);
    return () => clearTimeout(t);
  }, []);

  const sparkles = [
    { x: width * 0.12, y: height * 0.18, delay: 0 },
    { x: width * 0.78, y: height * 0.22, delay: 700 },
    { x: width * 0.08, y: height * 0.55, delay: 400 },
    { x: width * 0.85, y: height * 0.60, delay: 1100 },
    { x: width * 0.25, y: height * 0.80, delay: 300 },
    { x: width * 0.70, y: height * 0.78, delay: 900 },
    { x: width * 0.50, y: height * 0.12, delay: 600 },
  ];

  return (
    <Animated.View style={[styles.root, { opacity: screenFade }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0810" />

      {/* Radial background glow */}
      <View style={styles.bgGlow} pointerEvents="none" />
      <View style={styles.bgGlow2} pointerEvents="none" />

      {/* Sparkles */}
      {sparkles.map((s, i) => <Sparkle key={i} x={s.x} y={s.y} delay={s.delay} />)}

      {/* Gold top bar with shimmer */}
      <View style={styles.goldBar}>
        <View style={styles.goldBarShimmer} />
      </View>

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Skip */}
        <TouchableOpacity style={styles.skipBtn} onPress={finish} activeOpacity={0.7}>
          <Text style={styles.skipText}>SKIP</Text>
          <Text style={styles.skipArrow}>›</Text>
        </TouchableOpacity>

        {/* ── Center content ── */}
        <View style={styles.center}>

          {/* Logo circle with pulse rings */}
          <View style={styles.logoArea}>
            <Animated.View style={{ opacity: ringOpacity }}>
              <PulseRing size={160} delay={0} />
              <PulseRing size={160} delay={900} />
            </Animated.View>

            <Animated.View
              style={[styles.logoCircle, {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }],
              }]}
            >
              <View style={styles.logoInnerRing} />
              <Ionicons name="diamond" size={52} color="#D4AF37" />
            </Animated.View>
          </View>

          {/* Brand name — floating letters */}
          <View style={styles.letterRow}>
            {BRAND.split('').map((ch, i) => (
              <FloatLetter key={i} char={ch} delay={200 + i * 55} index={i} />
            ))}
          </View>

          {/* Animated divider */}
          <Animated.View
            style={[styles.dividerRow, {
              opacity: contentFade,
              transform: [{ translateY: contentSlide }],
            }]}
          >
            <Animated.View style={[styles.divLine, {
              width: lineWidth.interpolate({ inputRange: [0, 1], outputRange: [0, 60] }),
            }]} />
            <Text style={styles.divDiamond}>◈</Text>
            <Animated.View style={[styles.divLine, {
              width: lineWidth.interpolate({ inputRange: [0, 1], outputRange: [0, 60] }),
            }]} />
          </Animated.View>

          {/* Tagline & subtitle */}
          <Animated.View style={[styles.textBlock, {
            opacity: contentFade,
            transform: [{ translateY: contentSlide }],
          }]}>
            <Text style={styles.tagline}>{TAGLINE}</Text>
            <Text style={styles.subText}>{SUB}</Text>
          </Animated.View>

          {/* Feature pills */}
          <Animated.View style={[styles.pillRow, {
            opacity: btnOpacity,
            transform: [{ translateY: btnSlide }],
          }]}>
            {['Rings', 'Necklaces', 'Bangles', 'Earrings'].map((tag, i) => (
              <View key={i} style={styles.pill}>
                <Text style={styles.pillText}>{tag}</Text>
              </View>
            ))}
          </Animated.View>
        </View>

        {/* ── Enter button ── */}
        <Animated.View style={[styles.btnWrap, {
          opacity: btnOpacity,
          transform: [{ translateY: btnSlide }, { scale: btnScale }],
        }]}>
          <TouchableOpacity
            style={styles.enterBtn}
            onPress={finish}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
          >
            <Text style={styles.enterText}>ENTER THE SHOWROOM</Text>
            <Ionicons name="arrow-forward" size={16} color="#0a0810" />
          </TouchableOpacity>
          <Text style={styles.enterHint}>Explore our exclusive collection</Text>
        </Animated.View>
      </SafeAreaView>

      {/* Gold bottom bar */}
      <View style={[styles.goldBar, styles.goldBarBottom]} />
    </Animated.View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0a0810',
  },
  safe: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },

  // Background glow
  bgGlow: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: 'rgba(212,175,55,0.04)',
    top: height * 0.2,
    alignSelf: 'center',
  },
  bgGlow2: {
    position: 'absolute',
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: 'rgba(120, 60, 180, 0.06)',
    top: height * 0.1,
    left: -width * 0.1,
  },

  // Gold bar
  goldBar: {
    height: 3,
    backgroundColor: '#D4AF37',
    overflow: 'hidden',
  },
  goldBarShimmer: {
    position: 'absolute',
    top: 0, bottom: 0,
    width: 80,
    backgroundColor: 'rgba(255,255,255,0.4)',
    left: -80,
  },
  goldBarBottom: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    opacity: 0.5,
  },

  // Skip
  skipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 12,
    marginRight: 24,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    gap: 3,
  },
  skipText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  skipArrow: {
    color: '#D4AF37',
    fontSize: 18,
    lineHeight: 18,
    marginTop: -1,
  },

  // Center
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  // Logo
  logoArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    width: 160,
    height: 160,
  },
  logoCircle: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(212,175,55,0.1)',
    borderWidth: 2,
    borderColor: 'rgba(212,175,55,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  logoInnerRing: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.2)',
  },

  // Letters
  letterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  letter: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 3,
    marginHorizontal: 1,
    textShadowColor: 'rgba(212,175,55,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  divLine: {
    height: 1,
    backgroundColor: '#D4AF37',
    opacity: 0.6,
  },
  divDiamond: {
    color: '#D4AF37',
    fontSize: 14,
  },

  // Text block
  textBlock: {
    alignItems: 'center',
    marginBottom: 28,
  },
  tagline: {
    color: '#D4AF37',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  subText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  // Collection pills
  pillRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  pill: {
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    backgroundColor: 'rgba(212,175,55,0.06)',
  },
  pillText: {
    color: 'rgba(212,175,55,0.8)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
  },

  // Enter button
  btnWrap: {
    alignItems: 'center',
    paddingBottom: 16,
    width: '100%',
    paddingHorizontal: 28,
  },
  enterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#D4AF37',
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 50,
    width: '100%',
    justifyContent: 'center',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },
  enterText: {
    color: '#0a0810',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2.5,
  },
  enterHint: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 11,
    marginTop: 10,
    letterSpacing: 0.8,
  },
});
