import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import NoPurchase from './NoPurchase';
import PersonnelVerification from '../security/PersonnelVerification';
import CallPersonnel from '../../messages/CallPersonnal';
import React, {useState, useContext} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ThemeContext} from '../../context/ThemeContext';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faSun, faMoon} from '@fortawesome/free-solid-svg-icons';
import {Text} from 'react-native';
import LanguageBar from './LanguageBar';

export default function Appbar() {
  const [iscallVisible, setCallVisible] = useState(false);
  const {theme, toggleTheme} = useContext(ThemeContext);

  return (
    <View
      style={[styles.appbarContainer, {backgroundColor: theme.cardBackground}]}>
      <View style={styles.logoWrapper}>
        <Image
          style={styles.logo}
          resizeMode="contain"
          source={
            theme.isDark
              ? require('../../assets/images/selfchartwhite.png')
              : require('../../assets/images/selfchartdark.png')
          }
        />
      </View>
      <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
        <FontAwesomeIcon
          icon={theme.isDark ? faSun : faMoon}
          size={30}
          color={theme.textColor}
        />
        <Text style={{color: theme.textColor, marginLeft: 0}}>
          {theme.isDark}
        </Text>
      </TouchableOpacity>

      <View style={styles.iconsWrapper}>
        <View style={styles.iconItem}>
          <NoPurchase />
        </View>
        <View style={styles.iconItem}>
          <PersonnelVerification />
        </View>
        {/*<TouchableOpacity onPress={() => setCallVisible(true)} style={styles.iconItem}>
          <MaterialIcons name="phone-enabled" size={30} color={theme.textColor} />
        </TouchableOpacity>
        <CallPersonnel
          isVisible={iscallVisible}
          onClose={() => setCallVisible(false)}
        /> */}
        <LanguageBar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appbarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    height: 80,
    width: '100%',
  },
  logoWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '60%',
    height: 75,
  },
  iconsWrapper: {
    position: 'absolute',
    right: 80,
    top: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconItem: {
    marginHorizontal: 15,
  },
  themeButton: {
    position: 'absolute',
    top: 35,
    left: '1%',
  },
});
