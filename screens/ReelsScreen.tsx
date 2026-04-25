import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  StatusBar,
  Platform,
} from 'react-native';
import { Video, AVPlaybackStatus, ResizeMode } from 'expo-av';

const { height, width } = Dimensions.get('window');

// ─── Types ────────────────────────────────────────────────────────────────────
interface Reel {
  id: string;
  video: string;
  title: string;
  description: string;
  price?: string;
  likes?: number;
  sellerName?: string;
  productTag?: string;
}

// ─── Static reels data (Firebase removed) ────────────────────────────────────
// Google Drive direct stream URLs (converted from /view to /uc?export=download)
const STATIC_REELS: Reel[] = [
  {
    id: '1',
    video: 'https://drive.google.com/uc?export=download&id=1-8is5IeWhZXz6kWmGIhuIgi74RSOuSnZ',
    title: 'Bridal Gold Necklace',
    description: 'Handcrafted 22K gold bridal necklace set. Perfect for your special day.',
    price: '₹45,000',
    likes: 1240,
    sellerName: 'Shekhar Raja Jewellers',
    productTag: 'Bridal Collection',
  },
  {
    id: '2',
    video: 'https://drive.google.com/uc?export=download&id=1sGVW9RvOjAo0Vg1bZ-LXqS9K9z3dvpVD',
    title: 'Diamond Earrings',
    description: 'Elegant diamond drop earrings in 18K white gold. BIS certified.',
    price: '₹28,500',
    likes: 980,
    sellerName: 'Shekhar Raja Jewellers',
    productTag: 'Diamond Series',
  },
  {
    id: '3',
    video: 'https://drive.google.com/uc?export=download&id=1otONCb9EFly1lzoAvM6gpwPggn2Qh4sN',
    title: 'Gold Bangles Set',
    description: 'Traditional gold bangles set in 22K. Available in all sizes.',
    price: '₹32,000',
    likes: 2100,
    sellerName: 'Shekhar Raja Jewellers',
    productTag: 'Festive Wear',
  },
  {
    id: '4',
    video: 'https://drive.google.com/uc?export=download&id=12zi8LoBiFNCUoV7jvMBFBtJ8IwfDK5Kv',
    title: 'Kundan Maang Tikka',
    description: 'Royal Kundan maang tikka with meenakari work. Jabalpur special.',
    price: '₹12,800',
    likes: 1560,
    sellerName: 'Shekhar Raja Jewellers',
    productTag: 'Traditional',
  },
  {
    id: '5',
    video: 'https://drive.google.com/uc?export=download&id=1RaMe--i_sjdYPgmmOeeOsr8tuAfR4KZu',
    title: 'Gold Chain Collection',
    description: 'Everyday wear 22K gold chains. Hallmark certified 916.',
    price: '₹18,000',
    likes: 870,
    sellerName: 'Shekhar Raja Jewellers',
    productTag: 'Daily Wear',
  },
  {
    id: '6',
    video: 'https://drive.google.com/uc?export=download&id=10-hAogqUc9GQi58KfphW8JXnw8Dm0D66',
    title: 'Antique Choker',
    description: 'Temple jewellery antique gold choker necklace. One of a kind piece.',
    price: '₹55,000',
    likes: 3200,
    sellerName: 'Shekhar Raja Jewellers',
    productTag: 'Antique Collection',
  },
  {
    id: '7',
    video: 'https://drive.google.com/uc?export=download&id=1DaXGPoioNWS2d8KdYeBIatu6P03lrddN',
    title: 'Ring Collection',
    description: 'Solitaire and cocktail rings in 18K and 22K gold. All sizes available.',
    price: '₹9,500',
    likes: 1100,
    sellerName: 'Shekhar Raja Jewellers',
    productTag: 'Ring Collection',
  },
  {
    id: '8',
    video: 'https://drive.google.com/uc?export=download&id=1nEtghqzYirRswJoUMyocYXNNWJzighjI',
    title: 'Bridal Jewellery Set',
    description: 'Complete bridal set — necklace, earrings, maang tikka and bangles.',
    price: '₹1,20,000',
    likes: 4500,
    sellerName: 'Shekhar Raja Jewellers',
    productTag: 'Bridal Set',
  },
  {
    id: '9',
    video: 'https://drive.google.com/uc?export=download&id=1wXwgqalnETlvSuLX2rSq5kPg6GI5-A8W',
    title: 'Silver Jewellery',
    description: '999 pure silver anklets, rings and chains. BIS hallmarked.',
    price: '₹3,200',
    likes: 760,
    sellerName: 'Shekhar Raja Jewellers',
    productTag: 'Silver Collection',
  },
];

