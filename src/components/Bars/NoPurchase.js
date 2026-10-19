import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React, {useState, useContext} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import RNRestart from 'react-native-restart';
import {useSelector} from 'react-redux';
import {Title} from 'react-native-paper';
import {faStoreSlash} from '@fortawesome/free-solid-svg-icons';
import {useTranslation} from 'react-i18next';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ThemeContext} from '../../context/ThemeContext';
import BackgroundWrapper from '../../context/BackgroundWrapper';
import {API_URL} from '@env';
import axios from 'axios';
import {TokenContext} from '../../context/TokenContext';

import {AuthenticateContext} from '../../context/AuthanticateContext';

const NoPurchase = () => {
  const [isPanelVisible, setPanelVisible] = useState(false);
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const {userToken} = useContext(TokenContext);
  const {deviceId, basketId} = useContext(AuthenticateContext);

  const productList = useSelector(state => state.products.ProductList);

  const openWarningPanel = () => setPanelVisible(true);

  const endShoppingWithoutPurchase = async () => {
    console.log('Satınalma Yok');
    if (!productList || productList.length === 0) {
      const response = await axios.delete(
        `${API_URL}/matching_basket/clear-matching-in_store/${basketId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      );
      if (response) {
        console.log('BOŞ SEPET:', response.data);
        RNRestart.Restart();
      }
    } else {
      Alert.alert(t('emptyBasketAlert'), t('ok'));
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={openWarningPanel}>
        <MaterialIcons name="logout" size={30} color={theme.textColor} />
      </TouchableOpacity>

      <Modal visible={isPanelVisible} transparent={false}>
        <BackgroundWrapper
          style={styles.backgroundStyle}
          source={require('../../assets/images/shoppingcartbackground.jpeg')}>
          <View
            style={[
              styles.constainerStyle,
              {backgroundColor: theme.modalOverlay},
            ]}>
            <Title style={[styles.titleStyle]}>{t('warning')}</Title>
            <Text style={[styles.textStyle, {color: theme.textColor}]}>
              {t('noPurchaseWarning')}
            </Text>
            <View style={styles.rowStyle}>
              <TouchableOpacity onPress={endShoppingWithoutPurchase}>
                <Text style={[styles.leftButtonStyle]}>{t('yes')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setPanelVisible(false)}>
                <Text style={[styles.rightButtonStyle]}>{t('no')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BackgroundWrapper>
      </Modal>
    </View>
  );
};

export default NoPurchase;

const styles = StyleSheet.create({
  backgroundStyle: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  constainerStyle: {
    height: '60%',
    width: '70%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleStyle: {
    fontSize: 30,
    fontFamily: 'Coolvetica Rg',
    height: '30%',
    color: '#ff5454ff',
  },
  rowStyle: {
    flexDirection: 'row',
    width: '100%',
    height: '30%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 18,
    fontFamily: 'Coolvetica Rg',
    textAlign: 'center',
  },
  leftButtonStyle: {
    backgroundColor: '#fa6767ff',
    fontFamily: 'Coolvetica Rg',
    color: 'white',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
  },
  rightButtonStyle: {
    backgroundColor: '#81b27aff',
    fontFamily: 'Coolvetica Rg',
    color: 'white',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
  },
});
