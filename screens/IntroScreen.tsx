import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
        withTiming(-14, { duration: 1300, easing: Easing.out(Easing.quad) }),
        withTiming(12, { duration: 1400, easing: Easing.in(Easing.quad) })
      ), -1, true
    ));
    // Gentle tilt — also safe
    rot.value = withDelay(delay + 150, withRepeat(
      withSequence(
        withTiming(-3, { duration: 1350 }),
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
        <Animated.View style={[styles.iconWrap, iconStyle]}>
          <Ionicons name="diamond" size={66} color="#8C5C2D" />
        </Animated.View>

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
  container: { flex: 1, backgroundColor: '#F8F3ED', alignItems: 'center', justifyContent: 'center' },
  accentTop: { position: 'absolute', top: 0, left: 0, right: 0, height: 6, backgroundColor: '#8C5C2D' },
  accentBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, backgroundColor: '#8C5C2D' },
  skip: { position: 'absolute', top: 48, right: 22, padding: 10 },
  skipText: { color: '#7A4B6A', fontSize: 14, fontWeight: '700', letterSpacing: 1 },
  center: { alignItems: 'center' },
  iconWrap: { marginBottom: 16 },
  mainRow: { flexDirection: 'row', alignItems: 'center' },
  letter: { color: '#1F1414', fontSize: 32, fontWeight: '900', letterSpacing: 2, marginHorizontal: 1 },
  sub: { color: '#7A4B6A', fontSize: 15, fontWeight: '700', letterSpacing: 3, marginTop: 16, textAlign: 'center' },
  enter: { position: 'absolute', bottom: 66, backgroundColor: '#8C5C2D', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 28 },
  enterText: { color: '#F8F3ED', fontSize: 13, fontWeight: '800', letterSpacing: 2 },
});