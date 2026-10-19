import React, {useState, useEffect, useContext, useRef} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Video from 'react-native-video';
import Appbar from '../../components/Bars/Appbar';
import {useTranslation} from 'react-i18next';
import {VIDEO_SOURCES} from '../../constants/VideoSource';
import {ThemeContext} from '../../context/ThemeContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const AnimationScreen = () => {
  const navigation = useNavigation();
  const {t, i18n} = useTranslation();
  const isFocused = useIsFocused();
  const {theme} = useContext(ThemeContext);

  const videoRef = useRef(null);

  const [videoSource, setVideoSource] = useState(VIDEO_SOURCES.en);

  useEffect(() => {
    setVideoSource(VIDEO_SOURCES[i18n.language] || VIDEO_SOURCES.en);
  }, [i18n.language]);

  const handleSkipPress = () => {
    navigation.setOptions({headerShown: false});
    navigation.navigate('QRScreen');
  };

  const handleProgress = data => {
    const currentTime = data.currentTime;
  };

  useEffect(() => {
    if (videoRef.current) {
      if (isFocused) {
        videoRef.current.playAsync();
      } else {
        videoRef.current.stopAsync();
      }
    }
  }, [isFocused]);
  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <View style={styles.headerWrapper}>
        <View style={styles.appbarWrapper}>
          <Appbar />
        </View>
      </View>

      <View style={styles.backgroundVideo}>
        <View style={styles.videoWrapper}>
          <Video
            source={videoSource}
            style={styles.video}
            repeat
            resizeMode="cover"
            controls={false}
            onProgress={handleProgress}
            paused={!isFocused}
          />
        </View>

        <Text style={[styles.footerText, {color: theme.textColor}]}>
          Developed By
        </Text>

        <View style={styles.selftech}>
          <Image
            style={styles.logoImage}
            resizeMode="contain"
            source={
              theme.isDark
                ? require('../../assets/images/stlogo2.png')
                : require('../../assets/images/stlogo.png')
            }
          />
        </View>

        <TouchableOpacity
          style={styles.skipButtonWrapper}
          onPress={handleSkipPress}>
          <View style={styles.skipButton}>
            <Text style={styles.skipText}>{t('skip the introduction')}</Text>
            <MaterialIcons
              name="arrow-forward"
              size={20}
              color="white"
              style={styles.icon}
            />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerWrapper: {
    flexDirection: 'row',
  },
  appbarWrapper: {
    flex: 1,
  },
  backgroundVideo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoWrapper: {
    width: '80%',
    height: '80%',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'black',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  logoImage: {
    width: 200,
    height: 50,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Coolvetica Rg',
    fontStyle: 'italic',
  },
  selftech: {
    marginTop: 10,
  },
  skipButtonWrapper: {
    position: 'absolute',
    bottom: 15,
    right: 10,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  skipText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Coolvetica Rg',
  },
  icon: {
    marginLeft: 8,
  },
});

export default AnimationScreen;
