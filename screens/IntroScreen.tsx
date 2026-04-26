import React, { useEffect, useRef } from 'react';
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

const { width: W, height: H } = Dimensions.get('window');

interface Props { onFinish: () => void; }

// ── Animated particle dot ─────────────────────────────────────────────────────
function Particle({ x, y, delay, size = 2 }: { x: number; y: number; delay: number; size?: number }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: -18, duration: 2400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0, duration: 800, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute', left: x, top: y,
        width: size, height: size, borderRadius: size / 2,
        backgroundColor: '#D4AF37',
        opacity, transform: [{ translateY }],
      }}
    />
  );
}

// ── Animated ring ─────────────────────────────────────────────────────────────
function Ring({ size, delay, duration }: { size: number; delay: number; duration: number }) {
  const scale   = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(scale,   { toValue: 1.5, duration, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.sequence([
            Animated.timing(opacity, { toValue: 0.5, duration: duration * 0.2, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0,   duration: duration * 0.8, useNativeDriver: true }),
          ]),
        ]),
        Animated.parallel([
          Animated.timing(scale,   { toValue: 0.6, duration: 0, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0,   duration: 0, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        width: size, height: size,
        borderRadius: size / 2,
        borderWidth: 1,
        borderColor: '#D4AF37',
        opacity, transform: [{ scale }],
      }}
    />
  );
}

export default function IntroScreen({ onFinish }: Props) {
  const hasFinished = useRef(false);

  // Master animations
  const bgOpacity      = useRef(new Animated.Value(0)).current;
  const logoScale      = useRef(new Animated.Value(0)).current;
  const logoOpacity    = useRef(new Animated.Value(0)).current;
  const lineWidth      = useRef(new Animated.Value(0)).current;
  const textOpacity    = useRef(new Animated.Value(0)).current;
  const textSlide      = useRef(new Animated.Value(30)).current;
  const tagOpacity     = useRef(new Animated.Value(0)).current;
  const pillsOpacity   = useRef(new Animated.Value(0)).current;
  const btnOpacity     = useRef(new Animated.Value(0)).current;
  const btnSlide       = useRef(new Animated.Value(40)).current;
  const screenFade     = useRef(new Animated.Value(1)).current;
  const shimmerX       = useRef(new Animated.Value(-W)).current;

  const finish = () => {
    if (hasFinished.current) return;
    hasFinished.current = true;
    Animated.timing(screenFade, {
      toValue: 0, duration: 500, easing: Easing.in(Easing.quad), useNativeDriver: true,
    }).start(() => onFinish());
  };

  useEffect(() => {
    // Staggered entrance sequence
    Animated.sequence([
      // 1. Background fades in
      Animated.timing(bgOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),

      // 2. Logo pops in
      Animated.parallel([
        Animated.spring(logoScale,   { toValue: 1, friction: 5, tension: 55, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),

      // 3. Line draws out
      Animated.timing(lineWidth, { toValue: 1, duration: 700, delay: 100, easing: Easing.out(Easing.quad), useNativeDriver: false }),

      // 4. Brand text rises
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(textSlide,   { toValue: 0, duration: 600, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]),

      // 5. Tagline
      Animated.timing(tagOpacity,   { toValue: 1, duration: 400, delay: 100, useNativeDriver: true }),

      // 6. Pills
      Animated.timing(pillsOpacity, { toValue: 1, duration: 400, delay: 100, useNativeDriver: true }),

      // 7. Button rises
      Animated.parallel([
        Animated.timing(btnOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(btnSlide,   { toValue: 0, friction: 7, tension: 50, useNativeDriver: true }),
      ]),
    ]).start();

    // Gold shimmer on logo — loops
    Animated.loop(
      Animated.sequence([
        Animated.delay(1800),
        Animated.timing(shimmerX, { toValue: W, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(shimmerX, { toValue: -W, duration: 0, useNativeDriver: true }),
      ])
    ).start();

    // Auto-exit after 5s
    const t = setTimeout(finish, 5000);
    return () => clearTimeout(t);
  }, []);

  const particles = [
    { x: W*0.08, y: H*0.15, delay: 0,    size: 2 },
    { x: W*0.85, y: H*0.18, delay: 600,  size: 3 },
    { x: W*0.15, y: H*0.72, delay: 300,  size: 2 },
    { x: W*0.88, y: H*0.65, delay: 900,  size: 2 },
    { x: W*0.48, y: H*0.08, delay: 450,  size: 3 },
    { x: W*0.25, y: H*0.88, delay: 150,  size: 2 },
    { x: W*0.72, y: H*0.82, delay: 750,  size: 3 },
    { x: W*0.92, y: H*0.40, delay: 200,  size: 2 },
    { x: W*0.04, y: H*0.45, delay: 1000, size: 2 },
    { x: W*0.60, y: H*0.92, delay: 550,  size: 3 },
  ];

  return (
    <Animated.View style={[styles.root, { opacity: screenFade }]}>
      <StatusBar barStyle="light-content" backgroundColor="#050308" />

      {/* ── Deep background with radial glow ── */}
      <Animated.View style={[StyleSheet.absoluteFill, styles.bg, { opacity: bgOpacity }]}>
        {/* Center radial glow */}
        <View style={styles.radialGlow} pointerEvents="none" />
        <View style={styles.radialGlow2} pointerEvents="none" />
        {/* Corner vignette */}
        <View style={styles.vignette} pointerEvents="none" />
      </Animated.View>

      {/* ── Floating gold particles ── */}
      {particles.map((p, i) => (
        <Particle key={i} x={p.x} y={p.y} delay={p.delay} size={p.size} />
      ))}

      {/* ── Top gold line ── */}
      <View style={styles.topBar} />

      <SafeAreaView style={styles.safe}>

        {/* ── Skip ── */}
        <TouchableOpacity style={styles.skip} onPress={finish} activeOpacity={0.7}>
          <Text style={styles.skipText}>SKIP</Text>
          <Text style={styles.skipArrow}> ›</Text>
        </TouchableOpacity>

        {/* ── Center logo block ── */}
        <View style={styles.center}>

          {/* Pulsing rings behind logo */}
          <View style={styles.ringsWrap} pointerEvents="none">
            <Ring size={160} delay={1200} duration={2200} />
            <Ring size={160} delay={2400} duration={2200} />
          </View>

          {/* Logo circle */}
          <Animated.View
            style={[styles.logoCircle, {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            }]}
          >
            {/* Shimmer sweep over logo */}
            <Animated.View
              style={[styles.logoShimmer, { transform: [{ translateX: shimmerX }] }]}
              pointerEvents="none"
            />
            <View style={styles.logoInner}>
              <Ionicons name="diamond" size={48} color="#D4AF37" />
            </View>
            <View style={styles.logoRingInner} />
          </Animated.View>

          {/* Divider line */}
          <Animated.View
            style={[styles.divider, {
              width: lineWidth.interpolate({ inputRange: [0, 1], outputRange: [0, 120] }),
            }]}
          />

          {/* Brand name */}
          <Animated.Text
            style={[styles.brandName, {
              opacity: textOpacity,
              transform: [{ translateY: textSlide }],
            }]}
          >
            SHEKHAR RAJA
          </Animated.Text>

          <Animated.Text
            style={[styles.brandSub, {
              opacity: textOpacity,
              transform: [{ translateY: textSlide }],
            }]}
          >
            J E W E L L E R S
          </Animated.Text>

          {/* Bottom divider */}
          <Animated.View
            style={[styles.divider, { marginTop: 14,
              width: lineWidth.interpolate({ inputRange: [0, 1], outputRange: [0, 80] }),
            }]}
          />

          {/* Est. tagline */}
          <Animated.Text style={[styles.tagline, { opacity: tagOpacity }]}>
            EST. 1987 · JABALPUR, MP
          </Animated.Text>

          {/* Category pills */}
          <Animated.View style={[styles.pillRow, { opacity: pillsOpacity }]}>
            {['Gold', 'Diamond', 'Bridal', 'Silver'].map((t, i) => (
              <View key={i} style={styles.pill}>
                <Text style={styles.pillText}>{t}</Text>
              </View>
            ))}
          </Animated.View>

        </View>

        {/* ── Enter button ── */}
        <Animated.View
          style={[styles.btnWrap, {
            opacity: btnOpacity,
            transform: [{ translateY: btnSlide }],
          }]}
        >
          <TouchableOpacity
            style={styles.enterBtn}
            onPress={finish}
            activeOpacity={0.88}
          >
            <View style={styles.enterBtnInner}>
              <Text style={styles.enterText}>ENTER THE SHOWROOM</Text>
              <View style={styles.enterArrow}>
                <Ionicons name="arrow-forward" size={15} color="#050308" />
              </View>
            </View>
          </TouchableOpacity>
          <Text style={styles.enterHint}>Explore our exclusive collection</Text>
        </Animated.View>

      </SafeAreaView>

      {/* ── Bottom gold line ── */}
      <View style={styles.bottomBar} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#050308',
  },

  bg: {
    backgroundColor: '#070410',
  },

  // Radial glows — fake gradient with View
  radialGlow: {
    position: 'absolute',
    width: W * 1.4,
    height: W * 1.4,
    borderRadius: W * 0.7,
    backgroundColor: 'rgba(100,60,180,0.07)',
    top: H * 0.15,
    alignSelf: 'center',
  },
  radialGlow2: {
    position: 'absolute',
    width: W * 0.9,
    height: W * 0.9,
    borderRadius: W * 0.45,
    backgroundColor: 'rgba(212,175,55,0.05)',
    top: H * 0.25,
    alignSelf: 'center',
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    // simulated with border shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 80,
  },

  topBar: {
    height: 2,
    backgroundColor: '#D4AF37',
    opacity: 0.8,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 2,
    backgroundColor: '#D4AF37',
    opacity: 0.4,
  },

  safe: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 28,
  },

  // Skip
  skip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 14,
    marginRight: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.15)',
  },
  skipText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2.5,
  },
  skipArrow: {
    color: '#D4AF37',
    fontSize: 16,
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

  // Rings
  ringsWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 160,
    height: 160,
  },

  // Logo
  logoCircle: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: 'rgba(212,175,55,0.06)',
    borderWidth: 1.5,
    borderColor: 'rgba(212,175,55,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    overflow: 'hidden',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  logoInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRingInner: {
    position: 'absolute',
    width: 94,
    height: 94,
    borderRadius: 47,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.15)',
  },
  logoShimmer: {
    position: 'absolute',
    top: 0, bottom: 0,
    width: 60,
    backgroundColor: 'rgba(255,255,255,0.12)',
    transform: [{ skewX: '-20deg' }],
    zIndex: 2,
  },

  // Dividers
  divider: {
    height: 1,
    backgroundColor: '#D4AF37',
    opacity: 0.5,
    marginBottom: 18,
  },

  // Brand name
  brandName: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 6,
    marginBottom: 6,
    textShadowColor: 'rgba(212,175,55,0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  brandSub: {
    color: '#D4AF37',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 9,
    marginBottom: 4,
    opacity: 0.9,
  },

  tagline: {
    color: 'rgba(255,255,255,0.28)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    marginTop: 12,
    marginBottom: 24,
    textTransform: 'uppercase',
  },

  // Category pills
  pillRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  pill: {
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.22)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    backgroundColor: 'rgba(212,175,55,0.05)',
  },
  pillText: {
    color: 'rgba(212,175,55,0.7)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },

  // Enter button
  btnWrap: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 28,
    paddingBottom: 8,
  },
  enterBtn: {
    width: '100%',
    borderRadius: 50,
    backgroundColor: '#D4AF37',
    overflow: 'hidden',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
    marginBottom: 12,
  },
  enterBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 17,
    paddingHorizontal: 28,
    gap: 12,
  },
  enterText: {
    color: '#050308',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2.5,
  },
  enterArrow: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(5,3,8,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  enterHint: {
    color: 'rgba(255,255,255,0.18)',
    fontSize: 11,
    letterSpacing: 0.8,
  },
});
