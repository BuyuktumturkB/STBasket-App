// contexts/CurrencyContext.js
import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CurrencyContext = createContext();

const STORAGE_KEY = '@selected_currency';

export const CurrencyProvider = ({children}) => {
  const [currency, setCurrencyState] = useState({code: 'TRY', symbol: '₺'});

  useEffect(() => {
    const loadCurrency = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setCurrencyState(parsed);
        }
      } catch (e) {
        console.warn('Currency yüklenemedi', e);
      }
    };
    loadCurrency();
  }, []);

  const setCurrency = async selected => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
      setCurrencyState(selected);
    } catch (e) {
      console.warn('Currency kaydedilemedi', e);
    }
  };

  return (
    <CurrencyContext.Provider value={{currency, setCurrency}}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
