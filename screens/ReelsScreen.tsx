import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, Dimensions, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const { height } = Dimensions.get('window');

export default function ReelsScreen() {
  const [reels, setReels] = useState<any[]>([]);
  const viewableItems = useRef([]);

  useEffect(() => {
    const fetchReels = async () => {
      const snapshot = await getDocs(collection(db, 'reels'));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReels(data);
    };

    fetchReels();
  }, []);

  const renderItem = ({ item }: any) => (
    <View style={styles.container}>
      <Video
        source={{ uri: item.video }}
        style={styles.video}
        resizeMode="cover"
        shouldPlay
        isLooping
      />

      <View style={styles.overlay}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.desc}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={reels}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      pagingEnabled
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    height: height,
    backgroundColor: 'black'
  },
  video: {
    width: '100%',
    height: '100%'
  },
  overlay: {
    position: 'absolute',
    bottom: 60,
    left: 20
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  desc: {
    color: 'white',
    fontSize: 14,
    marginTop: 4
  }
});