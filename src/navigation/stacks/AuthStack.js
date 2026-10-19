import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import QRScreen from '../../screens/QRScreen';
import ProductsScreenNew from '../../screens/ProductsScreen/ProductsScreenNew';
import AnimationScreen from '../../screens/AnimationScreen/AnimationPage';
import WaitingPayment from '../../components/interfaces/WaitingPayment';
import PaymentCompleted from '../../components/interfaces/ShoppingCompletedInterface';

const AuthStack = () => {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="AnimationScreen" component={AnimationScreen} />
        <Stack.Screen
          name="QRScreen"
          component={QRScreen}
          initialParams={{new_qr: null}}
        />
        <Stack.Screen
          name="WaitingPayment"
          component={WaitingPayment}
          initialParams={{new_qr: null}}
        />
        <Stack.Screen
          name="PaymentCompleted"
          component={PaymentCompleted}
          initialParams={{new_qr: null}}
        />
        <Stack.Screen name="ProductsScreen" component={ProductsScreenNew} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthStack;
