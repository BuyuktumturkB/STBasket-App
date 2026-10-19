import React, {useContext, useState} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Modal,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {TextInput} from 'react-native-paper';
import {AuthenticateContext} from '../../../../context/AuthanticateContext';
import {ThemeContext} from '../../../../context/ThemeContext';
import BackgroundWrapper from '../../../../context/BackgroundWrapper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
import {API_URL} from '@env';

const BasketConfiguration = () => {
  const [isVisible, setVisible] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [loading, setLoading] = useState(false);

  const {t} = useTranslation();
  const authContext = useContext(AuthenticateContext) || {};

  const {
    setBasketId,
    setHardwareSerial,
    setDeviceBasketNumber,
  } = authContext;

  const {theme} = useContext(ThemeContext) || {};

  const openModal = () => {
    setInputCode('');
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };

  // Provizyon Kodu ile Cihazı Kayıt Etme Fonksiyonu
  const sendConfigureRequest = async () => {
    const provisioningCode = inputCode.trim();

    if (!provisioningCode) {
      Alert.alert(t('error') || 'Hata', 'Provizyon kodu boş olamaz!');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        deviceRole: 'TABLET',
        provisioningCode: provisioningCode,
      };

      // API_URL zaten /api/v1 ile bittiği için doğrudan /device/register ekliyoruz
      const registerResponse = await axios.post(
        `${API_URL}/device/register`,
        payload,
        {
          headers: {
            accept: '*/*',
            'Content-Type': 'application/json',
          },
        },
      );

      const {device, deviceAccessToken} = registerResponse.data.data;

      // 1. hardwareSerial'ı AsyncStorage'a kaydet (Salt kimlik)
      await AsyncStorage.setItem('hardwareSerial', device.hardwareSerial);
      
      // 2. deviceAccessToken'ı EncryptedStorage'a kaydet (Gerçek credential)
      await EncryptedStorage.setItem('deviceAccessToken', deviceAccessToken);

      // Context state'lerini güncelle
      if (typeof setHardwareSerial === 'function') {
        setHardwareSerial(device.hardwareSerial);
      }
      if (typeof setDeviceBasketNumber === 'function') {
        setDeviceBasketNumber(device.deviceBasketNumber);
      }
      if (typeof setBasketId === 'function' && device.basketId) {
        setBasketId(device.basketId.toString());
      }

      Alert.alert(
        t('success') || 'Başarılı',
        'Cihaz başarıyla yapılandırıldı ve eşleştirildi!',
      );
      setVisible(false);
    } catch (error) {
      console.log(
        '❌ Konfigürasyon Hatası:',
        error.response?.data || error.message,
      );
      const errorMsg = error.response?.data?.message || error.message;
      Alert.alert(t('error') || 'Hata', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openModal} style={styles.buttonStyle}>
        <Text style={{color: theme?.textColor || '#fff'}}>
          {t('configuration') || 'Cihaz Yapılandırma'}
        </Text>
      </TouchableOpacity>

      <Modal visible={isVisible} transparent={false} animationType="fade">
        <BackgroundWrapper>
          <View style={styles.modalContent}>
            <Text style={[styles.title, {color: theme?.textColor || '#fff'}]}>
              {t('configuration') || 'Cihaz Yapılandırma'}
            </Text>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, {color: theme?.textColor || '#fff'}]}>
                Provizyon Kodu (Provisioning Code)
              </Text>
              <TextInput
                value={inputCode}
                onChangeText={setInputCode}
                placeholder="Örn: GD3ARN46X6"
                placeholderTextColor="#888"
                autoCapitalize="characters"
                style={{backgroundColor: theme?.inputBackground || '#fff'}}
                textColor={theme?.textColor || '#000'}
                theme={{
                  colors: {
                    text: theme?.textColor || '#000',
                    placeholder: theme?.textColor || '#888',
                    background: theme?.inputBackground || '#fff',
                  },
                }}
              />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={closeModal}
                disabled={loading}
                style={[styles.actionButton, {backgroundColor: '#ff7979ff'}]}>
                <Text style={styles.buttonText}>{t('close') || 'Kapat'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={sendConfigureRequest}
                disabled={loading}
                style={[styles.actionButton, {backgroundColor: '#808bccff'}]}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Configure</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </BackgroundWrapper>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 10,
  },
  buttonStyle: {
    width: '100%',
    height: 50,
    padding: 10,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: '20%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default BasketConfiguration;