// ─── Heart burst animation ────────────────────────────────────────────────────
const HeartBurst = ({ visible }: { visible: boolean }) => {
  const scale   = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scale.setValue(0);
      opacity.setValue(1);
      Animated.parallel([
        Animated.spring(scale,   { toValue: 1.4, useNativeDriver: true, speed: 20 }),
        Animated.sequence([
          Animated.delay(300),
          Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;
  return (
    <Animated.View style={[styles.heartBurst, { transform: [{ scale }], opacity }]}>
      <Text style={{ fontSize: 80 }}>♥</Text>
    </Animated.View>
  );
};

// ─── Single Reel Item ─────────────────────────────────────────────────────────
const ReelItem = ({ item, isActive }: { item: Reel; isActive: boolean }) => {
  const videoRef          = useRef<Video>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likes ?? Math.floor(Math.random() * 9000) + 1000);
  const [muted, setMuted]         = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [paused, setPaused]       = useState(false);
  const [showPauseIcon, setShowPauseIcon] = useState(false);
  const [progress, setProgress]   = useState(0);

  const pauseIconOpacity = useRef(new Animated.Value(0)).current;
  const sidebarAnim      = useRef(new Animated.Value(0)).current;
  const infoAnim         = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      videoRef.current?.playAsync();
      Animated.parallel([
        Animated.spring(sidebarAnim, { toValue: 1, useNativeDriver: true, delay: 200, speed: 12 }),
        Animated.spring(infoAnim,    { toValue: 1, useNativeDriver: true, delay: 400, speed: 12 }),
      ]).start();
    } else {
      videoRef.current?.pauseAsync();
      sidebarAnim.setValue(0);
      infoAnim.setValue(0);
      setPaused(false);
    }
  }, [isActive]);

  const lastTap = useRef<number>(0);

  const handleDoubleTap = useCallback(() => {
    if (!liked) { setLiked(true); setLikeCount(c => c + 1); }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 900);
  }, [liked]);

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      handleDoubleTap();
    } else {
      setPaused(p => {
        const next = !p;
        if (next) videoRef.current?.pauseAsync();
        else      videoRef.current?.playAsync();
        setShowPauseIcon(true);
        Animated.sequence([
          Animated.timing(pauseIconOpacity, { toValue: 1, duration: 100, useNativeDriver: true }),
          Animated.delay(600),
          Animated.timing(pauseIconOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start(() => setShowPauseIcon(false));
        return next;
      });
    }
    lastTap.current = now;
  };

  const handleLike = () => {
    setLiked(l => { setLikeCount(c => l ? c - 1 : c + 1); return !l; });
  };

  const onPlaybackUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded && status.durationMillis) {
      setProgress((status.positionMillis ?? 0) / status.durationMillis);
    }
  };

  const formatCount = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;

  return (
    <View style={styles.reelContainer}>
      <StatusBar hidden />

      {/* Full-screen video */}
      <TouchableWithoutFeedback onPress={handleTap}>
        <View style={StyleSheet.absoluteFill}>
          <Video
            ref={videoRef}
            source={{ uri: item.video }}
            style={StyleSheet.absoluteFill}
            resizeMode={ResizeMode.COVER}
            isLooping
            isMuted={muted}
            onPlaybackStatusUpdate={onPlaybackUpdate}
          />
          <View style={styles.gradientOverlayTop}  pointerEvents="none" />
          <View style={styles.gradientOverlayBottom} pointerEvents="none" />
        </View>
      </TouchableWithoutFeedback>

      <HeartBurst visible={showHeart} />

      {showPauseIcon && (
        <Animated.View style={[styles.pauseIcon, { opacity: pauseIconOpacity }]}>
          <Text style={styles.pauseIconText}>{paused ? '▶' : '⏸'}</Text>
        </Animated.View>
      )}

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
      </View>

      {/* Bottom info */}
      <Animated.View
        style={[styles.bottomInfo, {
          opacity: infoAnim,
          transform: [{ translateY: infoAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
        }]}
        pointerEvents="none"
      >
        <View style={styles.sellerRow}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitial}>
              {(item.sellerName ?? 'S')[0].toUpperCase()}
            </Text>
          </View>
          <Text style={styles.sellerName}>{item.sellerName ?? 'Shekhar Raja Jewellers'}</Text>
          <View style={styles.followBadge}>
            <Text style={styles.followText}>Follow</Text>
          </View>
        </View>
        <Text style={styles.reelTitle}>{item.title}</Text>
        <Text style={styles.reelDesc} numberOfLines={2}>{item.description}</Text>
        {item.productTag && (
          <View style={styles.productTag}>
            <Text style={styles.productTagIcon}>◈</Text>
            <Text style={styles.productTagText}>{item.productTag}</Text>
          </View>
        )}
      </Animated.View>

      {/* Right sidebar */}
      <Animated.View
        style={[styles.sidebar, {
          opacity: sidebarAnim,
          transform: [{ translateX: sidebarAnim.interpolate({ inputRange: [0, 1], outputRange: [60, 0] }) }],
        }]}
      >
        <TouchableOpacity style={styles.sideAction} onPress={handleLike} activeOpacity={0.7}>
          <Text style={[styles.sideIcon, liked && styles.sideIconLiked]}>{liked ? '♥' : '♡'}</Text>
          <Text style={styles.sideLabel}>{formatCount(likeCount)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sideAction} activeOpacity={0.7}>
          <Text style={styles.sideIcon}>💬</Text>
          <Text style={styles.sideLabel}>Comment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sideAction} activeOpacity={0.7}>
          <Text style={styles.sideIcon}>↗</Text>
          <Text style={styles.sideLabel}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sideAction} onPress={() => setMuted(m => !m)} activeOpacity={0.7}>
          <Text style={styles.sideIcon}>{muted ? '🔇' : '🔊'}</Text>
          <Text style={styles.sideLabel}>{muted ? 'Unmute' : 'Mute'}</Text>
        </TouchableOpacity>

        {item.price && (
          <View style={styles.priceBubble}>
            <Text style={styles.priceText}>{item.price}</Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ReelsScreen() {
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) setActiveIndex(viewableItems[0].index ?? 0);
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 80 }).current;

  return (
    <View style={styles.screen}>
      <FlatList
        data={STATIC_REELS}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <ReelItem item={item} isActive={index === activeIndex} />
        )}
        pagingEnabled
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({ length: height, offset: height * index, index })}
        initialNumToRender={2}
        maxToRenderPerBatch={3}
        windowSize={5}
        removeClippedSubviews
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen:         { flex: 1, backgroundColor: '#000' },
  reelContainer:  { height, width, backgroundColor: '#000' },

  gradientOverlayTop: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 120, backgroundColor: 'rgba(0,0,0,0.25)',
  },
  gradientOverlayBottom: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: height * 0.5, backgroundColor: 'rgba(0,0,0,0.45)',
  },

  heartBurst: {
    position: 'absolute', alignSelf: 'center',
    top: height / 2 - 60, zIndex: 99,
  },
  pauseIcon: {
    position: 'absolute', alignSelf: 'center',
    top: height / 2 - 40, zIndex: 98,
    backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 50,
    width: 80, height: 80, alignItems: 'center', justifyContent: 'center',
  },
  pauseIconText:  { fontSize: 32, color: '#fff' },

  progressBar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 2, backgroundColor: 'rgba(255,255,255,0.2)', zIndex: 10,
  },
  progressFill:   { height: 2, backgroundColor: '#D4AF37' },

  bottomInfo: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 80,
    left: 16, right: 80, zIndex: 10,
  },
  sellerRow:      { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatarPlaceholder: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#D4AF37', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#fff', marginRight: 8,
  },
  avatarInitial:  { color: '#1a1209', fontWeight: '800', fontSize: 14 },
  sellerName: {
    color: '#fff', fontWeight: '700', fontSize: 14, letterSpacing: 0.4, flex: 1,
    textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4,
  },
  followBadge: {
    borderWidth: 1.5, borderColor: '#D4AF37',
    borderRadius: 14, paddingHorizontal: 12, paddingVertical: 3,
  },
  followText:     { color: '#D4AF37', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  reelTitle: {
    color: '#fff', fontSize: 17, fontWeight: '800', letterSpacing: 0.3, marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 6,
  },
  reelDesc: {
    color: 'rgba(255,255,255,0.85)', fontSize: 13, lineHeight: 18,
    textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4,
    marginBottom: 10,
  },
  productTag: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 5, alignSelf: 'flex-start',
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.5)',
  },
  productTagIcon: { color: '#D4AF37', fontSize: 12, marginRight: 5 },
  productTagText: { color: '#fff', fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },

  sidebar: {
    position: 'absolute', right: 12,
    bottom: Platform.OS === 'ios' ? 100 : 80,
    alignItems: 'center', zIndex: 10,
  },
  sideAction:     { alignItems: 'center', marginBottom: 22 },
  sideIcon: {
    fontSize: 28, color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4,
  },
  sideIconLiked:  { color: '#FF3B5C' },
  sideLabel: {
    color: 'rgba(255,255,255,0.9)', fontSize: 11,
    marginTop: 3, fontWeight: '600', letterSpacing: 0.2,
  },
  priceBubble: {
    backgroundColor: '#D4AF37', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 6, marginTop: 4,
    shadowColor: '#D4AF37', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7, shadowRadius: 8, elevation: 6,
  },
  priceText:      { color: '#1a1209', fontWeight: '900', fontSize: 12, letterSpacing: 0.5 },
});
