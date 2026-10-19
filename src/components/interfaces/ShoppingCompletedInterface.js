import React from 'react';
import {View, Text, StyleSheet, Image, ImageBackground} from 'react-native';
import {Button, Title, Card} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import RNRestart from 'react-native-restart';
import Video from 'react-native-video';
import {useTranslation} from 'react-i18next';
import Appbar from '../Bars/Appbar';

export default function PaymentCompleted() {
  const {t} = useTranslation();
  setTimeout(() => {
    RNRestart.Restart();
  }, 10000);

  return (
    <View style={styles.container}>
      <Appbar />
      <View style={styles.contentStyle}>
        <Title style={styles.titleStyle}> {t('paymentCompleted')} </Title>
        <Title style={{fontSize: 30, color: '#585858', marginLeft: '15%'}}>
          {' '}
          {t('weWishYouGreatDay')}{' '}
        </Title>
      </View>
      <View style={styles.videoFramStyle}>
        <Video
          style={styles.videoStyle}
          source={require('./coorect.mp4')}
          resizeMode="contain"
          repeat={true}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#001424ff',
    padding: 20,
    resizeMode: 'cover',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  titleStyle: {
    marginTop: '10%',
    fontSize: 30,
    color: '#585858',
    marginLeft: '15%',
  },
  videoFramStyle: {
    width: '60%',
    height: '60%',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  contentStyle: {
    backgroundColor: 'rgba(0,0,0,0.95)',
    width: '60%',
    marginTop: '1%',
  },
  videoStyle: {
    height: '60%'}
});
