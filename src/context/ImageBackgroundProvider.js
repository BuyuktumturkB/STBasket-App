import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {imageMap} from '../constants/ImageMap';

const BackgroundImageContext = createContext();

export const BackgroundProvider = ({children}) => {
  const [backgroundImage, setBackgroundImage] = useState(
    require('../assets/images/shoppingcartbackground.jpeg'),
  );

  useEffect(() => {
    const loadBackgroundImage = async () => {
      try {
        const key = await AsyncStorage.getItem('backgroundImageKey');
        if (key && imageMap[key]) {
          setBackgroundImage(imageMap[key]);
        }
      } catch (error) {
        console.error('Error loading background image:', error);
      }
    };
    loadBackgroundImage();
  }, []);

  const updateBackgroundImage = async imageKey => {
    try {
      await AsyncStorage.setItem('backgroundImageKey', imageKey);
      setBackgroundImage(imageMap[imageKey]);
    } catch (error) {
      console.log('Arka plan kaydı başarısız:', error);
    }
  };

  return (
    <BackgroundImageContext.Provider
      value={{backgroundImage, setBackgroundImage, updateBackgroundImage}}>
      {children}
    </BackgroundImageContext.Provider>
  );
};

export const useBackground = () => useContext(BackgroundImageContext);
