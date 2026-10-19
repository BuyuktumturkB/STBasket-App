import React, {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthenticateContext = createContext();

export const AuthenticateProvider = ({children}) => {
  const [adminToken, setAdminToken] = useState(null);
  const [basketId, setBasketId] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isOutOfOrder, setIsOutOfOrder] = useState(false);
  const [provisioningCode, setProvisioningCode] = useState();

  // BasketConfiguration'ın ihtiyaç duyduğu eksik state'ler
  const [hardwareSerial, setHardwareSerial] = useState(null);
  const [deviceBasketNumber, setDeviceBasketNumber] = useState(null);

  const setVerificationToken = token => {
    setAdminToken(token);
    console.log('Yönetici Token: ', token);
  };

  const logout = () => {
    setAdminToken(null);
    console.log('Yönetici oturumu kapatıldı');
  };

  useEffect(() => {
    const loadDeviceSettings = async () => {
      try {
        const storedBasketId = await AsyncStorage.getItem('basketId');
        const storedDeviceId = await AsyncStorage.getItem('deviceId');
        const storedOutOfOrder = await AsyncStorage.getItem('isOutOfOrder');
        const storedHardwareSerial = await AsyncStorage.getItem('hardwareSerial');

        if (storedBasketId) setBasketId(storedBasketId);
        if (storedDeviceId) setDeviceId(storedDeviceId);
        if (storedHardwareSerial) setHardwareSerial(storedHardwareSerial);
        if (storedOutOfOrder === 'true') setIsOutOfOrder(true);
        if (storedOutOfOrder === 'false') setIsOutOfOrder(false);
      } catch (e) {
        console.log('Device settings load error:', e);
      }
    };

    loadDeviceSettings();
  }, []);

  useEffect(() => {
    if (basketId !== null) {
      AsyncStorage.setItem('basketId', basketId);
    }
  }, [basketId]);

  useEffect(() => {
    if (deviceId !== null) {
      AsyncStorage.setItem('deviceId', deviceId);
    }
  }, [deviceId]);

  useEffect(() => {
    AsyncStorage.setItem('isOutOfOrder', isOutOfOrder ? 'true' : 'false');
  }, [isOutOfOrder]);

  return (
    <AuthenticateContext.Provider
      value={{
        adminToken,
        verificationToken: adminToken, // <-- BasketConfiguration burayı arıyor!
        setVerificationToken,
        logout,
        isAuthorized,
        setAdminToken,
        deviceId,
        setDeviceId,
        basketId,
        setBasketId,
        isOutOfOrder,
        setIsOutOfOrder,
        provisioningCode,
        setProvisioningCode,
        hardwareSerial,
        setHardwareSerial,           // <-- BasketConfiguration burayı arıyor!
        deviceBasketNumber,
        setDeviceBasketNumber,       // <-- BasketConfiguration burayı arıyor!
      }}>
      {children}
    </AuthenticateContext.Provider>
  );
};