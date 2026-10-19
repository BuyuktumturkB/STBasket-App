import {faClose} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React, {useState, useContext} from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  View,
  BackHandler,
  Switch,
} from 'react-native';
import CurrencyBar from '../Bars/CurrencyBar';
import {useTranslation} from 'react-i18next';

import ShoppingHistoryModal from './ShoppingHistoryModal';
import BackgroundWrapper from '../../context/BackgroundWrapper';
import {AuthenticateContext} from '../../context/AuthanticateContext';
import {ThemeContext} from '../../context/ThemeContext';
import {KioskContext} from '../../context/KioskContext';
import ReportCart from './Settings/ReportCart';
import BasketConfiguration from './Settings/Configuration/BasketConfiguration';

const SettingsModal = ({isVisible, onClose}) => {
  const {logout} = useContext(AuthenticateContext);
  const {theme} = useContext(ThemeContext);
  const {t} = useTranslation();
  
  // Kiosk Context'ten durum ve fonksiyonu alıyoruz
  const {isKioskActive, toggleKiosk} = useContext(KioskContext);

  const [isCartHistoryVisible, setCartHistoryVisible] = useState(false);
  
  if (!isVisible) {
    return null;
  }

  const handleLogout = () => {
    logout();
    onClose();
  };

  const closeApp = () => {
    logout();
    BackHandler.exitApp();
  };

  return (
    <Modal visible={isVisible} transparent={false} animationType="fade">
      <BackgroundWrapper>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={[styles.modalTitle, {color: theme.textColor}]}>
              {t('settings')}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesomeIcon
                icon={faClose}
                size={24}
                color={theme.textColor}
              />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            
            {/* Kiosk Modu Açma / Kapatma Switch Alanı */}
            <View style={styles.toggleRow}>
              <Text style={{color: theme.textColor, fontSize: 16}}>
                {t('kioskMode') || 'Kiosk Modu'}
              </Text>
              <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isKioskActive ? '#f5dd4b' : '#f4f3f4'}
                onValueChange={toggleKiosk}
                value={isKioskActive}
              />
            </View>

            <TouchableOpacity
              onPress={() => setCartHistoryVisible(true)}
              style={styles.buttonStyle}>
              <Text style={{color: theme.textColor}}>
                {t('shoppingHistory')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleLogout} style={styles.buttonStyle}>
              <Text style={{color: theme.textColor}}>{t('logout')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={closeApp} style={styles.buttonStyle}>
              <Text style={{color: theme.textColor}}>{t('close')}</Text>
            </TouchableOpacity>
            
            <CurrencyBar />
            <ReportCart />
            <BasketConfiguration />
          </ScrollView>
        </View>
      </BackgroundWrapper>
      <ShoppingHistoryModal
        isVisible={isCartHistoryVisible}
        onClose={() => setCartHistoryVisible(false)}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width: '60%',
    height: '80%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  scrollContent: {
    height: '80%',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    height: 50,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  buttonStyle: {
    width: '100%',
    height: 50,
    padding: 10,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginBottom: 10,
  },
});

export default SettingsModal;