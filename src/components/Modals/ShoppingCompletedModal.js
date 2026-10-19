import React, {useState, useEffect} from 'react';
import {Modal, View, Text, StyleSheet} from 'react-native';
import PaymentCompleted from '../interfaces/ShoppingCompletedInterface';

const ShoppingCompletedModal = ({isVisible, onClose}) => {
  return (
    <Modal transparent={false}>
      <View style>
        <PaymentCompleted />
      </View>
    </Modal>
  );
};
export default ShoppingCompletedModal;
