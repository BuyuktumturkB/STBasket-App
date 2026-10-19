import React, {useContext, useEffect, useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {ThemeContext} from '../../context/ThemeContext';
import QRCode from 'react-native-qrcode-svg';
import Appbar from '../../components/Bars/Appbar';
import BackgroundWrapper from '../../context/BackgroundWrapper';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {AuthenticateContext} from '../../context/AuthanticateContext';
import OutofOrderScreen from '../../components/Modals/Errors/OutofOrderScreen';
import {TokenContext} from '../../context/TokenContext';

const QRScreen = () => {
  const {basketId, isOutOfOrder} = useContext(AuthenticateContext);
  const [isBotVisible, setBotVisible] = useState(false);
  const [isMessageVisible, setMessageVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [qr, setQR] = useState(null);
  const [loading, setLoading] = useState(true);
  const {t} = useTranslation();
  const {theme, toggleTheme} = useContext(ThemeContext);
  const [outOfOrderVisible, setOutOfOrderVisible] = useState(false);

  const openBot = () => setBotVisible(true);
  const closeBot = () => setBotVisible(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  useFocusEffect(
    useCallback(() => {
      let refreshInterval;

      const fetchToken = async () => {
        try {
          setLoading(true);
          const res = await axios.post(
            'http://192.168.4.73:4343/api/v1/matching_basket/generate_qr',
            {
              basketNumber: basketId,
            },
          );

          const {token} = res.data;
          setQR(token);
          console.log('QR tokeni:', token);
        } catch (err) {
          console.log('BasketId>>>', basketId);
          console.error('Token alma hatası:', err);
          Alert.alert('Hata', 'QR kod oluşturulamadı.');
        } finally {
          setLoading(false);
        }
      };

      fetchToken();
      refreshInterval = setInterval(fetchToken, 300000); // 5 dakika

      return () => clearInterval(refreshInterval);
    }, []),
  );

  useEffect(() => {
    // isOutOfOrder değişirse modal görünürlüğünü ayarla
    setOutOfOrderVisible(isOutOfOrder);
  }, [isOutOfOrder]);

  return (
    <BackgroundWrapper>
      <View style={styles.headerStyle}>
        <Appbar />
      </View>

      <View style={styles.root}>
        <View style={styles.qrContainer}>
          {loading ? (
            <Text style={styles.loadingText}>{t('gr_loading')}</Text>
          ) : qr ? (
            <QRCode value={qr} size={200} />
          ) : (
            <Text style={styles.errorText}>Token alınamadı</Text>
          )}
        </View>
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
      <OutofOrderScreen isVisible={outOfOrderVisible} />
    </BackgroundWrapper>
  );
};

export default QRScreen;

const styles = StyleSheet.create({
  headerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 25,
    height: 80,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 5,
  },
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    padding: 50,
    borderRadius: 10,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  footerText: {
    fontSize: 12,
    color: 'white',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Coolvetica Rg',
  },
  selftech: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
  },
  logoImage: {
    width: 200,
    height: 80,
  },
});
