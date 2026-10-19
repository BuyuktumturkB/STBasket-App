import {StyleSheet, Text, View} from 'react-native';
import React, {useContext, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import AuthStack from './stacks/AuthStack';
import BasketStack from './stacks/BasketStack';

import {TokenContext} from '../context/TokenContext';
import {WsContext} from '../context/WsContext';

const Navigation = () => {
  const {userToken, setToken} = useContext(TokenContext);
  const {connectInit, connect} = useContext(WsContext);

  useEffect(() => {
    if (!userToken) {
      connectInit();
      console.log('done');
    }
  }, []);

  if (!userToken) {
    console.log('authstack');
    return <AuthStack />;
  } else {
    return <BasketStack />;
  }
};

export default Navigation;
