import React from 'react';
import {Modal, View, StyleSheet, Title} from 'react-native';
import Video from 'react-native-video';
import {useTranslation} from 'react-i18next';
import { Button } from 'react-native-paper';

const PaymentNotCompleted = ({isVisible, onClose}) => {
  const {t} = useTranslation();

  <Modal transparent={true} visible={isVisible}>
    <View style={styles.modalContainer}>
      <View style={styles.contentContainer}>
        <Title> {t('paymentFailed')} </Title> 
        <View>

        </View>
      </View>
    </View>
  </Modal>;
};
const styles = StyleSheet.create({
  modalContainer: {},
  contentContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: '60%',
    width: '60%',
  },
});

export default PaymentNotCompleted;
