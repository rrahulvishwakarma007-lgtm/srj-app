import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions, SafeAreaView, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// Deep royal violet theme
const BG = '#7A4B6A';
const GOLD = '#D4AF37';
const CREAM = '#F8F3ED';
const DEEP = '#1F1414';
const MUTED = '#E8D9C8';

interface VideoReel {
  id: number;
  name: string;
  desc: string;
  price: number;
  purity: string;
  videoUrl?: string;
  thumb?: any;
}

const VIDEO_URL_1 = 'https://shekharrajajewellers.com/wp-content/uploads/2026/04/designarena_video_stwfb1l3.mp4';
const VIDEO_URL_2 = 'https://shekharrajajewellers.com/wp-content/uploads/2026/04/designarena_video_qyp6b0di.mp4';

const videos: VideoReel[] = [
  { id: 0, name: 'Design Arena — Signature Collection', desc: 'Exclusive Shekhar Raja Jewellers reel — craftsmanship in motion', price: 0, purity: '22K', videoUrl: VIDEO_URL_1 },
  { id: 0.5, name: 'Design Arena — Royal Edit', desc: 'Exclusive Shekhar Raja Jewellers reel — elegance in motion', price: 0, purity: '22K', videoUrl: VIDEO_URL_2 },
  { id: 1, name: 'Heritage Bridal Necklace', desc: '22K Polki & Emeralds — heirloom craftsmanship', price: 245000, purity: '22K' },
  { id: 2, name: 'Royal Solitaire Ring', desc: '1.2ct VVS Diamond in 22K antique gold', price: 124000, purity: '22K' },
  { id: 3, name: 'Kundan Choker Set', desc: '22K gold with natural pearls — couture grace', price: 167000, purity: '22K' },
  { id: 4, name: 'Temple Pendant & Earrings', desc: 'Handcrafted 22K with rubies — sacred elegance', price: 89000, purity: '22K' },
];

interface Props { onViewProduct?: (reel: VideoReel) => void; }

// --- Web-only inline auto-play video (NO new tab) ---
function WebVideo({ url, isActive }: { url: string; isActive: boolean }) {
  if (Platform.OS !== 'web') return null;
  return (
    <video
      src={url}
      style={{ width: '100%', height: '100%', objectFit: 'cover', backgroundColor: '#000' }}
      autoPlay={isActive}
      muted
      loop
      playsInline
      controls={false}
      onClick={(e) => { e.currentTarget.paused ? e.currentTarget.play() : e.currentTarget.pause(); }}
    />
  );
}

