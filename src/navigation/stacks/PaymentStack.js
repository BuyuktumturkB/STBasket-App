import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import PaymentOptions from '../../components/interfaces/PaymentOptions';
import WaitingPayment from '../../components/interfaces/WaitingPayment';

const Stack = createStackNavigator();

export default function PaymentNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="PaymentOptions"
          component={PaymentOptions}
          options={{title: 'Select Payment Method'}}
        />
        <Stack.Screen
          name="WaitingPayment"
          component={WaitingPayment}
          options={{title: 'Waiting For Payment'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
