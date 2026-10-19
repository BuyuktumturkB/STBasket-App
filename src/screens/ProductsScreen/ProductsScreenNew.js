// TAM DÜZENLENMİŞ PRODUCTS SCREEN (TEMA DESTEKLİ VE HATASIZ)
// Tüm içerik, tema desteğiyle ve ikon stilleriyle güncellenmiştir.

import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import {Button} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import Appbar from '../../components/Bars/Appbar';
import OthersModal from '../../components/Modals/OtherProductsModal';
import {TokenContext} from '../../context/TokenContext';
import {ThemeContext} from '../../context/ThemeContext';
import {useTranslation} from 'react-i18next';
import {API_URL} from '@env';
import {
  faCoins,
  faCartShopping,
  faSmile,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Text} from '@rneui/themed';
import {
  flushPopUp,
  resetMultiChoosingMode,
} from '../../Redux/slicers/ProductListSlice';
import BarcodeModal from '../../components/Modals/BarcodeModal';
import ManualProduct from '../../components/Modals/ManualProduct';
import CompleteShoppingModal from '../../components/Modals/PaymentMethodModal';
import WaitingPaymentModal from '../../components/Modals/WaitingPaymentModal';
import ShoppingPlan from '../../components/interfaces/ShoppingPlanInterface';
import ListRow from './ListRow';
import MultiChoosingModeDialog from './MultiChoosingModeDialog';
import PopUpOverlay from './PopUpOverlay';
import BackgroundWrapper from '../../context/BackgroundWrapper';
const {useCurrency} = require('../../context/CurrencyProvider');
import AsyncStorage from '@react-native-async-storage/async-storage';
import {WsContext} from '../../context/WsContext';
import {useNavigation} from '@react-navigation/native';

