import React, {useState, useContext, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {Title} from 'react-native-paper';
import {TokenContext} from '../../context/TokenContext';
import {useDispatch} from 'react-redux';
import axios from 'axios';
import {API_URL} from '@env';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import Video from 'react-native-video'; // Doğru şekilde import edildi

export default function BarcodeInterface({onBarcodeRead}) {
  const navigation = useNavigation();
  const {userToken, basketId} = useContext(TokenContext);
  const dispatch = useDispatch();
  const [isBarcodeRead, setIsBarcodeRead] = useState(null);
  const {t} = useTranslation();

  const config = {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  };

  const sendRemoveBarcodeEvent = () => {
    axios
      .get(
        `${API_URL}/product/setBarcodeRemoveMode?basketId=${basketId}`,
        config,
      )
      .catch(err => {
        console.log('Remove barcode mode error:', err);
      });
  };

  const sendBarcodeReadEvent = () => {
    axios
      .get(`${API_URL}/product/setBarcodeSaveMode?basketId=${basketId}`, config)
      .then(() => {
        setIsBarcodeRead(true);
        console.log('Barkod Aktif');
      })
      .catch(err => {
        console.log('Save barcode mode error:', err);
      });
  };

  const closeBarcode = () => {
    axios
      .get(
        `${API_URL}/product/resetBarcodeSaveMode?basketId=${basketId}`,
        config,
      )
      .then(() => {
        console.log('Barkod Kapalı');
      })
      .catch(err => {
        console.log('Reset barcode error:', err);
      });
  };

  useEffect(() => {
    if (!isBarcodeRead) {
      sendBarcodeReadEvent();
    }
    return () => {
      closeBarcode();
    };
  }, [isBarcodeRead]);

  return (
    <View style={styles.mainContent}>
      <Title style={styles.titleStyle}>{t('pleaseScanBarcode')}</Title>
      <View style={styles.videoWrapper}>
        <Video
          style={styles.video}
          repeat
          resizeMode="contain"
          paused={false}
          source={require('../../components/interfaces/Scan.mp4')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContent: {
    borderRadius: 30,
    flexDirection: 'column',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleStyle: {
    marginTop: '2%',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 30,
    color: 'white',
  },
  videoWrapper: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
