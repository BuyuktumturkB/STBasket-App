import React, {createContext, useState} from 'react';
import {NativeModules} from 'react-native';

const {KioskModule} = NativeModules;

export const KioskContext = createContext();

export const KioskProvider = ({children}) => {
  const [isKioskActive, setIsKioskActive] = useState(true);

  const toggleKiosk = value => {
    setIsKioskActive(value);
    try {
      if (value) {
        KioskModule?.startKiosk?.();
      } else {
        KioskModule?.stopKiosk?.();
      }
    } catch (e) {
      console.log('Kiosk durumu değiştirilemedi:', e);
    }
  };

  return (
    <KioskContext.Provider value={{isKioskActive, toggleKiosk}}>
      {children}
    </KioskContext.Provider>
  );
};