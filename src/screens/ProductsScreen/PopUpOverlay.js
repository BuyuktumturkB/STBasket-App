import {Alert, StyleSheet, View} from 'react-native';
import React, {useContext, useState} from 'react';
import {Button, Overlay, Text} from '@rneui/themed';
import {useDispatch} from 'react-redux';
import {
  flushPopUp,
  resetMultiChoosingMode,
} from '../../Redux/slicers/ProductListSlice';
import {API_URL} from '@env';
import {TokenContext} from '../../context/TokenContext';
import axios from 'axios';

const PopUpOverlay = ({isVisible, popUpMessage}) => {
  const {userToken, basketId} = useContext(TokenContext);
  const dispatch = useDispatch();

  const isPopUp = () => {
    return popUpMessage == null ? false : true;
  };

  const config = {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  };

  const [isBarcodeRead, setIsBarcodeRead] = useState(null);

  const sendBarcodeReadEvent = () => {
    // setIsBarcodeRead(true);
    axios
      .get(`${API_URL}/product/setBarcodeSaveMode?basketId=${basketId}`, config)
      .then(res => {
        // dispatch(flushPopUp());
        setIsBarcodeRead(true);
      })
      .catch(err => {});
    // Alert.alert(
    //   'Barkod okutun',
    //   'Lütfen eklemek istediğiniz ürünün barkodunu okutun.',
    //   [
    //     {
    //       text: 'Tamam',
    //     },
    //   ],
    // );
  };

  const sendBarcodeRemoveEvent = () => {
    axios
      .get(
        `${API_URL}/product/setBarcodeRemoveMode?basketId=${basketId}`,
        config,
      )
      .then(res => {
        dispatch(resetMultiChoosingMode());
        dispatch(flushPopUp());
      })
      .catch(err => {});
    Alert.alert(
      'Barkod okutun',
      'Lütfen çıkarmak istediğiniz ürünün barkodunu okutun.',
      [
        {
          text: 'Tamam',
        },
      ],
    );
  };

  const resetBarcodeModeEvent = () => {
    axios
      .get(
        `${API_URL}/product/resetBarcodeSaveMode?basketId=${basketId}`,
        config,
      )
      .then(res => {
        dispatch(flushPopUp());
      })
      .catch(err => {});
    Alert.alert('İptal', 'Barkod okuma iptal edildi.', [
      {
        text: 'Tamam',
      },
    ]);
  };

  if (popUpMessage.message === 'REMOVE_BARCODE_MODE')
    return (
      <Overlay
        isVisible={popUpMessage != null}
        onBackdropPress={() => dispatch(flushPopUp())}>
        <Text style={styles.textPrimary}>
          {isPopUp()
            ? popUpMessage.message == 'REMOVE_BARCODE_MODE'
              ? '       TAHMİN EDİLEMEDİ\n\nLÜTFEN BARKOD OKUTUN\n'
              : null
            : null}
        </Text>

        {/* <Button
          title="Tamam"
          onPress={() => sendBarcodeRemoveEvent()}
          width="100%"
          height="100%"
          borderRadius={10}
        /> */}
      </Overlay>
    );
  else if (popUpMessage.message === 'READ_BARCODE')
    return !isBarcodeRead ? (
      <Overlay
        isVisible={popUpMessage != null}
        onBackdropPress={() => dispatch(flushPopUp())}>
        <Text style={styles.textPrimary}>
          {'GEÇERSİZ ÜRÜN AĞIRLIĞI\n\nLÜTFEN BARKOD OKUTUN'}
        </Text>
        <View style={{flexDirection:'row', justifyContent:"center", marginTop:30}}>
          <Button
            title="Tamam"
            onPress={() => sendBarcodeReadEvent()}
            width="100%"
            height="100%"
            borderRadius={10}
            containerStyle={styles.button}
          />
          <Button
            title="İptal"
            onPress={() => dispatch(flushPopUp())}
            width="100%"
            height="100%"
            borderRadius={10}
            color="error"
            containerStyle={styles.button}
          />
        </View>
      </Overlay>
    ) : (
      <Overlay>
        <Text style={styles.textPrimary}>BARKOD OKUTUN</Text>
      </Overlay>
    );
};

export default PopUpOverlay;

const styles = StyleSheet.create({
  textPrimary: {
    paddingHorizontal: 100,
    fontSize: 25,
  },
  button: {
    marginHorizontal:5,
    width:200
  }
});
