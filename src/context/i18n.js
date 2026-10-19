import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from '../locales/en.json';
import tr from '../locales/tr.json';
import fr from '../locales/fr.json';
import de from '../locales/de.json';
import ar from '../locales/ar.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async callback => {
    try {
      const savedLanguage = await AsyncStorage.getItem('language');
      callback(savedLanguage || 'en');
    } catch (e) {
      console.log('Dil algılanamadı, varsayılan olarak en kullanılacak');
      callback('en');
    }
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {translation: en},
      tr: {translation: tr},
      fr: {translation: fr},
      de: {translation: de},
      ar: {translation: ar},
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
