import React, {useState, useContext} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
} from 'react-native';
import {ThemeContext} from '../../context/ThemeContext';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';
import SettingsModal from '../Modals/SettingsModal';
import {AuthenticateContext} from '../../context/AuthanticateContext';
import BackgroundWrapper from '../../context/BackgroundWrapper';
import {API_URL} from '@env';

import axios from 'axios';

const PersonnelVerification = () => {
  const {t} = useTranslation();
  const [isİllegal, setIsillegal] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSettingsVisible, setisSettingsVisible] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const {setVerificationToken, deviceId, basketId} =
    useContext(AuthenticateContext);
  const {theme} = useContext(ThemeContext);

  const openSettings = () => setisSettingsVisible(true);
  const closeSettings = () => setisSettingsVisible(false);
  const openPanel = () => setIsPanelVisible(true);
  const closePanel = () => setIsPanelVisible(false);
  const togglePasswordVisibility = () => setIsPasswordVisible(prev => !prev);

  const handleAuthanticate = async () => {
    try {
      const response = await axios({
        method: 'post',
        url: 'http://192.168.4.73:4343/api/v1/token/personnel/login',
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
        },
        data: {
          email: email,
          password: password,
          deviceId: 2,
        },
      });

      console.log('✅ API yanıtı:', response.data);

      // Doğru erişim yolu: response.data.data.token (veya accessToken)
      const token = response.data?.data?.token || response.data?.data?.accessToken;

      if (token) {
        setVerificationToken(token);
        Alert.alert('Giriş başarılı ✅');
        openSettings();
        closePanel();
      } else {
        Alert.alert('Hata', 'Token alınamadı, yanıt yapısı farklı.');
      }
    } catch (error) {
      console.log(
        'ERROR>>>',
        error.response ? error.response.data : error.message,
      );
      console.log('📡 API_URL:', API_URL);
      if (error.reason === 'NOT_PERSONNEL') {
      }
      setIsillegal(true);
      Alert.alert(t('error'), t('noAcces'));
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={openPanel}>
        <MaterialIcons name="lock" size={30} color={theme.textColor} />
      </TouchableOpacity>

      <Modal visible={isPanelVisible} transparent={false} animationType="fade">
        <BackgroundWrapper
          style={[
            styles.backgroundStyle,
            {backgroundColor: theme.backgroundColor},
          ]}>
          <View style={styles.contentStyle}>
            <Text style={[styles.titleStyle, {color: theme.textColor}]}>
              {t('administrator_panel')}
            </Text>

            {/* Email */}
            <View style={styles.contentRow}>
              <MaterialIcons
                name="email"
                size={24}
                color={theme.textColor}
                style={{marginRight: 8}}
              />
              <TextInput
                style={[styles.inputStyle, {color: theme.textColor}]}
                placeholder={t('mailAddress')}
                value={email}
                onChangeText={setEmail}
                placeholderTextColor={theme.placeholderColor || '#aaa'}
              />
            </View>

            {/* Password */}
            <View style={styles.contentRow}>
              <MaterialIcons
                name="lock"
                size={24}
                color={theme.textColor}
                style={{marginRight: 8}}
              />
              <TextInput
                style={[styles.inputStyle, {color: theme.textColor}]}
                placeholder={t('password')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
                placeholderTextColor={theme.placeholderColor || '#aaa'}
              />
              <TouchableOpacity onPress={togglePasswordVisibility}>
                <FontAwesomeIcon
                  icon={isPasswordVisible ? faEyeSlash : faEye}
                  size={20}
                  color={theme.textColor}
                />
              </TouchableOpacity>
            </View>

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.buttonStyle, {backgroundColor: '#ff7979ff'}]}
                onPress={closePanel}>
                <Text style={styles.buttonText}>{t('close')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.buttonStyle, {backgroundColor: '#808bccff'}]}
                onPress={handleAuthanticate}>
                <Text style={styles.buttonText}>{t('verify')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BackgroundWrapper>
      </Modal>

      <SettingsModal isVisible={isSettingsVisible} onClose={closeSettings} />
    </View>
  );
};

export default PersonnelVerification;

const styles = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 25,
    borderRadius: 20,
    width: '75%',
  },
  contentRow: {
    borderColor: '#ccc',
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
  },
  inputStyle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Coolvetica Rg',
  },
  titleStyle: {
    fontSize: 26,
    fontFamily: 'Coolvetica Rg',
    marginBottom: 25,
    alignSelf: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonStyle: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Coolvetica Rg',
  },
});
