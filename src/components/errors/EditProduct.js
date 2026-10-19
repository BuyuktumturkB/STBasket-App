import React from 'react';
import {
  Modal,
  ImageBackground,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Title} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import BackgroundWrapper from '../../context/BackgroundWrapper';

const EditWarning = ({onClose, onAccept, isVisible}) => {
  const {t} = useTranslation();
  return (
    <Modal visible={isVisible} transparent={false}>
      <BackgroundWrapper style={styles.ımageBackgroundStyle}>
        <View style={styles.containerStyle}>
          <Title style={styles.titleStyle}>{t('Attention')}</Title>
          <Text style={styles.textStyle}>{t('areYouSureUpdate')}</Text>
          <View style={styles.rowStyle}>
            <TouchableOpacity onPress={onAccept}>
              <Text style={styles.leftButtonStyle}>{t('accept')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.rightButtonStyle}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BackgroundWrapper>
    </Modal>
  );
};
const styles = StyleSheet.create({
  ımageBackgroundStyle: {
    width: '100%',
    height: '100%',
  },
  containerStyle: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60%',
    width: '60%',
    borderRadius: 20,
  },
  rowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    paddingVertical: 30,
  },
  titleStyle: {
    fontSize: 30,
    fontFamily: 'Coolvetica Rg',
    marginBottom: 50,
    color: '#ff6161ff',
    justifyContent: 'center',
  },
  rightButtonStyle: {
    borderWidth: 1,
    borderColor: '#ccc',
    fontFamily: 'Coolvetica Rg',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#63d4d4ff',
    color: '#000',
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftButtonStyle: {
    borderWidth: 1,
    fontFamily: 'Coolvetica Rg',
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#97cf79ff',
    color: '#000',
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  textStyle: {
    fontSize: 20,
    fontFamily: 'Coolvetica Rg',
  },
});

export default EditWarning;
