import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList,
  PanResponder, Animated, Alert, Dimensions, Platform,
  ActivityIndicator, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Theme, Radius } from '../lib/theme';
import { products } from '../lib/data';
import { Product } from '../lib/types';

// ─────────────────────────────────────────────────────────────────────────────
// Try to import camera — graceful fallback if not installed
// ─────────────────────────────────────────────────────────────────────────────
let CameraView: any = null;
let useCameraPermissions: any = null;
let MediaLibrary: any = null;

try {
  const cam = require('expo-camera');
  CameraView = cam.CameraView;
  useCameraPermissions = cam.useCameraPermissions;
} catch { /* camera not installed */ }

try {
  MediaLibrary = require('expo-media-library');
} catch { /* media library not installed */ }

const { width: SW, height: SH } = Dimensions.get('window');
const CAMERA_H = SH * 0.58;

// Default jewellery positions per category (% of camera area)
const DEFAULT_POS: Record<string, { x: number; y: number }> = {
  Necklaces:  { x: SW / 2 - 30, y: CAMERA_H * 0.60 },
  Earrings:   { x: SW / 2 - 60, y: CAMERA_H * 0.30 },
  Rings:      { x: SW / 2 - 20, y: CAMERA_H * 0.72 },
  Bracelets:  { x: SW / 2 - 40, y: CAMERA_H * 0.75 },
  Pendants:   { x: SW / 2 - 20, y: CAMERA_H * 0.55 },
};

