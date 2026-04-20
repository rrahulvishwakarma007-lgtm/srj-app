import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Dimensions, ActivityIndicator, Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { listenReels, FireReel } from '../lib/firestore';

const { width: W, height: H } = Dimensions.get('window');

const GOLD        = '#C9A84C';
const GOLD_LIGHT  = '#F0D080';
const PURPLE_DARK = '#2D1B5E';
const WHATSAPP    = '#25D366';

export default function ReelsScreen() {
  const insets  = useSafeAreaInsets();
  const [reels, setReels]     = useState<FireReel[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [liked, setLiked]     = useState<Set<string>>(new Set());
  const flatRef = useRef<FlatList>(null);

  useEffect(() => {
    // Real-time listener — new reels appear instantly
    const unsub = listenReels(data => {
      setReels(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const toggleLike = (id: string) => {
    setLiked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const enquire = (reel: FireReel) => {
    const msg = `Hi! I saw your reel "${reel.title}" and I'm interested. Can you share more details?`;
    Linking.openURL(`https://wa.me/918377911745?text=${encodeURIComponent(msg)}`);
  };

  if (loading) {
    return (
      <View style={[styles.loader, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={GOLD} />
        <Text style={styles.loaderText}>Loading Reels...</Text>
      </View>
    );
  }

  if (reels.length === 0) {
    return (
      <View style={[styles.empty, { paddingTop: insets.top }]}>
        <View style={styles.emptyIcon}>
          <Ionicons name="videocam-off-outline" size={52} color={GOLD} />
        </View>
        <Text style={styles.emptyTitle}>No Reels Yet</Text>
        <Text style={styles.emptyDesc}>
          New jewellery reels will appear here automatically as soon as they're uploaded.
        </Text>
        <TouchableOpacity
          style={styles.waBtn}
          onPress={() => Linking.openURL('https://wa.me/918377911745')}
        >
          <Ionicons name="logo-whatsapp" size={18} color="#fff" />
          <Text style={styles.waBtnText}>Chat with Us</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Jewellery Reels</Text>
          <Text style={styles.headerSub}>{reels.length} videos • Tap to play</Text>
        </View>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      <FlatList
        ref={flatRef}
        data={reels}
        keyExtractor={r => r.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={e => {
          setActiveIdx(Math.round(e.nativeEvent.contentOffset.y / (H - insets.top - 64)));
        }}
        renderItem={({ item, index }) => (
          <ReelItem
            reel={item}
            isActive={index === activeIdx}
            liked={liked.has(item.id)}
            onLike={() => toggleLike(item.id)}
            onEnquire={() => enquire(item)}
            height={H - insets.top - 64}
          />
        )}
      />
    </View>
  );
}

function ReelItem({
  reel, isActive, liked, onLike, onEnquire, height,
}: {
  reel: FireReel;
  isActive: boolean;
  liked: boolean;
  onLike: () => void;
  onEnquire: () => void;
  height: number;
}) {
  const videoRef = useRef<any>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.playAsync().catch(() => {});
      } else {
        videoRef.current.pauseAsync().catch(() => {});
      }
    }
  }, [isActive]);

  return (
    <View style={[styles.reelContainer, { height }]}>
      <Video
        ref={videoRef}
        source={{ uri: reel.videoUrl }}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay={isActive}
        isMuted={false}
      />

      {/* Gradient overlay */}
      <View style={styles.overlay} />

      {/* Info at bottom */}
      <View style={styles.reelInfo}>
        <Text style={styles.reelTitle}>{reel.title}</Text>
        <Text style={styles.reelLikes}>
          {(reel.likes + (liked ? 1 : 0)).toLocaleString()} likes
        </Text>
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={onLike}>
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={28}
            color={liked ? '#FF4D6D' : '#fff'}
          />
          <Text style={styles.actionText}>
            {(reel.likes + (liked ? 1 : 0)).toLocaleString()}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={onEnquire}>
          <View style={styles.waCircle}>
            <Ionicons name="logo-whatsapp" size={24} color="#fff" />
          </View>
          <Text style={styles.actionText}>Enquire</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="share-social-outline" size={26} color="#fff" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Brand watermark */}
      <View style={styles.watermark}>
        <Ionicons name="diamond" size={12} color={GOLD} />
        <Text style={styles.watermarkText}>Shekhar Raja Jewellers</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: '#000' },

  loader: { flex: 1, backgroundColor: PURPLE_DARK, alignItems: 'center', justifyContent: 'center', gap: 14 },
  loaderText: { color: GOLD, fontSize: 14, fontWeight: '700' },

  empty: { flex: 1, backgroundColor: PURPLE_DARK, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyIcon: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(201,168,76,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  emptyTitle: { color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 10 },
  emptyDesc:  { color: 'rgba(255,255,255,0.6)', fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  waBtn:      { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: WHATSAPP, borderRadius: 28, paddingVertical: 13, paddingHorizontal: 24 },
  waBtnText:  { color: '#fff', fontSize: 15, fontWeight: '800' },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: PURPLE_DARK, paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(201,168,76,0.3)',
  },
  headerTitle: { color: GOLD, fontSize: 18, fontWeight: '800' },
  headerSub:   { color: 'rgba(240,208,128,0.6)', fontSize: 11, marginTop: 2 },
  liveBadge:   { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(201,168,76,0.15)', borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 },
  liveDot:     { width: 7, height: 7, borderRadius: 4, backgroundColor: GOLD },
  liveText:    { color: GOLD, fontSize: 10, fontWeight: '800', letterSpacing: 1 },

  // Reel
  reelContainer: { width: W, backgroundColor: '#000' },
  overlay:       { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)' },
  reelInfo: {
    position: 'absolute', bottom: 80, left: 16, right: 80,
  },
  reelTitle: { color: '#fff', fontSize: 16, fontWeight: '800', textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  reelLikes: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4 },

  // Action buttons
  actions: {
    position: 'absolute', right: 12, bottom: 100,
    alignItems: 'center', gap: 20,
  },
  actionBtn:  { alignItems: 'center', gap: 4 },
  actionText: { color: '#fff', fontSize: 11, fontWeight: '700', textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
  waCircle:   { width: 44, height: 44, borderRadius: 22, backgroundColor: WHATSAPP, alignItems: 'center', justifyContent: 'center' },

  // Watermark
  watermark: {
    position: 'absolute', top: 16, left: 16,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(45,27,94,0.6)', borderRadius: 99,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  watermarkText: { color: GOLD, fontSize: 10, fontWeight: '700' },
});
