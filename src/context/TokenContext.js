import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import React, {createContext, useEffect, useState} from 'react';
import {over} from 'stompjs';

export const TokenContext = createContext();

export const TokenProvider = ({children}) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [splashLoading, setSplashLoading] = useState(false);
  const [sock, setCurrentSock] = useState(null);
  const [stompClient, setStompClient] = useState(null);

  const [basketId, setBasketId] = useState(2);
  const [userMail, setUserMail] = useState(null);
  const [decodedToken, setDecodedToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  const setToken = async (token, rToken = null) => {
    try {
      setIsLoading(true);
      setUserToken(token);
      setIsLoading(false);

      console.log({token});

      if (token) {
        await AsyncStorage.setItem('userToken', token);
      } else {
        await AsyncStorage.removeItem('userToken');
      }

      if (rToken) {
        await AsyncStorage.setItem('refreshToken', rToken);
      } else {
        await AsyncStorage.removeItem('refreshToken');
      }
    } catch (e) {
      console.error('Token kaydedilirken hata oluştu:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // const isLoggedIn = async () => {
  //   try {
  //     setUserToken(null);
  //     setSplashLoading(true);

  //     let token = await AsyncStorage.getItem('userToken');
  //     token = JSON.parse(token);

  //     if (token) {
  //       setUserToken(token);
  //     }

  //     setSplashLoading(false);
  //   } catch (e) {
  //     setSplashLoading(false);
  //     console.log(`error in isLoggedIn function: ${e}`);
  //   }
  // };
  useEffect(() => {
    if (userToken) {
      try {
        const decoded = jwtDecode(userToken);
        setDecodedToken(decoded);
        setUserMail(decoded?.sub || null);
      } catch (e) {
        console.error('Geçersiz token:', e);
        setDecodedToken(null);
        setUserMail(null);
      }
    } else {
      setDecodedToken(null);
      setUserMail(null);
    }
  }, [userToken]);

  useEffect(() => {
    // isLoggedIn();
  }, []);



  return (
    <TokenContext.Provider
      value={{
        userToken,
        isLoading,
        splashLoading,
        setToken,
        basketId,
        decodedToken,
        userMail,
      }}>
      {children}
    </TokenContext.Provider>
  );
};
