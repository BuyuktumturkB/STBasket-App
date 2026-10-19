import React, {useContext, useState} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faScrewdriverWrench} from '@fortawesome/free-solid-svg-icons';
import {TokenContext} from '../../../context/TokenContext';
import axios from 'axios';
import {API_URL} from '@env';
import {AuthenticateContext} from '../../../context/AuthanticateContext';
import {ThemeContext} from '../../../context/ThemeContext';
import BackgroundWrapper from '../../../context/BackgroundWrapper';

const ReportCart = () => {
  const {t} = useTranslation();
  const {userToken} = useContext(TokenContext);
  const {adminToken, deviceId, setIsOutOfOrder} =
    useContext(AuthenticateContext);
  const {theme} = useContext(ThemeContext);
  const [isPanelVisible, setIsPanelVisible] = useState(false);

  const openPanel = () => {
    setIsPanelVisible(true);
  };
  const closePanel = () => {
    setIsPanelVisible(false);
  };
  const handleReportMaintenance = async () => {
    try {
      const response = await axios.patch(
        `${API_URL}/physical-basket/status/not_of_service`,
        {deviceId: deviceId},
        {
          headers: {Authorization: `Bearer ${adminToken}`},
        },
      );

      if (response?.status === 200) {
        Alert.alert(t('attention'), t('maintenanceReported'));
        console.log('Maintenance status updated:', response.data);
        setIsOutOfOrder(true);
      } else {
        Alert.alert(t('error'), t('unexpectedError'));
      }
    } catch (error) {
      console.error('Maintenance report error:', error);
      Alert.alert(t('error'), t('somethingWentWrong'));
    } finally {
      closePanel();
    }
  };

  const handleReportOk = async () => {
    try {
      await axios.patch(
        `${API_URL}/physical-basket/status/available`,
        {deviceId: deviceId},
        {
          headers: {Authorization: `Bearer ${adminToken}`},
        },
      );
      setIsOutOfOrder(false); // Context + AsyncStorage otomatik güncellenir
      Alert.alert(t('attention'), t('cartBackToNormal'));
    } catch (error) {
      console.error('Error reverting cart:', error);
      Alert.alert(t('error'), t('somethingWentWrong'));
    } finally {
      closePanel();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.buttonStyle, {backgroundColor: theme.primaryColor}]}
        onPress={openPanel}>
        <Text style={{color: theme.textColor}}>{t('reportCart')}</Text>
      </TouchableOpacity>
      <Modal visible={isPanelVisible} transparent={false} animationType="fade">
        <BackgroundWrapper>
          <View style={styles.modalContent}>
            <Text style={[styles.title, {color: theme.textColor}]}>
              {t('reportCart')}
            </Text>
            <TouchableOpacity
              onPress={handleReportMaintenance}
              style={[styles.actionButton, {backgroundColor: '#ff7979ff'}]}>
              <Text style={styles.buttonText}>Report Maintenance</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleReportOk}
              style={[styles.actionButton, {backgroundColor: '#808bccff'}]}>
              <Text style={styles.buttonText}>Change as Normal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, {backgroundColor: 'gray'}]}
              onPress={closePanel}>
              <Text style={styles.buttonText}> {t('close')} </Text>
            </TouchableOpacity>
          </View>
        </BackgroundWrapper>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  buttonStyle: {
    width: '100%',
    height: 50,
    padding: 10,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginBottom: 10,
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  actionButton: {
    width: '100%',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
export default ReportCart;
