import React from 'react';
import {Modal, StyleSheet, View, TouchableWithoutFeedback} from 'react-native';
import WaitingPayment from '../interfaces/WaitingPayment';

const WaitingPaymentModal = ({isVisible, onClose}) => {
  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
      transparent={true}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View style={styles.contentStyle}>
            <WaitingPayment />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#1e2020',
    justifyContent: 'center',
    flexDirection: 'column',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 1000,
    shadowColor: '#000',
  },
  contentStyle: {
    height: '50%',
    width: '30%',
    margin: '35%',
    borderRadius: 10,
    padding: 10,
  },
});

export default WaitingPaymentModal;
