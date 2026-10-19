import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import QRScreen from '../../screens/QRScreen';
import AnimationScreen from '../../screens/AnimationScreen/AnimationPage';

const AnimationStack = () => {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="AnimationScreen"
          component={AnimationScreen}
          initialParams={{new_qr: null}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default AnimationStack;
