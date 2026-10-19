import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import {Text, TextInput} from 'react-native-paper';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faClose,
  faArrowRight,
  faMicrophone,
} from '@fortawesome/free-solid-svg-icons';
import BackgroundWrapper from '../context/BackgroundWrapper';

const MessagesScreen = ({isVisible, onClose}) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [socket, setSocket] = useState(null);

  const [username] = useState('Ali');
  const [room] = useState('genel');
  const scrollViewRef = useRef();

  useEffect(() => {
    const socketConnection = new WebSocket('ws://192.168.4.87:5000/chat');
    setSocket(socketConnection);

    socketConnection.onopen = () => {
      console.log('WebSocket bağlantısı kuruldu.');
      const joinMessage = JSON.stringify({
        type: 'join',
        username,
        room: room,
      });
      socketConnection.send(joinMessage);
    };

    socketConnection.onmessage = event => {
      try {
        const receivedMessage = JSON.parse(event.data);
        console.log('Mesaj alındı:', receivedMessage);
        setChatHistory(prev => [...prev, receivedMessage]);
      } catch (err) {
        console.error('JSON parse hatası:', err);
      }
    };

    socketConnection.onclose = event => {
      console.log('WebSocket bağlantısı kapandı:', event);
    };

    socketConnection.onerror = error => {
      console.error('Web Soket Hatası', error);
    };
    return () => {
      socketConnection.close();
    };
  }, []);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({animated: true});
    }
  }, [chatHistory]);

  const sendMessage = () => {
    if (socket && message.trim() !== '') {
      const chatMessage = JSON.stringify({
        type: 'message',
        from: username,
        room: room,
        text: message,
      });
      socket.send(chatMessage);
      setMessage('');
    }
  };

  return (
    <Modal transparent={false} visible={isVisible}>
      <BackgroundWrapper>
        <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
          <TouchableOpacity onPress={onClose}>
            <FontAwesomeIcon icon={faClose} color="red" size={50} />
          </TouchableOpacity>

          <View style={styles.containerStyle}>
            <View style={styles.rightContentStyle}>
              <View style={styles.messageField}>
                <ScrollView
                  ref={scrollViewRef}
                  contentContainerStyle={{padding: 10}}
                  onContentSizeChange={() =>
                    scrollViewRef.current?.scrollToEnd({animated: true})
                  }>
                  {chatHistory.map((item, index) => (
                    <View
                      key={index}
                      style={
                        item.from === username
                          ? styles.userMessage
                          : styles.receivedMessage
                      }>
                      <Text
                        style={{
                          color: item.from === username ? 'white' : 'black',
                        }}>
                        {item.text}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.inputRow}>
                <TextInput
                  value={message}
                  placeholder="Mesajınızı Yazın"
                  style={styles.inputStyle}
                  label="Mesaj"
                  onChangeText={setMessage}
                />

                <TouchableOpacity
                  onPress={sendMessage}
                  style={styles.buttonStyle}>
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    size={25}
                    color="white"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPressIn={() => console.log('Dinleme başlat')}
                  onPressOut={() => console.log('Dinleme durdur')}
                  style={styles.buttonStyle}>
                  <FontAwesomeIcon
                    icon={faMicrophone}
                    size={25}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </BackgroundWrapper>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backgroundStyle: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '10%',
    height: '80%',
    width: '80%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
  },
  rightContentStyle: {
    flex: 1,
    padding: 10,
  },
  messageField: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e5e5e5',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  inputStyle: {
    flex: 1,
    backgroundColor: 'white',
    marginRight: 10,
  },
  buttonStyle: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 25,
  },
});

export default MessagesScreen;