// --- Reels-style single reel card ---
function ReelCard({ item, isActive, onLike, onWish, onTapProduct, liked, wish, likes }: {
  item: VideoReel; isActive: boolean; onLike: () => void; onWish: () => void; onTapProduct?: () => void;
  liked: boolean; wish: boolean; likes: number;
}) {
  const pulse = useSharedValue(1);
  const shimmer = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(withSequence(withTiming(0.85, { duration: 900 }), withTiming(1, { duration: 900 })), -1, true);
    shimmer.value = withRepeat(withSequence(withTiming(1, { duration: 1800 }), withTiming(0, { duration: 1800 })), -1, false);
  }, []);
  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));
  const shimmerStyle = useAnimatedStyle(() => ({ opacity: 0.12 + shimmer.value * 0.16 }));

  return (
    <View style={styles.reel}>
      {/* VIDEO AREA — auto plays IN SAME WINDOW (web inline video, mobile beautiful placeholder) */}
      <View style={styles.videoArea}>
        {Platform.OS === 'web' && item.videoUrl ? (
          <WebVideo url={item.videoUrl} isActive={isActive} />
        ) : (
          // Mobile / no video URL — elegant jewelry visual with floating play hint
          <View style={styles.placeholder}>
            <View style={styles.placeholderInner}>
              <Animated.View style={[styles.playHint, pulseStyle]}>
                <Ionicons name="play-circle" size={92} color={GOLD} />
              </Animated.View>
              <Animated.View style={[styles.shimmer, shimmerStyle]} />
            </View>
            <Text style={styles.placeholderLabel}>Auto-play on web • Swipe for next</Text>
          </View>
        )}
      </View>

      {/* RIGHT ACTION BAR — Reels style */}
      <View style={styles.rightBar}>
        <TouchableOpacity style={styles.action} onPress={onLike}>
          <Ionicons name={liked ? 'heart' : 'heart-outline'} size={28} color={liked ? '#E25555' : CREAM} />
          <Text style={styles.actionCount}>{likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action} onPress={onWish}>
          <Ionicons name={wish ? 'bookmark' : 'bookmark-outline'} size={26} color={wish ? GOLD : CREAM} />
        </TouchableOpacity>
        {item.price > 0 && (
          <TouchableOpacity style={styles.action} onPress={onTapProduct}>
            <Ionicons name="diamond-outline" size={26} color={GOLD} />
          </TouchableOpacity>
        )}
      </View>

      {/* BOTTOM INFO */}
      <View style={styles.bottomInfo}>
        <Text style={styles.reelName}>{item.name}</Text>
        <Text style={styles.reelDesc}>{item.desc}</Text>
        {item.price > 0 && <Text style={styles.reelPrice}>₹{item.price.toLocaleString('en-IN')} • {item.purity}</Text>}
      </View>

      {/* TAP TO PAUSE/PLAY hint (web) */}
      {Platform.OS === 'web' && item.videoUrl && isActive && (
        <TouchableOpacity style={styles.tapHint} onPress={() => {}}>
          <Text style={styles.tapHintText}>Tap video to pause/play</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function VideoShowcaseScreen({ onViewProduct }: Props) {
  const [index, setIndex] = useState(0);
  const [likes, setLikes] = useState<{ [k: number]: number }>({ 1: 124, 2: 89, 3: 156, 4: 67 });
  const [liked, setLiked] = useState<{ [k: number]: boolean }>({});
  const [wish, setWish] = useState<{ [k: number]: boolean }>({});
  const listRef = useRef<FlatList<VideoReel>>(null);

  const current = videos[index];

  // Reels-style vertical snap paging
  const onViewable = useRef(({ viewableItems }: any) => {
    if (viewableItems?.length) {
      const i = viewableItems[0].index ?? 0;
      if (i !== index) setIndex(i);
    }
  }).current;

  const toggleLike = (id: number) => {
    const nowLiked = !liked[id];
    setLiked({ ...liked, [id]: nowLiked });
    setLikes({ ...likes, [id]: (likes[id] || 50) + (nowLiked ? 1 : -1) });
  };
  const toggleWish = (id: number) => setWish({ ...wish, [id]: !wish[id] });

  const scrollTo = (i: number) => {
    listRef.current?.scrollToIndex({ index: i, animated: true });
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={listRef}
        data={videos}
        keyExtractor={(v) => String(v.id)}
        renderItem={({ item, index: i }) => (
          <ReelCard
            item={item}
            isActive={i === index}
            onLike={() => toggleLike(item.id)}
            onWish={() => toggleWish(item.id)}
            onTapProduct={() => onViewProduct && onViewProduct(item)}
            liked={!!liked[item.id]}
            wish={!!wish[item.id]}
            likes={likes[item.id] || 50}
          />
        )}
        pagingEnabled
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewable}
        viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
        getItemLayout={(_, i) => ({ length: height, offset: height * i, index: i })}
        initialNumToRender={2}
      />

      {/* Small page dots */}
      <View style={styles.dots}>
        {videos.map((_, i) => (
          <TouchableOpacity key={i} onPress={() => scrollTo(i)}>
            <View style={[styles.dot, i === index && styles.dotActive]} />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  reel: { width, height, backgroundColor: '#000', justifyContent: 'flex-end' },
  videoArea: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000' },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#111' },
  placeholderInner: { alignItems: 'center', justifyContent: 'center' },
  playHint: { marginBottom: 12 },
  shimmer: { position: 'absolute', top: -60, left: -80, right: -80, height: 120, backgroundColor: GOLD, borderRadius: 60 },
  placeholderLabel: { color: MUTED, fontSize: 12, marginTop: 14, letterSpacing: 1 },

  rightBar: { position: 'absolute', right: 14, bottom: 140, alignItems: 'center' },
  action: { alignItems: 'center', marginVertical: 14 },
  actionCount: { color: CREAM, fontSize: 12, marginTop: 3, fontWeight: '700' },

  bottomInfo: { position: 'absolute', left: 16, right: 90, bottom: 44 },
  reelName: { color: CREAM, fontSize: 18, fontWeight: '800', letterSpacing: 0.3 },
  reelDesc: { color: MUTED, fontSize: 13, marginTop: 6, lineHeight: 18 },
  reelPrice: { color: GOLD, fontSize: 15, fontWeight: '900', marginTop: 10, letterSpacing: 0.4 },

  tapHint: { position: 'absolute', bottom: 100, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.35)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  tapHintText: { color: CREAM, fontSize: 11, letterSpacing: 1 },

  dots: { position: 'absolute', right: 10, top: height * 0.4, alignItems: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.3)', marginVertical: 5 },
  dotActive: { backgroundColor: GOLD, height: 18 },
});