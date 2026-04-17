import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const MAIN = 'SRJ THE APP';
const SUB = 'By Shekhar Raja Jewellers';

interface Props {
  onFinish: () => void;
}

function FloatLetter({ char, delay }: { char: string; delay: number }) {
  const y = useRef(new Animated.Value(0)).current;
  const rot = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(y, { toValue: -14, duration: 1400, easing: Easing.inOut(Easing.sin), delay, useNativeDriver: true }),
        Animated.timing(y, { toValue: 12, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    const loopRot = Animated.loop(
      Animated.sequence([
        Animated.timing(rot, { toValue: -5, duration: 1500, delay: delay + 150, useNativeDriver: true }),
        Animated.timing(rot, { toValue: 5, duration: 1700, useNativeDriver: true }),
      ])
    );
    loop.start();
    loopRot.start();
    return () => { loop.stop(); loopRot.stop(); };
  }, []);

  return (
    <Animated.Text style={[styles.letter, { transform: [{ translateY: y }, { rotate: rot.interpolate({ inputRange: [-10, 10], outputRange: ['-10deg', '10deg'] }) }] }]}>
      {char === ' ' ? '\u00A0' : char}
    </Animated.Text>
  );
}

export default function IntroScreen({ onFinish }: Props) {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(50)).current;
  const iconScale = useRef(new Animated.Value(0.5)).current;
  const iconRot = useRef(new Animated.Value(-25)).current;

  const finish = () => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 0, duration: 350, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 30, duration: 350, useNativeDriver: true }),
    ]).start(() => onFinish());
  };

  useEffect(() => {
    // Icon entrance
    Animated.parallel([
      Animated.spring(iconScale, { toValue: 1, friction: 6, tension: 60, useNativeDriver: true }),
      Animated.spring(iconRot, { toValue: 0, friction: 7, tension: 50, useNativeDriver: true }),
    ]).start();

    // Subtitle fade + slide
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 800, delay: 800, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 800, delay: 800, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();

    // Auto finish
    const t = setTimeout(finish, 4800);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.accentTop} />
      <View style={styles.accentBottom} />

      <TouchableOpacity style={styles.skip} onPress={finish} activeOpacity={0.7}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.center}>
        {/* Diamond icon with spring entrance */}
        <Animated.View style={{ transform: [{ scale: iconScale }, { rotate: iconRot.interpolate({ inputRange: [-30, 30], outputRange: ['-30deg', '30deg'] }) }] }}>
          <Ionicons name="diamond" size={68} color="#8C5C2D" />
        </Animated.View>

        {/* SRJ THE APP — each letter floats beautifully */}
        <View style={styles.mainRow}>
          {MAIN.split('').map((ch, i) => (
            <FloatLetter key={i} char={ch} delay={i * 70} />
          ))}
        </View>

        {/* Subtitle fades + slides up */}
        <Animated.Text style={[styles.sub, { opacity: fade, transform: [{ translateY: slide }] }]}>{SUB}</Animated.Text>
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
  skip: { position: 'absolute', top: 50, right: 24, padding: 8 },
  skipText: { color: '#7A4B6A', fontSize: 14, fontWeight: '700', letterSpacing: 1 },
  center: { alignItems: 'center' },
  mainRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
  letter: { color: '#1F1414', fontSize: 34, fontWeight: '900', letterSpacing: 3, marginHorizontal: 1 },
  sub: { color: '#7A4B6A', fontSize: 15, fontWeight: '700', letterSpacing: 3, marginTop: 18, textAlign: 'center' },
  enter: { position: 'absolute', bottom: 70, backgroundColor: '#8C5C2D', paddingVertical: 14, paddingHorizontal: 34, borderRadius: 28 },
  enterText: { color: '#F8F3ED', fontSize: 13, fontWeight: '800', letterSpacing: 2 },
});