const ProductsScreenNew = () => {
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);
  const {userToken, basketId} = useContext(TokenContext);
  const {currency} = useCurrency();
  const dispatch = useDispatch();

  const products = useSelector(state => state.products.InterfaceList);
  const productList = useSelector(state => state.products.ProductList);
  const totalPrice = useSelector(state => state.products.totalPrice);
  const totalQuantity = useSelector(state => state.products.totalQuantity);
  const popUpMessage = useSelector(state => state.products.popUpMessage);
  const isMultiChoosingMode = useSelector(
    state => state.products.isMultiChoosingMode,
  );
  const optionList = useSelector(state => state.products.optionList);

  const [isManualVisible, setManualVisible] = useState(false);
  const [isBarcodeModalVisible, setBarcodeModalVisible] = useState(false);
  const [isCompleteVisible, setComplete] = useState(false);
  const [isWaitingVisible, setWaiting] = useState(false);
  const [isOthersVisible, setOthersModal] = useState(false);

  const{isPersonnel,isPaid} = useContext(WsContext);
  const navigation = useNavigation();

  /*useEffect(() => {
    const user_id = '123abc';
    const socket = io('http://192.168.4.87:8081');
    socket.on('connect', () => {
      console.log('Socket bağlantısı kuruldu.');
    });
    socket.emit('market_icon_status_change', {
      user_id,
      status: 'on use',
      color: 'blue',
    });
    return () => {
      socket.emit('market_icon_status_change', {
        user_id,
        status: 'cancelled',
        color: 'white',
      });
      socket.disconnect();
    };
  }, []); */

 
  useEffect(() => {
    if (popUpMessage?.message === 'RESET_REMOVING_MODE') {
      Alert.alert('Bilgi', 'Ürün çıkarma modu sıfırlandı.');
    }
  }, [popUpMessage]);

  const saveShoppingSession = async () => {
    try {
      const now = new Date();
      const session = {
        sessionId: `session_${now.getTime()}`,
        sessionDate: now.toLocaleDateString(),
        sessionTime: now.toLocaleTimeString(),
        completedAt: now.toISOString(),
        totalPrice,
        productList,
      };
      const existingSessions = await AsyncStorage.getItem('shoppingSessions');
      let sessions = existingSessions ? JSON.parse(existingSessions) : [];
      sessions.push(session);
      await AsyncStorage.setItem('shoppingSessions', JSON.stringify(sessions));
    } catch (error) {
      console.log('Alışveriş kaydedilirken hata:', error);
    }
  };

  const config = {
    headers: {Authorization: `Bearer ${userToken}`},
  };

  const openComplete = async () => {
    if (isPersonnel) {
      if (isPaid === false) {
        navigation.navigate('WaitingPayment');
      }
      if (isPaid === true) {
        navigation.navigate('PaymentCompleted');
      }
    } else {
      saveShoppingSession();
      setComplete(true);
    }
  };

  const closeComplete = () => setComplete(false);
  const openManual = () => setManualVisible(true);
  const closeManual = () => setManualVisible(false);
  const openBarcodeModal = () => {
    setManualVisible(false);
    setBarcodeModalVisible(true);
  };
  const closeBarcodeModal = () => {
    setBarcodeModalVisible(false);
    axios
      .get(
        `${API_URL}/product/resetBarcodeSaveMode?basketId=${basketId}`,
        config,
      )
      .catch(err => console.log(err));
  };
  const openOthers = () => {
    setManualVisible(false);
    setOthersModal(true);
  };
  const closeOthers = () => setOthersModal(false);
  const openWaitingPayment = () => {
    setWaiting(true);
    setComplete(false);
  };
  const closeWaiting = () => setWaiting(false);

  const sendChooseFromMulti = data => {
    const dto = {name: data.name, weight: data.weight, basketId};
    axios
      .delete(`${API_URL}/product/remove_product`, {
        data: dto,
        headers: {Authorization: `Bearer ${userToken}`},
      })
      .then(() => dispatch(resetMultiChoosingMode()))
      .catch(err =>
        Alert.alert(
          'HATA!',
          err.response?.data?.errorMessage || 'Bilinmeyen hata',
        ),
      );
  };

  const sendBarcodeRemoveEvent = () => {
    axios
      .get(
        `${API_URL}/product/setBarcodeRemoveMode?basketId=${basketId}`,
        config,
      )
      .then(() => {
        dispatch(resetMultiChoosingMode());
        dispatch(flushPopUp());
      })
      .catch(() => {});
    Alert.alert(
      'Barkod okutun',
      'İçin çıkarmak istediğiniz ürünün barkodunu okutun.',
      [{text: 'Tamam'}],
    );
  };

  const styles = createStyles(theme);

  return (
    <BackgroundWrapper style={{backgroundColor: theme.cardBackground}}>
      <View style={styles.container}>
        <View style={styles.appBarStyle}>
          <Appbar />
        </View>

        <View style={styles.mainContent}>
          <View style={styles.leftContentStyle}>
            <View style={styles.listWrapper}>
              <ScrollView style={styles.list}>
                {products.map((product, idx) => (
                  <ListRow key={idx} product={product} idx={idx} />
                ))}
              </ScrollView>

              {popUpMessage && (
                <PopUpOverlay
                  isVisible={popUpMessage != null}
                  popUpMessage={popUpMessage}
                />
              )}

              {optionList && (
                <MultiChoosingModeDialog
                  visible={isMultiChoosingMode}
                  options={optionList}
                  onPressItem={data => sendChooseFromMulti(data)}
                  onPressOther={sendBarcodeRemoveEvent}
                />
              )}
            </View>
            <TouchableOpacity onPress={openManual} style={styles.manualButton}>
              <Text style={styles.manualButtonText}>
                {t('manual')} {t('itemAdding')}
              </Text>
              <View style={styles.shoppingCartBackgroundStyle}>
                <FontAwesomeIcon
                  icon={faCartShopping}
                  size={30}
                  style={styles.cartIcon}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.rightContentStyle}>
            <ShoppingPlan />
          </View>
        </View>

        <View style={styles.bottomTab}>
          <View style={styles.bottomLeft}>
            <FontAwesomeIcon
              icon={faCartShopping}
              size={30}
              color={theme.textColor}
            />
            <Text style={styles.bottomTextStyle}>
              {t('numberOfProductsinBasket')}: {totalQuantity}
            </Text>
          </View>

          <View style={styles.bottomCenter}>
            <FontAwesomeIcon icon={faCoins} size={30} color={theme.textColor} />
            <Text style={styles.bottomTextStyle}>
              {t('sum')}: {totalPrice} {currency.symbol}
            </Text>
          </View>

          <Text style={[styles.footerText, {color: theme.textColor}]}>
            Developed By
          </Text>

          <View style={styles.selftech}>
            <Image
              style={styles.logoImage}
              resizeMode="contain"
              source={
                theme.isDark
                  ? require('../../assets/images/stlogo2.png')
                  : require('../../assets/images/stlogo.png')
              }
            />
          </View>

          <TouchableOpacity
            onPress={openComplete}
            style={styles.completeButtonContainer}>
            <View style={styles.completeButtonStyle}>
              <FontAwesomeIcon icon={faSmile} size={20} color="white" />
              <Text style={styles.completeButtonText}>
                {t('completeShopping')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <ManualProduct
          isVisible={isManualVisible}
          onUseBarcode={openBarcodeModal}
          onClose={closeManual}
          OnUseOthers={openOthers}
        />
        <BarcodeModal
          isVisible={isBarcodeModalVisible}
          onClose={closeBarcodeModal}
        />
        <OthersModal isVisible={isOthersVisible} onClose={closeOthers} />
        <CompleteShoppingModal
          isVisible={isCompleteVisible}
          onUseWaitingPayment={openWaitingPayment}
          onClose={closeComplete}
        />
        <WaitingPaymentModal
          isVisible={isWaitingVisible}
          onClose={closeWaiting}
        />
      </View>
    </BackgroundWrapper>
  );
};

