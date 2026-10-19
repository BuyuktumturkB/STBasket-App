import {View, Text} from 'react-native';
import React, {useState, useEffect} from 'react';
import SockJS from 'sockjs-client';
import {over} from 'stompjs';
import {TokenContext} from '../context/TokenContext';
import {useContext} from 'react';
import jwt_decode from 'jwt-decode';
import connectInit from '../ws/InitWs';

// var stompClient = null;
// let Sock = null;
const TestScreen = () => {
  console.log(`time: ${new Date().getTime()}`);
  const {userToken, setToken} = useContext(TokenContext);

  const remainingTime = (token, thres_in_sec = 0) => {
    return (
      jwt_decode(token).exp * 1000 - new Date().getTime() - thres_in_sec * 1000
    );
  };

  // const setMainWs = () => {
  //   Sock = new SockJS(
  //     'http://10.0.2.2:8082/ws/secured?token=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqYXZhaW51c2UiLCJleHAiOjE2NjI2NzAyMDEsImlhdCI6MTY2MjYzNDIwMX0.zOsIBOPEWS1pjhPB05Qsh6dB4CC-Q2XVgJzmcm6biN0',
  //   );

  //   stompClient = over(Sock);
  //   stompClient.connect({}, onConnectedMain, onErrorMain);
  // };

  // const onConnectedMain = () => {
  //   stompClient.subscribe('/main_test/DORITOSTACO', () => {
  //     console.log('message received to main!');
  //   });
  //   console.log('on connected main!');
  // };

  // const onErrorMain = err => {
  //   console.log(`errorMain:${err}`);
  // };

  // const connect = () => {
  //   Sock = new SockJS(
  //     // 'http://10.0.2.2:8082/ws/secured?token=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqYXZhaW51c2UiLCJleHAiOjE2NjI2NzAyMDEsImlhdCI6MTY2MjYzNDIwMX0.zOsIBOPEWS1pjhPB05Qsh6dB4CC-Q2XVgJzmcm6biN0',
  //     'http://10.0.2.2:8343/ws/unsecured');

  //   stompClient = over(Sock);
  //   stompClient.connect({}, onConnected, onError);
  // };

  // const onConnected = () => {
  //   stompClient.subscribe('/get_token/DORITOSTACO', onMessageReceived);
  //   console.log('on connected!');
  // };

  // const onError = err => {
  //   console.log(`error:${err}`);
  // };

  const [msg, setMsg] = useState(null);
  // const onMessageReceived = payload => {
  //   var payloadData = JSON.parse(payload.body);
  //   setTimeout(() => {
  //     setToken(null);
  //     console.log('timeout!!!');
  //   }, remainingTime(payloadData.token, 3));
  //   console.log(`payloadToken: ${payloadData.token}`);
  //   setToken(payloadData.token);
  //   Sock.close();
  //   setMainWs();
  // };

  useEffect(() => {
    if (!userToken) {
      // connect();
      connectInit(setToken);
    }
  }, []);

  return (
    <View>
      {/* {!userToken ? <InitWs/> : <></>} */}
      {/* {console.error(`msg: ${msg}`)} */}
      <Text>TestScreen</Text>
      {msg ? <Text>MSG: {JSON.stringify(msg)}</Text> : <Text>no msg</Text>}
      {userToken ? (
        <Text>Token: {JSON.stringify(userToken)}</Text>
      ) : (
        <Text>no token</Text>
      )}
      {/* <ReadQRScreen /> */}
    </View>
  );
};

export default TestScreen;
