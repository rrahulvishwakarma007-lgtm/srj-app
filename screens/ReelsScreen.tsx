import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../lib/theme';
import { products } from '../lib/data';

const { height } = Dimensions.get('window');

export default function ReelsScreen() {
  const [play, setPlay] = useState<any>(null);
  const reels = products.slice(0, 8);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={reels}
        pagingEnabled
        snapToInterval={height}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        keyExtractor={i => String(i.id)}
        renderItem={({ item, index }) => (
          <View style={styles.reel}>
            <View style={styles.reelBg}><Ionicons name={item.icon as any} size={120} color={Theme.gold + '66'} /></View>
            <View style={styles.overlay}>
              <Text style={styles.brand}>SHEKHAR RAJA</Text>
              <Text style={styles.reelTitle}>{item.name}</Text>
              <Text style={styles.reelDesc}>{item.details}</Text>
              <TouchableOpacity style={styles.play} onPress={() => setPlay(item)}><Ionicons name="play" size={26} color={Theme.bgPrimary} /><Text style={styles.playTxt}>WATCH THE STORY</Text></TouchableOpacity>
            </View>
            <Text style={styles.swipe}>Swipe for more • {index + 1}/{reels.length}</Text>
          </View>
        )}
      />
      <Modal visible={!!play} animationType="fade" transparent onRequestClose={() => setPlay(null)}>
        <View style={styles.playModal}><TouchableOpacity style={styles.close} onPress={() => setPlay(null)}><Ionicons name="close" size={28} color="#fff" /></TouchableOpacity>
          {play && <View style={styles.playCard}><Text style={styles.playName}>{play.name}</Text><Text style={styles.playDetail}>{play.details}</Text><Text style={styles.playMeta}>{play.weight}g • {play.purity} • {play.description}</Text></View>}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.bgPrimary },
  reel: { height, width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: Theme.bgSecondary },
  reelBg: { position: 'absolute', opacity: 0.2 },
  overlay: { alignItems: 'center', paddingHorizontal: 30 },
  brand: { color: Theme.goldLight, fontSize: 12, letterSpacing: 5, marginBottom: 6 },
  reelTitle: { ...Theme.serifHeavy, color: Theme.gold, fontSize: 28, textAlign: 'center', letterSpacing: 1 },
  reelDesc: { color: Theme.textOnDark, fontSize: 15, textAlign: 'center', marginTop: 12, lineHeight: 22, maxWidth: 300 },
  play: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Theme.gold, paddingVertical: 14, paddingHorizontal: 26, borderRadius: 30, marginTop: 28 },
  playTxt: { color: Theme.bgPrimary, fontSize: 14, fontWeight: '800', letterSpacing: 1.5 },
  swipe: { position: 'absolute', bottom: 50, color: Theme.textOnDarkMuted, fontSize: 11, letterSpacing: 2 },
  playModal: { flex: 1, backgroundColor: 'rgba(30,19,56,0.96)', alignItems: 'center', justifyContent: 'center' },
  close: { position: 'absolute', top: 60, right: 24 },
  playCard: { backgroundColor: Theme.bgCard, padding: 28, borderRadius: 22, maxWidth: 320, alignItems: 'center' },
  playName: { ...Theme.serifHeavy, color: Theme.textOnCream, fontSize: 22, textAlign: 'center' },
  playDetail: { color: Theme.textOnCream, fontSize: 15, textAlign: 'center', marginTop: 10, lineHeight: 22 },
  playMeta: { color: Theme.textOnCreamMuted, fontSize: 13, marginTop: 14 },
});