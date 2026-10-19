import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Button} from 'react-native-paper';
import {faCreditCard, faMobile} from '@fortawesome/free-solid-svg-icons';
import WaitingPaymentModal from '../Modals/WaitingPaymentModal';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import WaitingPayment from './WaitingPayment';
import PaymentNavigator from '../../navigation/stacks/PaymentStack';
import BasketStack from '../../navigation/stacks/BasketStack';

export default function PaymentOptions() {
  const [isWaitingVisible, setIsWaitingVisible] = useState(false);

  const {t} = useTranslation();
  const openPaymentWaiting = () => setIsWaitingVisible(true);
  const closePaymentWaiting = () => setIsWaitingVisible(false);

  const navigator = useNavigation();

  const navigateToPayment = () => {
    navigator.navigate('WaitingPayment');
  };

  return (
    <View style={styles.containerStyle}>
      <Text style={styles.titleStyle}>{t('please_select_a_Method')}</Text>

      <View style={styles.paymentMethodContainer}>
        <TouchableOpacity
          onPress={navigateToPayment}
          style={styles.paymentOption}>
          <FontAwesomeIcon
            icon={faCreditCard}
            size={120}
            color="rgba(0, 0, 0, 0.7)"
          />
          <Text style={styles.paymentOptionStyle} onPress={navigateToPayment}>
            {t('paymentWithCard')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={navigateToPayment}
          style={styles.paymentOption}>
          <FontAwesomeIcon
            icon={faMobile}
            size={120}
            color="rgba(0, 0, 0, 0.7)"
          />
          <Text style={styles.paymentOptionStyle} onPress={navigateToPayment}>
            {t('mobilePayment')}
          </Text>
        </TouchableOpacity>
      </View>

      <WaitingPaymentModal
        isVisible={isWaitingVisible}
        onClose={closePaymentWaiting}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'column',

    alignItems: 'center',
    marginTop: 20,
    width: 500,
  },
  titleStyle: {
    fontSize: 25,
    color: 'white',
    margin: '5%',
    fontFamily: 'Coolvetica Rg',
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    width: '70%',
    justifyContent: 'space-between',
  },
  paymentOption: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentOptionStyle: {
    fontFamily: 'Coolvetica Rg',
    fontSize: 20,
    color: 'white',
    marginTop: 5,
  },
});
