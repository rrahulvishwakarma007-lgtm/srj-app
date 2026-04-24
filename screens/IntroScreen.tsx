import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Theme, Radius } from '../lib/theme';

const MAIN = 'SRJ THE APP';
const SUB  = 'By Shekhar Raja Jewellers';

interface Props { onFinish: () => void; }

function FloatLetter({ char, delay }: { char: string; delay: number }) {
  const y   = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(y, { toValue: -10, duration: 1400, easing: Easing.inOut(Easing.sin), delay, useNativeDriver: true }),
      Animated.timing(y, { toValue:   8, duration: 1600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, []);
  return (
    <Animated.Text style={[styles.letter, { transform: [{ translateY: y }] }]}>
      {char === ' ' ? '\u00A0' : char}
    </Animated.Text>
  );
}

export default function IntroScreen({ onFinish }: Props) {
  const fade      = useRef(new Animated.Value(0)).current;
  const slide     = useRef(new Animated.Value(40)).current;
  const iconScale = useRef(new Animated.Value(0.5)).current;
  const bgAnim    = useRef(new Animated.Value(0)).current;

  const finish = () => {
    Animated.timing(fade, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => onFinish());
  };

  useEffect(() => {
    Animated.spring(iconScale, { toValue: 1, friction: 6, tension: 55, useNativeDriver: true }).start();
    Animated.parallel([
      Animated.timing(fade,  { toValue: 1, duration: 800, delay: 700, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 800, delay: 700, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();
    const t = setTimeout(finish, 4800);
    return () => clearTimeout(t);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.bgPurple} />

      {/* Gold top bar */}
      <View style={styles.goldBar} />

      <TouchableOpacity style={styles.skip} onPress={finish}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.center}>
        {/* Icon */}
        <Animated.View style={[styles.iconWrap, { transform: [{ scale: iconScale }] }]}>
          <Ionicons name="diamond" size={56} color={Theme.gold} />
        </Animated.View>

        {/* Floating title */}
        <View style={styles.mainRow}>
          {MAIN.split('').map((ch, i) => <FloatLetter key={i} char={ch} delay={i * 70} />)}
        </View>

        {/* Subtitle */}
        <Animated.Text style={[styles.sub, { opacity: fade, transform: [{ translateY: slide }] }]}>
          {SUB}
        </Animated.Text>

        {/* Ornament */}
        <Animated.View style={[styles.ornament, { opacity: fade }]}>
          <View style={styles.ornLine} />
          <Ionicons name="diamond-outline" size={13} color={Theme.gold} />
          <View style={styles.ornLine} />
        </Animated.View>
      </View>

      <TouchableOpacity style={styles.enterBtn} onPress={finish} activeOpacity={0.85}>
        <Text style={styles.enterText}>ENTER THE SHOWROOM</Text>
        <Ionicons name="arrow-forward" size={16} color={Theme.bgPurple} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.bgPurple, alignItems: 'center', justifyContent: 'center' },
  goldBar:   { position: 'absolute', top: 0, left: 0, right: 0, height: 4, backgroundColor: Theme.gold },
  skip:      { position: 'absolute', top: 52, right: 24, padding: 8 },
  skipText:  { color: Theme.textLightMuted, fontSize: 14, fontWeight: '700', letterSpacing: 1 },
  center:    { alignItems: 'center', paddingHorizontal: 24 },
  iconWrap:  {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(201,168,76,0.15)',
    borderWidth: 2, borderColor: 'rgba(201,168,76,0.4)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 22,
  },
  mainRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16 },
  letter:  { color: '#FFFFFF', fontSize: 30, fontWeight: '900', letterSpacing: 2, marginHorizontal: 1 },
  sub:     { color: Theme.textLightMuted, fontSize: 14, fontWeight: '700', letterSpacing: 3, textAlign: 'center' },
  ornament:{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 22 },
  ornLine: { width: 50, height: 1, backgroundColor: Theme.gold },
  enterBtn:{
    position: 'absolute', bottom: 56,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Theme.gold,
    paddingVertical: 15, paddingHorizontal: 32, borderRadius: Radius.full,
  },
  enterText: { color: Theme.bgPurple, fontSize: 13, fontWeight: '900', letterSpacing: 2 },
});