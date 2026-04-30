import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, FlatList, Dimensions, StyleSheet,
  TouchableOpacity, TouchableWithoutFeedback,
  Animated, Platform, Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';

const { height: H, width: W } = Dimensions.get('window');

const GOLD        = '#C9A84C';
const PURPLE_DARK = '#2D1B5E';
const WHATSAPP    = '#25D366';

interface Reel {
  id: string; video: string; title: string;
  description: string; price?: string;
  likes?: number; productTag?: string;
}

const STATIC_REELS: Reel[] = [
  { id:'1', video:'https://shekharrajajewellers.com/wp-content/uploads/2026/04/output_1280x720-2.mp4',       title:'Bridal Gold Necklace',   description:'Handcrafted 22K gold bridal necklace set. Perfect for your special day.',        price:'₹45,000',  likes:1240, productTag:'Bridal Collection'   },
  { id:'2', video:'https://shekharrajajewellers.com/wp-content/uploads/2026/04/fe0d718a-3c3c-11f1-a24c-0242ac110005_796673563858693_raw.mp4', title:'Diamond Earrings', description:'Elegant diamond drop earrings in 18K white gold. BIS certified.', price:'₹28,500', likes:980, productTag:'Diamond Series' },
  { id:'3', video:'https://shekharrajajewellers.com/wp-content/uploads/2026/04/output_1280x720-3.mp4',       title:'Gold Bangles Set',       description:'Traditional gold bangles set in 22K. Available in all sizes.',               price:'₹32,000',  likes:2100, productTag:'Festive Wear'        },
  { id:'4', video:'https://shekharrajajewellers.com/wp-content/uploads/2026/04/output_1280x720-1.mp4',       title:'Kundan Maang Tikka',     description:'Royal Kundan maang tikka with meenakari work. Jabalpur special.',            price:'₹12,800',  likes:1560, productTag:'Traditional'          },
  { id:'5', video:'https://shekharrajajewellers.com/wp-content/uploads/2026/04/6d320b70-3c3d-11f1-aa4d-0242ac110005_796674326651013_raw.mp4', title:'Gold Chain Collection', description:'Everyday wear 22K gold chains. Hallmark certified 916.', price:'₹18,000', likes:870, productTag:'Daily Wear' },
  { id:'6', video:'https://shekharrajajewellers.com/wp-content/uploads/2026/04/01ff1192-3c3b-11f1-b0f4-0242ac110005_796670073065541_raw.mp4', title:'Antique Choker', description:'Temple jewellery antique gold choker necklace. One of a kind piece.', price:'₹55,000', likes:3200, productTag:'Antique Collection' },
  { id:'7', video:'https://shekharrajajewellers.com/wp-content/uploads/2026/04/276a2d60-3c3e-11f1-ba39-0242ac110005_796675607015813_raw.mp4', title:'Ring Collection', description:'Solitaire and cocktail rings in 18K and 22K gold.', price:'₹9,500', likes:1100, productTag:'Ring Collection' },
  { id:'8', video:'https://shekharrajajewellers.com/wp-content/uploads/2026/04/output_1280x720.mp4',          title:'Bridal Jewellery Set',   description:'Complete bridal set — necklace, earrings, maang tikka and bangles.',           price:'₹1,20,000',likes:4500, productTag:'Bridal Set'          },
  { id:'9', video:'https://shekharrajajewellers.com/wp-content/uploads/2026/04/60a0807c-3c3c-11f1-abe8-0242ac110005_796672481322309_raw.mp4', title:'Silver Jewellery', description:'999 pure silver anklets, rings and chains. BIS hallmarked.', price:'₹3,200', likes:760, productTag:'Silver Collection' },
];

