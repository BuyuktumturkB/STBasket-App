import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import ChatBot from './ChatBot';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faClose} from '@fortawesome/free-solid-svg-icons';
const ChatBotModal = ({isVisible, onClose}) => {
  return (
    <Modal onRequestClose={onClose} visible={isVisible} transparent={false}>
      <ImageBackground
        style={styles.backgroundStyle}
        source={require('../../assets/images/shoppingcartbackground.jpeg')}>
        <TouchableOpacity onPress={onClose}>
          <FontAwesomeIcon icon={faClose} color="red" size={45} />
        </TouchableOpacity>
        <View style={styles.containerStyle}>
          <ChatBot />
        </View>
      </ImageBackground>
    </Modal>
  );
};
export default ChatBotModal;

const styles = StyleSheet.create({
  backgroundStyle: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerStyle: {
    height: '80%',
    width: '60%',
    borderStartColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  closeStyle: {
    height: 100,
    width: 100,
  },
  closeButtonStyle: {
    width: '100%',
    height: '100%',
  },
});