// ─────────────────────────────────────────────────────────────────────────────
// Draggable Jewellery Overlay
// ─────────────────────────────────────────────────────────────────────────────
function DraggableJewel({ product, visible }: { product: Product; visible: boolean }) {
  const defaultPos = DEFAULT_POS[product.category] || { x: SW / 2 - 20, y: CAMERA_H * 0.5 };
  const pan = useRef(new Animated.ValueXY({ x: defaultPos.x, y: defaultPos.y })).current;
  const lastPan = useRef({ x: defaultPos.x, y: defaultPos.y });

  // Reset position when product changes
  React.useEffect(() => {
    const pos = DEFAULT_POS[product.category] || { x: SW / 2 - 20, y: CAMERA_H * 0.5 };
    pan.setValue(pos);
    lastPan.current = pos;
  }, [product.id]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder:  () => true,
      onPanResponderGrant: () => {
        pan.setOffset({ x: lastPan.current.x, y: lastPan.current.y });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (_, g) => {
        pan.flattenOffset();
        lastPan.current = { x: lastPan.current.x + g.dx, y: lastPan.current.y + g.dy };
      },
    })
  ).current;

  if (!visible) return null;

  const size = product.category === 'Earrings' ? 42 : product.category === 'Rings' || product.category === 'Pendants' ? 36 : 52;

  return (
    <Animated.View
      style={[styles.draggable, { transform: pan.getTranslateTransform() }]}
      {...panResponder.panHandlers}
    >
      {/* Glow ring */}
      <View style={[styles.jewelGlow, { width: size + 20, height: size + 20, borderRadius: (size + 20) / 2 }]} />

      {/* If product has image, show it; else show icon */}
      {product.image ? (
        <Image
          source={{ uri: product.image }}
          style={{ width: size + 10, height: size + 10, borderRadius: (size + 10) / 2 }}
          resizeMode="cover"
        />
      ) : (
        <Ionicons name={product.icon as any} size={size} color={Theme.gold} />
      )}

      {/* Drag hint */}
      <View style={styles.dragHint}>
        <Ionicons name="move-outline" size={10} color="rgba(255,255,255,0.8)" />
      </View>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Second earring (mirrored for Earrings category)
// ─────────────────────────────────────────────────────────────────────────────
function SecondEarring({ product, visible }: { product: Product; visible: boolean }) {
  if (product.category !== 'Earrings' || !visible) return null;
  const pan = useRef(new Animated.ValueXY({
    x: SW / 2 + 20,
    y: CAMERA_H * 0.30,
  })).current;
  const lastPan = useRef({ x: SW / 2 + 20, y: CAMERA_H * 0.30 });

  React.useEffect(() => {
    pan.setValue({ x: SW / 2 + 20, y: CAMERA_H * 0.30 });
    lastPan.current = { x: SW / 2 + 20, y: CAMERA_H * 0.30 };
  }, [product.id]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder:  () => true,
      onPanResponderGrant: () => {
        pan.setOffset({ x: lastPan.current.x, y: lastPan.current.y });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (_, g) => {
        pan.flattenOffset();
        lastPan.current = { x: lastPan.current.x + g.dx, y: lastPan.current.y + g.dy };
      },
    })
  ).current;

  return (
    <Animated.View
      style={[styles.draggable, { transform: pan.getTranslateTransform() }]}
      {...panResponder.panHandlers}
    >
      <View style={[styles.jewelGlow, { width: 62, height: 62, borderRadius: 31 }]} />
      {product.image
        ? <Image source={{ uri: product.image }} style={{ width: 42, height: 42, borderRadius: 21 }} resizeMode="cover" />
        : <Ionicons name={product.icon as any} size={42} color={Theme.gold} />
      }
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NO CAMERA FALLBACK — shown when expo-camera not installed
// ─────────────────────────────────────────────────────────────────────────────
function NoCameraFallback({ product, wearing }: { product: Product; wearing: boolean }) {
  const pos = DEFAULT_POS[product.category] || { x: SW / 2 - 20, y: 160 };

  return (
    <View style={styles.mockCamera}>
      {/* Silhouette */}
      <View style={styles.silhouette}>
        <View style={styles.silHead} />
        <View style={styles.silNeck} />
        <View style={styles.silBody} />
        {/* Jewellery overlay */}
        {wearing && (
          <View style={[styles.silJewel, {
            top: product.category === 'Necklaces' ? 120 :
                 product.category === 'Earrings'  ? 60  :
                 product.category === 'Bracelets' ? 200 : 100,
            left: product.category === 'Earrings' ? 30 : SW / 2 - 80,
          }]}>
            {product.image
              ? <Image source={{ uri: product.image }} style={{ width: 50, height: 50, borderRadius: 25 }} resizeMode="cover" />
              : <Ionicons name={product.icon as any} size={44} color={Theme.gold} />
            }
          </View>
        )}
        {wearing && product.category === 'Earrings' && (
          <View style={[styles.silJewel, { top: 60, right: 30 }]}>
            {product.image
              ? <Image source={{ uri: product.image }} style={{ width: 50, height: 50, borderRadius: 25 }} resizeMode="cover" />
              : <Ionicons name={product.icon as any} size={44} color={Theme.gold} />
            }
          </View>
        )}
      </View>

      {/* Install hint */}
      <View style={styles.installHint}>
        <Ionicons name="camera-outline" size={16} color="rgba(255,255,255,0.7)" />
        <Text style={styles.installHintText}>
          Run: npx expo install expo-camera expo-media-library{'\n'}for live camera try-on
        </Text>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────────────────────────────────────
export default function TryBeforeBuyScreen() {
  const [selected, setSelected] = useState<Product>(products[0]);
  const [wearing, setWearing]   = useState(true);
  const [facing, setFacing]     = useState<'front' | 'back'>('front');
  const [saving, setSaving]     = useState(false);
  const cameraRef = useRef<any>(null);

  // Camera permissions
  const permResult = useCameraPermissions ? useCameraPermissions() : [null, null];
  const [permission, requestPermission] = permResult;

  // Media library permission
  const [mediaPermission, requestMediaPermission] = MediaLibrary
    ? MediaLibrary.usePermissions()
    : [null, null];

  const cameraAvailable = !!CameraView && !!useCameraPermissions;

  // ── Take Photo ──
  const takePhoto = async () => {
    if (!cameraRef.current || !cameraAvailable) {
      Alert.alert('Camera Required', 'Please install expo-camera to take photos.\n\nnpx expo install expo-camera expo-media-library');
      return;
    }
    try {
      setSaving(true);
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.9 });

      if (MediaLibrary) {
        if (!mediaPermission?.granted) await requestMediaPermission();
        await MediaLibrary.saveToLibraryAsync(photo.uri);
        Alert.alert('✓ Saved!', 'Photo saved to your gallery.');
      } else {
        Alert.alert('Photo Taken', 'Install expo-media-library to save to gallery.');
      }
    } catch (e) {
      Alert.alert('Error', 'Could not take photo. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── Camera View ──
  const renderCamera = () => {
    if (!cameraAvailable) {
      return <NoCameraFallback product={selected} wearing={wearing} />;
    }
    if (!permission) {
      return (
        <View style={styles.permWrap}>
          <ActivityIndicator size="large" color={Theme.gold} />
        </View>
      );
    }
    if (!permission.granted) {
      return (
        <View style={styles.permWrap}>
          <Ionicons name="camera-outline" size={52} color={Theme.gold} />
          <Text style={styles.permTitle}>Camera Access Required</Text>
          <Text style={styles.permSub}>To try jewellery on yourself, we need camera permission.</Text>
          <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
            <Text style={styles.permBtnTxt}>Allow Camera</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.cameraWrap}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
        />
        {/* Jewellery overlay on camera */}
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <DraggableJewel product={selected} visible={wearing} />
          <SecondEarring product={selected} visible={wearing} />
        </View>
        {/* Guide overlay */}
        {wearing && (
          <View style={styles.guideOverlay} pointerEvents="none">
            <Text style={styles.guideText}>👆 Drag jewellery to position</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>SHEKHAR RAJA JEWELLERS</Text>
          <Text style={styles.title}>Virtual Try-On</Text>
        </View>
        <View style={styles.headerBadge}>
          <Ionicons name="sparkles" size={14} color={Theme.gold} />
          <Text style={styles.headerBadgeTxt}>AR Feature</Text>
        </View>
      </View>
      <View style={styles.goldLine} />

      {/* ── Camera / Preview Area ── */}
      <View style={[styles.cameraArea, { height: CAMERA_H }]}>
        {renderCamera()}

        {/* Camera controls overlay */}
        <View style={styles.cameraControls} pointerEvents="box-none">
          {/* Flip camera */}
          {cameraAvailable && permission?.granted && (
            <TouchableOpacity
              style={styles.camControlBtn}
              onPress={() => setFacing(f => f === 'front' ? 'back' : 'front')}
            >
              <Ionicons name="camera-reverse-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Action Bar ── */}
      <View style={styles.actionBar}>
        {/* Wear / Remove */}
        <TouchableOpacity
          style={[styles.actionBtn, wearing && styles.actionBtnActive]}
          onPress={() => setWearing(w => !w)}
        >
          <Ionicons name={wearing ? 'eye-off-outline' : 'eye-outline'} size={18} color={wearing ? '#FFFFFF' : Theme.purple} />
          <Text style={[styles.actionBtnTxt, wearing && styles.actionBtnTxtActive]}>
            {wearing ? 'Remove' : 'Wear It'}
          </Text>
        </TouchableOpacity>

        {/* Take Photo */}
        <TouchableOpacity style={styles.snapBtn} onPress={takePhoto} disabled={saving}>
          {saving
            ? <ActivityIndicator size="small" color="#FFFFFF" />
            : <><Ionicons name="camera" size={22} color="#FFFFFF" /><Text style={styles.snapBtnTxt}>Take Photo</Text></>
          }
        </TouchableOpacity>
      </View>

      {/* ── Selected Product Info ── */}
      <View style={styles.selectedInfo}>
        <View style={styles.selectedImgWrap}>
          {selected.image
            ? <Image source={{ uri: selected.image }} style={styles.selectedImg} resizeMode="cover" />
            : <Ionicons name={selected.icon as any} size={28} color={Theme.gold} />
          }
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.selectedName} numberOfLines={1}>{selected.name}</Text>
          <Text style={styles.selectedMeta}>{selected.category} · {selected.purity} · {selected.weight}g</Text>
        </View>
        <View style={styles.selectedPill}>
          <Text style={styles.selectedPillTxt}>
            {wearing ? '✓ Wearing' : 'Removed'}
          </Text>
        </View>
      </View>

      {/* ── Product Picker ── */}
      <Text style={styles.pickLabel}>Choose a Piece to Try</Text>
      <FlatList
        data={products}
        keyExtractor={p => String(p.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pickRow}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.pickCard, selected.id === item.id && styles.pickCardActive]}
            onPress={() => { setSelected(item); setWearing(true); }}
            activeOpacity={0.85}
          >
            <View style={[styles.pickImg, selected.id === item.id && styles.pickImgActive]}>
              {item.image
                ? <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%', borderRadius: Radius.md }} resizeMode="cover" />
                : <Ionicons name={item.icon as any} size={26} color={selected.id === item.id ? '#FFFFFF' : Theme.gold} />
              }
            </View>
            <Text style={[styles.pickName, selected.id === item.id && styles.pickNameActive]} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.pickCat}>{item.category}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.bgPrimary },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18, paddingTop: 14, paddingBottom: 14,
    backgroundColor: Theme.bgPurple,
  },
  eyebrow:      { color: Theme.gold, fontSize: 10, fontWeight: '800', letterSpacing: 2.5, marginBottom: 4 },
  title:        { color: '#FFFFFF', fontSize: 22, fontWeight: '900' },
  headerBadge:  { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(201,168,76,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full, borderWidth: 1, borderColor: 'rgba(201,168,76,0.4)' },
  headerBadgeTxt: { color: Theme.gold, fontSize: 11, fontWeight: '800' },
  goldLine:     { height: 3, backgroundColor: Theme.gold },

  // Camera area
  cameraArea:   { width: '100%', backgroundColor: '#1A0533', overflow: 'hidden' },
  cameraWrap:   { flex: 1 },
  camera:       { flex: 1 },

  // Camera controls
  cameraControls: {
    position: 'absolute', top: 12, right: 12,
    gap: 10, alignItems: 'flex-end',
    pointerEvents: 'box-none',
  },
  camControlBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },

  // Guide overlay
  guideOverlay: {
    position: 'absolute', bottom: 14, left: 0, right: 0,
    alignItems: 'center',
  },
  guideText: {
    color: '#FFFFFF', fontSize: 12, fontWeight: '700',
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: Radius.full,
  },

  // Draggable jewel
  draggable: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  jewelGlow: {
    position: 'absolute',
    backgroundColor: 'rgba(201,168,76,0.25)',
    borderWidth: 1.5, borderColor: 'rgba(201,168,76,0.5)',
  },
  dragHint: {
    position: 'absolute', bottom: -8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8, padding: 2,
  },

  // Permission screen
  permWrap: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: 30, backgroundColor: '#1A0533',
  },
  permTitle:  { color: '#FFFFFF', fontSize: 18, fontWeight: '800', marginTop: 16, textAlign: 'center' },
  permSub:    { color: Theme.textLightMuted, fontSize: 13, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  permBtn:    { backgroundColor: Theme.gold, paddingVertical: 14, paddingHorizontal: 28, borderRadius: Radius.full, marginTop: 22 },
  permBtnTxt: { color: '#1A0533', fontSize: 14, fontWeight: '900', letterSpacing: 1 },

  // No camera fallback
  mockCamera: {
    flex: 1, backgroundColor: '#2D1254',
    alignItems: 'center', justifyContent: 'center',
  },
  silhouette: { width: SW * 0.7, height: CAMERA_H * 0.82, position: 'relative', alignItems: 'center' },
  silHead:    { width: 90, height: 110, borderRadius: 45, backgroundColor: '#C4A882', marginTop: 20 },
  silNeck:    { width: 30, height: 30, backgroundColor: '#C4A882' },
  silBody:    { width: 160, height: 160, backgroundColor: '#9B7B5B', borderRadius: 20, opacity: 0.5 },
  silJewel:   { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  installHint:{
    position: 'absolute', bottom: 10,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.md, marginHorizontal: 20,
  },
  installHintText: { color: 'rgba(255,255,255,0.7)', fontSize: 10, lineHeight: 15 },

  // Action bar
  actionBar: {
    flexDirection: 'row', gap: 12,
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1, borderTopColor: Theme.border,
  },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 12, paddingHorizontal: 18,
    borderRadius: Radius.lg,
    backgroundColor: Theme.bgCardPurple,
    borderWidth: 1, borderColor: Theme.purpleBorder,
  },
  actionBtnActive:    { backgroundColor: Theme.bgPurple, borderColor: Theme.bgPurple },
  actionBtnTxt:       { color: Theme.purple, fontSize: 13, fontWeight: '800' },
  actionBtnTxtActive: { color: '#FFFFFF' },
  snapBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Theme.bgPurple, paddingVertical: 12, borderRadius: Radius.lg,
  },
  snapBtnTxt: { color: '#FFFFFF', fontSize: 14, fontWeight: '900' },

  // Selected info
  selectedInfo: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Theme.border,
  },
  selectedImgWrap: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Theme.bgCardPurple,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Theme.purpleBorder, overflow: 'hidden',
  },
  selectedImg:     { width: '100%', height: '100%' },
  selectedName:    { color: Theme.textDark, fontSize: 14, fontWeight: '800' },
  selectedMeta:    { color: Theme.textMuted, fontSize: 11, marginTop: 3 },
  selectedPill:    {
    backgroundColor: Theme.bgCardPurple, paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: Radius.full, borderWidth: 1, borderColor: Theme.purpleBorder,
  },
  selectedPillTxt: { color: Theme.purple, fontSize: 11, fontWeight: '700' },

  // Product picker
  pickLabel: {
    color: Theme.textDark, fontSize: 13, fontWeight: '800', letterSpacing: 0.5,
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8,
  },
  pickRow:  { paddingHorizontal: 14, paddingBottom: 16, gap: 10 },
  pickCard: {
    width: 100, backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg, padding: 10,
    borderWidth: 1, borderColor: Theme.border, alignItems: 'center',
    elevation: 1, shadowColor: Theme.shadow, shadowOpacity: 0.05, shadowRadius: 4,
  },
  pickCardActive: { borderColor: Theme.purple, borderWidth: 2, backgroundColor: Theme.bgCardPurple },
  pickImg:        {
    width: 64, height: 64, borderRadius: Radius.md,
    backgroundColor: Theme.bgSecondary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8, overflow: 'hidden',
  },
  pickImgActive:  { backgroundColor: Theme.bgPurple },
  pickName:       { color: Theme.textDark, fontSize: 10, fontWeight: '700', textAlign: 'center', lineHeight: 14 },
  pickNameActive: { color: Theme.purple },
  pickCat:        { color: Theme.textMuted, fontSize: 9, marginTop: 3, fontWeight: '600' },
});
