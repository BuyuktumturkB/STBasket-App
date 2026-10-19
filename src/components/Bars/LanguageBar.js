import React, {useState, useContext} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Modal,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ThemeContext} from '../../context/ThemeContext'; // Eğer temanız varsa

const languages = {
  en: {name: 'English', flag: 'https://flagcdn.com/w320/gb.png'},
  tr: {name: 'Türkçe', flag: 'https://flagcdn.com/w320/tr.png'},
  de: {name: 'Deutsch', flag: 'https://flagcdn.com/w320/de.png'},
  fr: {name: 'Français', flag: 'https://flagcdn.com/w320/fr.png'},
  ar: {name: 'Arabic', flag: 'https://flagcdn.com/w320/sa.png'},
};

const LanguageBar = () => {
  const {i18n} = useTranslation();
  const {theme} = useContext(ThemeContext); // tema kullanıyorsan
  const [isVisible, setIsVisible] = useState(false);

  const currentLanguage = (i18n.language || 'en').split('-')[0];

  const switchLanguage = async language => {
    await AsyncStorage.setItem('language', language);
    i18n.changeLanguage(language);
    setIsVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        style={[
          styles.selectedFlagContainer,
          {backgroundColor: theme.cardBackground},
        ]}>
        <Image
          source={{uri: languages[currentLanguage]?.flag}}
          style={styles.flagIcon}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <Modal
        transparent
        animationType="fade"
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)}>
        <Pressable style={styles.overlay} onPress={() => setIsVisible(false)}>
          <View
            style={[styles.dropdown, {backgroundColor: theme.cardBackground}]}>
            {Object.keys(languages).map(lang => (
              <TouchableOpacity
                key={lang}
                onPress={() => switchLanguage(lang)}
                style={styles.languageOption}>
                <Image
                  source={{uri: languages[lang].flag}}
                  style={styles.flagIconSmall}
                />
                <Text style={[styles.languageText, {color: theme.textColor}]}>
                  {languages[lang].name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: '10%',
    zIndex: 1000,
  },
  selectedFlagContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flagIcon: {
    width: '100%',
    height: '100%',
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    right: 10,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    width: 160,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  flagIconSmall: {
    width: 30,
    height: 20,
    marginRight: 10,
    borderRadius: 3,
  },
  languageText: {
    fontSize: 15,
    fontWeight: '600',
  },
  overlay: {
    flex: 1,
  },
});

export default LanguageBar;
