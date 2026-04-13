import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withDelay, withRepeat,
  withSequence, withSpring, Easing, runOnJS
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const MAIN = 'SRJ THE APP';
const SUB = 'By Shekhar Raja Jewellers';

interface Props {
  onFinish: () => void;
}

// Simple, mobile-proven floating letter using safe easings
function FloatingLetter({ char, index }: { char: string; index: number }) {
  const y = useSharedValue(0);
  const rot = useSharedValue(0);
  const delay = index * 80;

  useEffect(() => {
    // Up-down float — safe pattern proven on iOS/Android
    y.value = withDelay(delay, withRepeat(
      withSequence(
        withTiming(-26, { duration: 1200, easing: Easing.out(Easing.quad) }),
        withTiming(22, { duration: 1300, easing: Easing.in(Easing.quad) })
      ), -1, true
    ));
    // Stronger visible tilt for mobile
    rot.value = withDelay(delay + 120, withRepeat(
      withSequence(
        withTiming(-8, { duration: 1250 }),
        withTiming(3, { duration: 1450 })
      ), -1, true
    ));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }, { rotate: rot.value + 'deg' }],
  }));

  return (
    <Animated.Text style={[styles.letter, style]}>{char === ' ' ? '\u00A0' : char}</Animated.Text>
  );
}

export default function IntroScreen({ onFinish }: Props) {
  const fade = useSharedValue(0);
  const slide = useSharedValue(50);
  const iconScale = useSharedValue(0.5);
  const iconRot = useSharedValue(-25);

  const subStyle = useAnimatedStyle(() => ({ opacity: fade.value, transform: [{ translateY: slide.value }] }));
  const iconStyle = useAnimatedStyle(() => ({ transform: [{ scale: iconScale.value }, { rotate: iconRot.value + 'deg' }] }));

  useEffect(() => {
    // Icon entrance — safe springs work everywhere
    iconScale.value = withDelay(180, withSpring(1, { damping: 11, stiffness: 100 }));
    iconRot.value = withDelay(180, withSpring(0, { damping: 13, stiffness: 90 }));

    // Subtitle fade + slide — safe timings
    fade.value = withDelay(700, withTiming(1, { duration: 800, easing: Easing.out(Easing.quad) }));
    slide.value = withDelay(700, withTiming(0, { duration: 800, easing: Easing.out(Easing.quad) }));

    // Auto finish after full reveal
    const t = setTimeout(() => finish(), 4800);
    return () => clearTimeout(t);
  }, []);

  const finish = () => {
    fade.value = withTiming(0, { duration: 380 });
    slide.value = withTiming(25, { duration: 380 });
    setTimeout(() => runOnJS(onFinish)(), 420);
  };

  return (
    <View style={styles.container}>
      <View style={styles.accentTop} />
      <View style={styles.accentBottom} />

      <TouchableOpacity style={styles.skip} onPress={finish} activeOpacity={0.7}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.center}>
        <Animated.Image source={{ uri: 'https://shekharrajajewellers.com/wp-content/uploads/2026/04/ChatGPT-Image-Apr-13-2026-04_01_08-PM.png' }} style={[styles.logoImg, iconStyle]} resizeMode="contain" />

        {/* Each letter floats — guaranteed on mobile */}
        <View style={styles.mainRow}>
          {MAIN.split('').map((ch, i) => (
            <FloatingLetter key={i} char={ch} index={i} />
          ))}
        </View>

        <Animated.Text style={[styles.sub, subStyle]}>{SUB}</Animated.Text>
      </View>

      <TouchableOpacity style={styles.enter} onPress={finish} activeOpacity={0.85}>
        <Text style={styles.enterText}>ENTER THE SHOWROOM</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A1B4D',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20
  },

  // subtle gold accents
  accentTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#D4AF37'
  },

  accentBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#D4AF37'
  },

  skip: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10
  },

  skipText: {
    color: '#D4AF37',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.5
  },

  center: {
    alignItems: 'center'
  },

  logoImg: {
    width: 92,
    height: 92,
    marginBottom: 20,
  },
  iconWrap: {
    marginBottom: 24,
    padding: 18,
    borderRadius: 50,
    backgroundColor: 'rgba(212,175,55,0.1)',
    borderWidth: 1,
    borderColor: '#D4AF37'
  },

  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },

  letter: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 3,
    marginHorizontal: 1
  },

  sub: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 3,
    marginTop: 18,
    textAlign: 'center'
  },

  enter: {
    position: 'absolute',
    bottom: 70,
    backgroundColor: '#D4AF37',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#D4AF37',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6
  },

  enterText: {
    color: '#1A1A1A',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2
  }
});
