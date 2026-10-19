import React, {useContext} from 'react';
import {
  Modal,
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import BarcodeInterface from '../interfaces/BarcodeInterface';
import {useTranslation} from 'react-i18next';
import {TokenContext} from '../../context/TokenContext';
import BackgroundWrapper from '../../context/BackgroundWrapper';

const BarcodeModal = ({isVisible, onClose}) => {
  const config = {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  };

  const {userToken, basketId} = useContext(TokenContext);
  const {t} = useTranslation();

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <BackgroundWrapper>
          <View style={styles.modalContainer}>
            <BarcodeInterface />
            <TouchableOpacity style={styles.buttonStyle} onPress={onClose}>
              <Text style={styles.buttonText}>{t('close')}</Text>
            </TouchableOpacity>
          </View>
        </BackgroundWrapper>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    height: '60%',
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
  },
  blurBackground: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonStyle: {
    backgroundColor: '#ff4a4a',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontFamily: 'Coolvetica Rg',
  },
});

export default BarcodeModal;
