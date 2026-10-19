import CryptoJS from 'crypto-js';
import jwt_decode from 'jwt-decode';
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import RNRestart from 'react-native-restart';
import {useDispatch} from 'react-redux';
import SockJS from 'sockjs-client';
import {over} from 'stompjs';
import {addToOptionsList} from '../Redux/slicers/OptionListSlice';
import {updatePlanList} from '../Redux/slicers/PlanListSlice';
import {updateBasket} from '../Redux/slicers/ProductListSlice';
import {TokenContext} from './TokenContext';

export const WsContext = createContext();

export const WsProvider = ({children}) => {
  const [isPersonnel, setIsPersonnel] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [hasEnoughStock, setEnoughStock] = useState(false);
  const {userToken, setToken} = useContext(TokenContext);
  const dispatch = useDispatch();

  const [isRefreshingWs, setIsRefreshingWs] = useState(false);

  // 1. Kanal (STOMP/SockJS) Değişkenleri
  let Sock = null;
  let stompClient = null;
  let _userToken = null;
  let tokenTimeout = null;
  let sub = null;

  // 2. Kanal (232 IP - Raw WebSocket) İçin Referans
  const rawWsRef = useRef(null);

  const decrypt = (data, key, iv) => {
    try {
      var ciphertextWA = CryptoJS.enc.Base64.parse(data);
      var keyWA = CryptoJS.enc.Utf8.parse(key);
      var ivWA = CryptoJS.enc.Utf8.parse(iv);
      var encryptedCP = CryptoJS.lib.CipherParams.create({
        ciphertext: ciphertextWA,
        formatter: CryptoJS.format.OpenSSL,
      });

      var decrypted = CryptoJS.AES.decrypt(encryptedCP, keyWA, {iv: ivWA});
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (err) {
      console.log('Decryption error:', err);
    }
  };

  const remainingTime = (token, thres_in_sec = 0) => {
    try {
      const decoded = jwt_decode(token);
      const expirationTimeMs = decoded.exp * 1000;
      const currentTimeMs = new Date().getTime();
      const thresholdMs = thres_in_sec * 1000;
      return expirationTimeMs - currentTimeMs - thresholdMs;
    } catch (error) {
      console.log('Token decode error:', error);
      return 0;
    }
  };

  // ==========================================
  // ORTAK VERİ İŞLEME VE SEPETE AKTARMA MANTIĞI
  // ==========================================
  const handleIncomingPayload = (payloadData, sourceName) => {
    console.log(`📥 [${sourceName}] Gelen Veri İşleniyor:`, payloadData);

    // EĞER 232 kanalından barkod/tartı event'i geldiyse:
    if (
      sourceName === '232-RawWebSocket' &&
      payloadData.event === 'barcode_detected'
    ) {
      console.log(
        `🔍 [232] Barkod Yakalandı: ${payloadData.product_name} (Ağırlık: ${payloadData.weight}g)`,
      );

      // Gelen ham veriyi sepet formatına dönüştürüyoruz
      const detectedItem = {
        name: payloadData.product_name,
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
        weight: payloadData.weight,
        barcode: payloadData.barcode,
        imageUri: null,
      };

      // STOMP sepetinin yapısına uygun şekilde updateBasket'e sevk ediyoruz
      dispatch(
        updateBasket({
          productsList: [detectedItem],
        }),
      );
      return;
    }

    // 73 STOMP Kanalından gelen normal sepet/liste verileri:
    if (payloadData.shoppingList) {
      dispatch(updatePlanList(payloadData.shoppingList));
    }

    if (payloadData.optionList && Array.isArray(payloadData.optionList)) {
      payloadData.optionList.forEach(item => {
        dispatch(addToOptionsList(item));
      });
    }

    if (payloadData) {
      dispatch(updateBasket(payloadData));
    }
  };

  // ==========================================
  // KANAL 2: Raw WebSocket (ws://192.168.4.232:9095/ws)
  // ==========================================
  const connectRawWebSocket = () => {
    const uri = 'ws://192.168.4.232:9095/ws';
    console.log(`🔌 [232 Kanalı] WebSocket bağlantısı başlatılıyor: ${uri}`);

    rawWsRef.current = new WebSocket(uri);

    rawWsRef.current.onopen = () => {
      console.log('✅ [232 Kanalı] Bağlantı başarılı! Ürünler dinleniyor...');
    };

    rawWsRef.current.onmessage = event => {
      try {
        const data = JSON.parse(event.data);
        console.log('📥 [232 Kanalı - YENİ ÜRÜN YAKALANDI]', data);

        // Ortak işleme fonksiyonuna yönlendiriyoruz
        handleIncomingPayload(data, '232-RawWebSocket');
      } catch (err) {
        console.log('🔥 [232 Kanalı] JSON parse error:', err);
      }
    };

    rawWsRef.current.onerror = error => {
      console.log('🔥 [232 Kanalı] Hata:', error.message);
    };

    rawWsRef.current.onclose = () => {
      console.log(
        '❌ [232 Kanalı] Bağlantı koptu. 3 saniye sonra tekrar denenecek...',
      );
      setTimeout(() => {
        connectRawWebSocket();
      }, 3000);
    };
  };

  useEffect(() => {
    connectRawWebSocket();

    return () => {
      if (rawWsRef.current) {
        rawWsRef.current.close();
      }
    };
  }, []);

  // ==========================================
  // KANAL 1: STOMP / SockJS (http://192.168.4.73:4343/ws)
  // ==========================================
  const connectInit = () => {
    if (Sock) {
      Sock.close();
    }
    Sock = new SockJS('http://192.168.4.73:4343/ws');

    if (sub) {
      sub.unsubscribe();
      sub = null;
    }

    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    sub = stompClient.subscribe(
      '/topics/unsecured/basket_id/2',
      onMessageReceivedInit,
    );
    console.log('STOMP (73 Kanalı) Connected & Subscribed!');
    setIsRefreshingWs(false);
  };

  const onError = err => {
    console.log(`STOMP (73 Kanalı) Error:${err}`);
    setTimeout(() => {
      RNRestart.Restart();
    }, 2000);
  };

  const onMessageReceivedInit = payload => {
    var payloadData = JSON.parse(payload.body);
    console.log('onMessage init!');

    let data = payloadData.token.replaceAll('"', '');
    const token = decrypt(
      data,
      'aesEncryptionKeyaesEncryptionKey',
      'encryptionIntVec',
    );

    setToken(token);
    _userToken = token;

    const timeRemaining = remainingTime(token, 3);
    tokenTimeout = setTimeout(
      () => {
        setToken(null);
        _userToken = null;
        connectInit();
        console.log('token timeout!!!');
      },
      timeRemaining > 0 ? timeRemaining : 5000,
    );

    if (sub) {
      sub.unsubscribe();
    }

    sub = stompClient.subscribe(
      '/topics/secured/basket_id/2',
      onMessageReceivedMain,
      {
        Authorization: `Bearer ${_userToken}`,
        basketId: 2,
      },
    );

    if (payloadData.shoppingListWithStoreStockStatus) {
      const stockStatus = payloadData.shoppingListWithStoreStockStatus;
      const updatedStockStatus = stockStatus.map(item => ({
        ...item,
        hasEnoughStock: item.hasEnoughStock || false,
      }));

      payloadData.shoppingListWithStoreStockStatus.forEach(item => {
        setIsPersonnel(true);
        setEnoughStock(updatedStockStatus);
        console.log('shoppingListWith >>>> ', item);
        alert('Verified');
      });
    }

    handleIncomingPayload(payloadData, '73-STOMP-Init');
    setIsRefreshingWs(false);
  };

  const onMessageReceivedMain = payload => {
    var payloadData = JSON.parse(payload.body);
    console.log('STOMP Main Payload Verisi', payloadData);

    handleIncomingPayload(payloadData, '73-STOMP-Main');
  };

  const closeSocketConnection = () => {
    if (Sock) {
      Sock.close();
      Sock = null;
    }
    if (rawWsRef.current) {
      rawWsRef.current.close();
    }
  };

  const disconnect = () => {
    if (stompClient) {
      stompClient.disconnect();
    }
  };

  const resetToken = () => {
    setToken(null);
    _userToken = null;
    if (tokenTimeout) {
      clearTimeout(tokenTimeout);
      tokenTimeout = null;
    }
  };

  return (
    <WsContext.Provider
      value={{
        connectInit,
        closeSocketConnection,
        disconnect,
        isPersonnel,
        isPaid,
        setIsPaid,
      }}>
      {children}
    </WsContext.Provider>
  );
};
