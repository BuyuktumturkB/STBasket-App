import React from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Text,
} from 'react-native';
import OthersInterface from '../interfaces/OtherProductsInterface';

import {useTranslation} from 'react-i18next';

const OthersModal = ({onClose, isVisible}) => {
  const {t} = useTranslation();
  return (
    <Modal visible={isVisible} onRequestClose={onClose} transparent={false}>
      <ImageBackground
        style={{height: '100%', width: '100%'}}
        resizeMode="cover"
        backgroundColor="#1e2020">
        <TouchableWithoutFeedback>
          <View style={styles.blurBackground}>
            <View style={styles.containerStyle}>
              <View style={{height: '95%', width: '90%', alignSelf: 'center'}}>
                <OthersInterface style={{with: '20%'}} />
                <TouchableOpacity style={styles.buttonStyle} onPress={onClose}>
                  <Text style={styles.buttonText}>{t('close')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ImageBackground>
    </Modal>
  );
};

export default OthersModal;

const styles = StyleSheet.create({
  blurBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    flexDirection: 'column',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 1000,
    shadowColor: '#000',
  },
  containerStyle: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    height: '100%',
    width: '100%',
  },
  buttonStyle: {
    backgroundColor: '#ff4a4a',
    paddingVertical: 12,
    width: 100,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center', // ← Butonu ortaya hizalar
  },

  buttonText: {
    color: 'white',
    fontFamily: 'Coolvetica Rg',
  },
});
