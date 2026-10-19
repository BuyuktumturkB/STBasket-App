import React, {useEffect, useState} from 'react';
import {Animated, Easing, View, StyleSheet} from 'react-native';
import { Text } from 'react-native-paper';

const HourglassAnimation = () => {
  const [resetAnim, setResetAnim] = useState(false);

  // Kum saati dönüş animasyonu
  const rotateAnim = new Animated.Value(0);

  // Kumların düşme animasyonu (yukarıdan aşağıya)
  const sandAnim = new Animated.Value(0);

  useEffect(() => {
    const runAnimations = () => {
      // Kumların animasyonu - yukarıdan aşağıya doğru
      Animated.timing(sandAnim, {
        toValue: 1, // 1'e ulaşınca kumlar tamamıyla düşecek
        duration: 2000, // Kumlar 2 saniyede düşsün
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();

      // Kum saati dönüş animasyonu
      Animated.timing(rotateAnim, {
        toValue: 1, // 360 derece dönüş
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();

      // Dönüş ve kum animasyonları bitince tekrar başlasın
      setTimeout(() => {
        setResetAnim(true); // Animasyonu sıfırlıyoruz
        setTimeout(() => {
          setResetAnim(false);
          sandAnim.setValue(0); // Kum animasyonunu sıfırlıyoruz
          rotateAnim.setValue(0); // Dönüş animasyonunu sıfırlıyoruz
          runAnimations(); // Animasyonu tekrar başlatıyoruz
        }, 200); // Kısa bir bekleme süresi
      }, 2000); // 2 saniye sonra animasyonu sıfırlıyoruz
    };

    runAnimations(); // Animasyonu başlatıyoruz
  }, [resetAnim]);

  // Dönüş animasyonunu derecelere çeviriyoruz
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'], // 0'dan 360 dereceye dönüş
  });

  // Kumların yukarıdan aşağıya animasyonu
  const sandInterpolation = sandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'], // Kumlar yukarıdan aşağıya düşsün
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.hourglassContainer,
          {transform: [{rotate: rotateInterpolate}]},
        ]}>
        <View style={styles.hourglass}>
          {/* Üst kısım */}
          <View style={styles.sandTop}>
            <Animated.View style={[styles.sand, {bottom: sandInterpolation}]}>
              <Text style={styles.sandText}>🧡</Text> {/* Kumlar simülasyonu */}
            </Animated.View>
          </View>
          {/* Alt kısım */}
          <View style={styles.sandBottom}>
            <Animated.View style={[styles.sand, {top: sandInterpolation}]}>
              <Text style={styles.sandText}>🧡</Text> {/* Kumlar simülasyonu */}
            </Animated.View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hourglassContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  hourglass: {
    width: 100,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  sandTop: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '50%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  sandBottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '50%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  sand: {
    position: 'absolute',
    width: '100%',
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sandText: {
    fontSize: 24,
  },
});

export default HourglassAnimation;