export default ProductsScreenNew;

const createStyles = theme =>
  StyleSheet.create({
    container: {flex: 1},
    appBarStyle: {width: '100%', height: '10%'},
    mainContent: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      height: '70%',
      marginVertical: '2%',
    },
    listWrapper: {height: '85%', width: '95%', marginLeft: '2%'},
    list: {
      borderTopWidth: 3,
      borderColor: '#5ba958ff',
      top: 20,
    },
    leftContentStyle: {
      width: '60%',
      borderRadius: 30,
      backgroundColor: 'rgba(0, 0, 0, 0.55)',
      marginLeft: '3%',
      justifyContent: 'space-between',
    },
    rightContentStyle: {
      width: '30%',
      borderRadius: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.55)',
    },
    selftech: {
      position: 'absolute',
      top: '110%',
      left: '55%',
      transform: [{translateX: -100}, {translateY: -25}],
    },

    logoImage: {
      width: 200,
      height: 50,
      resizeMode: 'contain',
    },
    footerText: {
      fontSize: 12,
      textAlign: 'center',
      marginTop: 30,
      fontFamily: 'Coolvetica Rg',
      fontStyle: 'italic',
      right: 110,
      bottom: 5,
    },
    manualButton: {
      flexDirection: 'row',
      borderRadius: 10,
      marginTop: 25,
      marginBottom: 15,
      height: 60,
      marginLeft: '20%',
      width: '60%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#5ba958ff',
    },
    manualButtonText: {
      fontSize: 20,
      color: 'white',
      fontFamily: 'Coolvetica Rg',
    },
    shoppingCartBackgroundStyle: {
      width: 50,
      height: 50,
      borderRadius: 5,
      backgroundColor: '#d0ff00ff',
      margin: 20,
      transform: [{rotate: '45deg'}],
      shadowColor: 'white',
      shadowOpacity: 0.3,
      shadowOffset: {width: 0, height: 2},
      shadowRadius: 3,
    },
    cartIcon: {
      color: '#515151ff',
      marginTop: '20%',
      marginLeft: '20%',
      transform: [{rotate: '315deg'}],
    },
    bottomTab: {
      flexDirection: 'row',
      height: '10%',
      paddingHorizontal: '2%',
      alignItems: 'center',
    },
    bottomLeft: {
      flexDirection: 'row',
      width: '30%',
      alignItems: 'center',
    },
    bottomCenter: {
      flexDirection: 'row',
      width: '30%',
      right: 80,
      justifyContent: 'center',
      alignItems: 'center',
    },
    bottomRight: {
      width: '30%',
      justifyContent: 'center',
    },
    bottomTextStyle: {
      color: theme.textColor,
      fontFamily: 'Coolvetica Rg',
      fontSize: 16,
      marginLeft: 8,
    },
    completeButtonStyle: {
      backgroundColor: '#5ba958ff',
      borderRadius: 10,
      width: 330,
      left: 5,
      flexDirection: 'row-reverse',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'flex-end',
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    completeButtonText: {
      fontSize: 20,
      marginRight: 10,
      color: 'white',
      fontFamily: 'Coolvetica Rg',
    },
  });