// ── Single Reel ───────────────────────────────────────────────────────────────
function ReelItem({ item, isActive, reelHeight }: { item: Reel; isActive: boolean; reelHeight: number }) {
  const videoRef = useRef<Video>(null);
  const infoAnim = useRef(new Animated.Value(0)).current;

  const [liked,      setLiked]      = useState(false);
  const [likeCount,  setLikeCount]  = useState(item.likes ?? 999);
  const [videoError, setVideoError] = useState(false);
  const [paused,     setPaused]     = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;
    try {
      if (isActive && !paused) videoRef.current.playAsync();
      else                     videoRef.current.pauseAsync();
    } catch (_) {}
  }, [isActive, paused]);

  useEffect(() => {
    if (isActive) {
      Animated.spring(infoAnim, {
        toValue: 1, useNativeDriver: true, delay: 300, speed: 12,
      }).start();
    } else {
      infoAnim.setValue(0);
      setPaused(false);
    }
  }, [isActive]);

  const handleLike = () => {
    setLiked(l => { setLikeCount(c => l ? c - 1 : c + 1); return !l; });
  };

  const handleEnquire = () => {
    const msg =
      `Hello! I saw your reel about "${item.title}" (${item.price ?? ''}) and I'm interested. ` +
      `Can you share more details?`;
    Linking.openURL(`https://wa.me/918377911745?text=${encodeURIComponent(msg)}`);
  };

  const formatCount = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;

  return (
    <View style={{ height: reelHeight, width: W, backgroundColor: '#000' }}>

      {/* ── VIDEO ── */}
      {videoError ? (
        <View style={[StyleSheet.absoluteFill, styles.videoFallback]}>
          <Ionicons name="videocam-off-outline" size={48} color={GOLD} />
          <Text style={styles.videoFallbackText}>Video unavailable</Text>
        </View>
      ) : (
        <Video
          ref={videoRef}
          source={{ uri: item.video }}
          style={StyleSheet.absoluteFill}
          resizeMode={ResizeMode.COVER}
          isLooping
          isMuted={false}
          shouldPlay={isActive && !paused}
          useNativeControls={false}
          onError={() => setVideoError(true)}
        />
      )}

      {/* Overlays */}
      <View style={styles.overlayTop} pointerEvents="none" />
      <View style={[styles.overlayBottom, { height: reelHeight * 0.5 }]} pointerEvents="none" />

      {/* Tap to pause/play */}
      <TouchableWithoutFeedback onPress={() => setPaused(p => !p)}>
        <View style={StyleSheet.absoluteFill} />
      </TouchableWithoutFeedback>

      {/* Pause icon */}
      {paused && (
        <View style={styles.pauseWrap} pointerEvents="none">
          <Ionicons name="play" size={56} color="rgba(255,255,255,0.75)" />
        </View>
      )}

      {/* ── BOTTOM INFO ── */}
      <Animated.View
        style={[styles.bottomInfo, {
          opacity: infoAnim,
          transform: [{ translateY: infoAnim.interpolate({ inputRange:[0,1], outputRange:[30,0] }) }],
        }]}
        pointerEvents="box-none"
      >
        <View style={styles.sellerRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>S</Text>
          </View>
          <Text style={styles.sellerName}>Shekhar Raja Jewellers</Text>
        </View>
        <Text style={styles.reelTitle}>{item.title}</Text>
        <Text style={styles.reelDesc} numberOfLines={2}>{item.description}</Text>
        {item.productTag && (
          <View style={styles.productTag}>
            <Ionicons name="diamond-outline" size={11} color={GOLD} />
            <Text style={styles.productTagText}>{item.productTag}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.enquireBtn} onPress={handleEnquire} activeOpacity={0.88}>
          <Ionicons name="logo-whatsapp" size={16} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.enquireBtnText}>Enquire on WhatsApp</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* ── SIDEBAR ── */}
      <View style={styles.sidebar}>
        <TouchableOpacity style={styles.sideAction} onPress={handleLike} activeOpacity={0.7}>
          <Ionicons name={liked ? 'heart' : 'heart-outline'} size={28} color={liked ? '#FF3B5C' : '#fff'} />
          <Text style={styles.sideLabel}>{formatCount(likeCount)}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sideAction} onPress={handleEnquire} activeOpacity={0.7}>
          <View style={styles.waCircle}>
            <Ionicons name="logo-whatsapp" size={22} color="#fff" />
          </View>
          <Text style={styles.sideLabel}>Enquire</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sideAction} activeOpacity={0.7}>
          <Ionicons name="share-social-outline" size={26} color="#fff" />
          <Text style={styles.sideLabel}>Share</Text>
        </TouchableOpacity>
        {item.price && (
          <View style={styles.priceBubble}>
            <Text style={styles.priceText}>{item.price}</Text>
          </View>
        )}
      </View>

      {/* Watermark */}
      <View style={styles.watermark} pointerEvents="none">
        <Ionicons name="diamond" size={10} color={GOLD} />
        <Text style={styles.watermarkText}>SRJ</Text>
      </View>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function ReelsScreen() {
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);

  // Single source of truth — used by BOTH FlatList AND ReelItem
  const REEL_H = H - insets.top - 50;

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) setActiveIndex(viewableItems[0].index ?? 0);
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 80 }).current;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>

      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="diamond" size={16} color={GOLD} />
        <Text style={styles.headerTitle}>Jewellery Reels</Text>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      <FlatList
        data={STATIC_REELS}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <ReelItem
            item={item}
            isActive={index === activeIndex}
            reelHeight={REEL_H}
          />
        )}
        pagingEnabled
        snapToInterval={REEL_H}
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: REEL_H,
          offset: REEL_H * index,
          index,
        })}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
        removeClippedSubviews={Platform.OS === 'android'}
      />
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000' },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: PURPLE_DARK,
    paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: 'rgba(201,168,76,0.3)',
    height: 50,
  },
  headerTitle: { color: GOLD, fontSize: 16, fontWeight: '800', flex: 1 },
  liveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(201,168,76,0.12)',
    borderRadius: 99, paddingHorizontal: 8, paddingVertical: 3,
  },
  liveDot:  { width: 6, height: 6, borderRadius: 3, backgroundColor: GOLD },
  liveText: { color: GOLD, fontSize: 9, fontWeight: '800', letterSpacing: 1 },

  overlayTop: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 100,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  overlayBottom: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  videoFallback: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#111' },
  videoFallbackText: { color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 10 },

  pauseWrap: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },

  bottomInfo: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 80 : 60,
    left: 16, right: 80, zIndex: 10,
  },
  sellerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: GOLD, alignItems: 'center', justifyContent: 'center',
    marginRight: 8, borderWidth: 1.5, borderColor: '#fff',
  },
  avatarText: { color: PURPLE_DARK, fontWeight: '900', fontSize: 13 },
  sellerName: {
    color: '#fff', fontWeight: '700', fontSize: 13, flex: 1,
    textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width:0, height:1 }, textShadowRadius: 4,
  },
  reelTitle: {
    color: '#fff', fontSize: 16, fontWeight: '800', marginBottom: 3,
    textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width:0, height:1 }, textShadowRadius: 6,
  },
  reelDesc: {
    color: 'rgba(255,255,255,0.8)', fontSize: 12, lineHeight: 17, marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width:0, height:1 }, textShadowRadius: 4,
  },
  productTag: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start',
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.4)', marginBottom: 10,
  },
  productTagText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  enquireBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: WHATSAPP, borderRadius: 20,
    paddingVertical: 8, paddingHorizontal: 14, alignSelf: 'flex-start',
  },
  enquireBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  sidebar: {
    position: 'absolute', right: 12,
    bottom: Platform.OS === 'ios' ? 80 : 60,
    alignItems: 'center', zIndex: 10, gap: 20,
  },
  sideAction: { alignItems: 'center', gap: 3 },
  sideLabel: {
    color: 'rgba(255,255,255,0.9)', fontSize: 10, fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width:0, height:1 }, textShadowRadius: 3,
  },
  waCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: WHATSAPP, alignItems: 'center', justifyContent: 'center',
  },
  priceBubble: {
    backgroundColor: GOLD, borderRadius: 16,
    paddingHorizontal: 10, paddingVertical: 5, marginTop: 4,
  },
  priceText: { color: PURPLE_DARK, fontWeight: '900', fontSize: 11 },

  watermark: {
    position: 'absolute', top: 12, left: 12,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(45,27,94,0.6)',
    borderRadius: 99, paddingHorizontal: 8, paddingVertical: 3,
  },
  watermarkText: { color: GOLD, fontSize: 9, fontWeight: '700' },
});