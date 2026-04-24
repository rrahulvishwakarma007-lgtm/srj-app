import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Theme, Radius } from '../lib/theme';

interface Props {
  onFinish: () => void;
}

export default function IntroScreen({ onFinish }: Props) {
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.7)).current;

  const hasFinished = useRef(false);

  const finish = () => {
    if (hasFinished.current) return;
    hasFinished.current = true;

    Animated.timing(fade, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onFinish());
  };

  useEffect(() => {
    // Smooth entry animation
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();

    // ✅ GUARANTEED EXIT (no freeze)
    const timer = setTimeout(() => {
      finish();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.bgPurple} />

      {/* Gold top bar */}
      <View style={styles.goldBar} />

      {/* Skip button */}
      <TouchableOpacity style={styles.skip} onPress={finish}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Center content */}
      <Animated.View
        style={[
          styles.center,
          {
            opacity: fade,
            transform: [{ scale }],
          },
        ]}
      >
        {/* Icon */}
        <View style={styles.iconWrap}>
          <Ionicons name="diamond" size={56} color={Theme.gold} />
        </View>

        {/* Title */}
        <Text style={styles.title}>SRJ THE APP</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>By Shekhar Raja Jewellers</Text>

        {/* Ornament */}
        <View style={styles.ornament}>
          <View style={styles.ornLine} />
          <Ionicons name="diamond-outline" size={13} color={Theme.gold} />
          <View style={styles.ornLine} />
        </View>
      </Animated.View>

      {/* Enter button */}
      <TouchableOpacity style={styles.enterBtn} onPress={finish} activeOpacity={0.85}>
        <Text style={styles.enterText}>ENTER THE SHOWROOM</Text>
        <Ionicons name="arrow-forward" size={16} color={Theme.bgPurple} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.bgPurple,
    alignItems: 'center',
    justifyContent: 'center',
  },

  goldBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: Theme.gold,
  },

  skip: {
    position: 'absolute',
    top: 52,
    right: 24,
    padding: 8,
  },

  skipText: {
    color: Theme.textLightMuted,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },

  center: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  iconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(201,168,76,0.15)',
    borderWidth: 2,
    borderColor: 'rgba(201,168,76,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 10,
  },

  subtitle: {
    color: Theme.textLightMuted,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
  },

  ornament: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },

  ornLine: {
    width: 50,
    height: 1,
    backgroundColor: Theme.gold,
    marginHorizontal: 6,
  },

  enterBtn: {
    position: 'absolute',
    bottom: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Theme.gold,
    paddingVertical: 15,
    paddingHorizontal: 32,
    borderRadius: Radius.full,
  },

  enterText: {
    color: Theme.bgPurple,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2,
  },
});