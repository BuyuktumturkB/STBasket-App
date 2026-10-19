import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import ProductsScreen from '../../screens/ProductsScreen';
import ProductsScreenNew from '../../screens/ProductsScreen/ProductsScreenNew';
import WaitingPayment from '../../components/interfaces/WaitingPayment';
import PaymentOptions from '../../components/interfaces/PaymentOptions';
import PaymentCompleted from '../../components/interfaces/ShoppingCompletedInterface';

const BasketStack = () => {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="ProductsScreen"
          // component={ProductsScreen}
          component={ProductsScreenNew}
          initialParams={{new_qr: null}}
        />
        <Stack.Screen name="PaymentOptions" component={PaymentOptions} />
        <Stack.Screen
          name="WaitingPayment"
          component={WaitingPayment}
          initialParams={{new_qr: null}}
        />
        <Stack.Screen name="PaymentCompleted" component={PaymentCompleted} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default BasketStack;
