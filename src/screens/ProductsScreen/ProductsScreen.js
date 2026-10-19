import {StyleSheet, ScrollView, View, Alert, Image} from 'react-native';
import React, {Fragment, useContext, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {TokenContext} from '../../context/TokenContext';
import RNRestart from 'react-native-restart';
import axios from 'axios';

import {
  Text,
  ListItem,
  Avatar,
  Icon,
  Badge,
  ListItemProps,
  Button,
  Switch,
  Card,
  lightColors,
  PricingCard,
  Overlay,
} from '@rneui/themed';
import {useSelector} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCartShopping} from '@fortawesome/free-solid-svg-icons/faCartShopping';
import {
  flushPopUp,
  setRemovingMode,
  resetRemovingMode,
  resetMultiChoosingMode,
} from '../../Redux/slicers/ProductListSlice';
import {image_links} from '../../assets/ImageLinks';
import MultiChoosingModeDialog from './MultiChoosingModeDialog';
import {API_URL} from '@env';

const ProductsScreen = () => {
  const {userToken, basketId} = useContext(TokenContext);
  const products = useSelector(state => state.products.ProductList);
  const totalPrice = useSelector(state => state.products.totalPrice);
  const totalQuantity = useSelector(state => state.products.totalQuantity);
  const popUpMessage = useSelector(state => state.products.popUpMessage);
  const isReset = useSelector(state => state.products.isReset);
  const isRemovingMode = useSelector(state => state.products.isRemovingMode);
  const isMultiChoosingMode = useSelector(
    state => state.products.isMultiChoosingMode,
  );
  const optionList = useSelector(state => state.products.optionList);

  const [expanded, setExpanded] = useState(true);
  const dispatch = useDispatch();

  const isPopUp = () => {
    return popUpMessage == null ? false : true;
  };

  const config = {
    headers: {
      Authorization: `Bearer ${userToken}`,
      // Authorization:
      //   "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZmF0aWhha2NhbkB5YW5kZXguY29tIiwiZXhwIjoxNjY3NTc5NzM5LCJpYXQiOjE2Njc1NDM3Mzl9.VVqRb8e1e7-oQg6bPSCPVbcBX5HN5IM31HOxNuUBSpI",
    },
  };

  useEffect(() => {
    if (isReset) {
      setTimeout(() => {
        RNRestart.Restart();
      }, 1000);
    }
  }, [isReset]);

  const onRemoveHandler = idx => {
    const dto = {
      name: products[idx].name,
      weight: null,
      basketId: basketId,
    };
    axios
      // .delete('http://10.0.2.2:4343/api/v1/product/remove_product', {
      .delete(`${API_URL}/product/remove_product`, {
        data: dto,
        headers: {Authorization: `Bearer ${userToken}`},
      })
      .then(res => {})
      .catch(err => {
        console.log(err.response.data);
        // setErrorMessage(err.response.data.errorMessage)
        Alert.alert('HATA!', 'Ürün sepetten çıkarılamadı.', [
          {
            text: 'Tamam',
          },
        ]);
      });
  };

  const onSetRemovingModeHandler = () => {
    axios
      // .get(`http://10.0.2.2:4343/api/v1/product/setRemovingMode?basketId=${basketId}`, config)
      .get(`${API_URL}/product/setRemovingMode?basketId=${basketId}`, config)
      .then(response => {
        dispatch(setRemovingMode());
      })
      .catch(error => {
        // handle error
        console.log(error);
        Alert.alert('HATA!', 'Ürün çıkarma modu aktifleştirilemedi!', [
          {
            text: 'Tamam',
          },
        ]);
      });
  };

  const onResetRemovingModeHandler = () => {
    axios
      .get(`${API_URL}/product/resetRemovingMode?basketId=${basketId}`, config)
      .then(response => {
        dispatch(resetRemovingMode());
      })
      .catch(error => {
        // handle error
        console.log(error);
        Alert.alert('HATA!', 'Ürün çıkarma modu kapatılamadı!', [
          {
            text: 'Tamam',
          },
        ]);
      });
  };

  const sendChooseFromMulti = data => {
    const dto = {
      name: data.name,
      weight: data.weight,
      basketId: basketId,
    };
    axios
      .post(`${API_URL}/product/save`, dto, config)
      .then(res => {
        dispatch(resetMultiChoosingMode());
      })
      .catch(err => {
        console.log(err.response.data);
        // setErrorMessage(err.response.data.errorMessage)
        Alert.alert('HATA!', err.response.data.errorMessage, [
          {
            text: 'Tamam',
          },
        ]);
      });
  };

  const sendBarcodeReaderEvent = () => {
    axios
      .get(`${API_URL}/product/setBarcodeEvent?basketId=${basketId}`, config)
      .then(res => {
        dispatch(resetMultiChoosingMode());
      })
      .catch(err => {});
    Alert.alert(
      'Barkod okutun',
      'Lütfen son eklediğiniz ürünün barkodunu okutun veya ürünü çıkarın',
      [
        {
          text: 'Tamam',
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.list}>
      {!isRemovingMode ? (
        <Button color="error" onPress={() => onSetRemovingModeHandler()}>
          ÜRÜN ÇIKARMA MODUNU AÇ
        </Button>
      ) : (
        <Button color="primary" onPress={() => onResetRemovingModeHandler()}>
          ÜRÜN ÇIKARMA MODUNU KAPAT
        </Button>
      )}
      <ListItem.Accordion
        content={
          <>
            {/* <Icon name="shopping-basket" size={30} /> */}
            <FontAwesomeIcon icon={faCartShopping} size={30} />

            <ListItem.Content>
              <ListItem.Title> Sepetteki Ürünler</ListItem.Title>
            </ListItem.Content>
          </>
        }
        icon={<Icon name="arrow-drop-down" size={30} />}
        expandIcon={<Icon name="arrow-drop-down" size={30} />}
        isExpanded={expanded}
        onPress={() => {
          setExpanded(!expanded);
        }}>
        {products.map((product, idx) => (
          <Fragment key={idx}>
            <ListItem key={idx} bottomDivider>
              <ListItem.Content>
                <ListItem.Title style={{color: 'red'}}>
                  {product.name}
                </ListItem.Title>
                <ListItem.Subtitle>
                  Birim fiyatı: {product.unitPrice}₺
                </ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Content>
                <Image
                  source={{uri: image_links[products[idx].name]}}
                  style={styles.tinyLogo}></Image>
              </ListItem.Content>
              <ListItem.Content right>
                <ListItem.Subtitle right>
                  {product.quantity} adet
                </ListItem.Subtitle>
                <ListItem.Title right style={{color: 'green'}}>
                  {product.totalPrice}₺
                </ListItem.Title>
                <Button
                  title="-"
                  borderRadius={10}
                  color="error"
                  size="lg"
                  onPress={() => onRemoveHandler(idx)}
                />
              </ListItem.Content>
            </ListItem>
          </Fragment>
        ))}
      </ListItem.Accordion>
      <PricingCard
        color={lightColors.primary}
        title="Sepet Tutarı"
        price={totalPrice + '₺'}
        // info={[`${totalQuantity} Ürün`]}
        info={[`${totalQuantity} Ürün`]}
        button={{title: ' GET STARTED', icon: 'flight-takeoff'}}
      />
      <Overlay
        isVisible={popUpMessage != null}
        onBackdropPress={() => dispatch(flushPopUp())}>
        <Text style={styles.textPrimary}>
          {isPopUp()
            ? popUpMessage.message == 'READ_BARCODE'
              ? 'GEÇERSİZ ÜRÜN AĞIRLIĞI\n\nLÜTFEN BARKOD OKUTUN\n'
              : null
            : null}
        </Text>
        <Text style={styles.textSecondary}>
          ÜRÜN: {isPopUp() ? popUpMessage.productName : null}
          {'\n'}
        </Text>
        <Button
         
          title="Tamam"
          onPress={() => dispatch(flushPopUp())}
          width="100%"
          height="100%"
          borderRadius={10}
        />
      </Overlay>
      <Overlay isVisible={isReset}>
        <Text style={styles.textPrimary}>
          ALIŞVERİŞ TAMAMLANDI, İYİ GÜNLER DİLERİZ.
        </Text>
      </Overlay>
      {console.log(optionList)}
      {optionList && (
        <MultiChoosingModeDialog
          visible={isMultiChoosingMode}
          options={optionList}
          onPressItem={data => sendChooseFromMulti(data)}
          onPressOther={() => sendBarcodeReaderEvent()}
        />
      )}
    </ScrollView>
  );
};

export default ProductsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: lightColors.greyOutline,
  },
  subtitleView: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 5,
  },
  ratingImage: {
    height: 19.21,
    width: 100,
  },
  ratingText: {
    paddingLeft: 10,
    color: 'grey',
  },
  textPrimary: {
    paddingHorizontal: 100,
    fontSize: 25,
  },

  textSecondary: {
    paddingHorizontal: 100,
    fontSize: 25,
    textAlign: 'center',
  },

  tinyLogo: {
    width: 70,
    height: 70,
  },
});
