import React from 'react';
import {
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import PaymentOptions from '../interfaces/PaymentOptions';
import {Button, Card, Text} from 'react-native-paper';
import BackgroundWrapper from '../../context/BackgroundWrapper';
import {useTranslation} from 'react-i18next';

const CompleteShoppingModal = ({isVisible, onClose, onUseWaitingPayment}) => {
  const {t} = useTranslation();

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={false}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BackgroundWrapper style={styles.modalContainer}>
          <Card style={styles.cardStyle}>
            <PaymentOptions />

            <Button
              mode="contained"
              onPress={onClose}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              style={styles.buttonStyle}>
              {t('close')}
            </Button>
          </Card>
        </BackgroundWrapper>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CompleteShoppingModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardStyle: {
    width: '60%',
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'gray',
    alignItems: 'center',
  },
  buttonStyle: {
    marginTop: 20,
    borderRadius: 10,
    width: '60%',
    alignSelf: 'center',
  },
  buttonContent: {
    paddingVertical: 10,
    backgroundColor: '#ff4a4aff',
    borderRadius: 10,
  },
  buttonLabel: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Coolvetica Rg',
    textAlign: 'center',
  },
});
