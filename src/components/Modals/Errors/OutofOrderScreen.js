import React, {useContext} from 'react';
import {View, Text, StyleSheet, Modal} from 'react-native';
import {useTranslation} from 'react-i18next';
import BackgroundWrapper from '../../../context/BackgroundWrapper';
import {ThemeContext} from '../../../context/ThemeContext';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons';
import SettingsModal from '../SettingsModal';
import PersonnelVerification from '../../security/PersonnelVerification';

const OutofOrderScreen = ({isVisible}) => {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);

  return (
    <Modal visible={isVisible} transparent={false} animationType="fade">
      <View style={{justifyContent: 'center', alignItems: 'center',backgroundColor:'transparent'}}>
        <PersonnelVerification />
      </View>

      <BackgroundWrapper>
        <View style={styles.containerStyle}>
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            size={100}
            color={'#ff4a4a'}
            style={{marginBottom: 30}}
          />
          <Text style={[styles.titleStyle, {color: theme.textColor}]}>
            {t('attention')}
          </Text>
          <Text style={[styles.textStyle, {color: theme.textColor}]}>
           {t('outOfOrder')}
          </Text>
          <Text style={[styles.textStyle, {color: theme.textColor}]}>
            {t('useAnotherOne')}
          </Text>
        </View>
      </BackgroundWrapper>
    </Modal>
  );
};
const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titleStyle: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  textStyle: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
});
export default OutofOrderScreen;
