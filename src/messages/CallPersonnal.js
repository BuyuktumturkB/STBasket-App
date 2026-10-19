import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Title } from 'react-native-paper';
import BackgroundWrapper from '../context/BackgroundWrapper';
import { useTranslation } from 'react-i18next';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video';

const CallPersonnel = ({ isVisible, onClose }) => {
  const [socket, setSocket] = useState(null);
  const fixedMessage = 'yardım çağrısı';
  const { t } = useTranslation();

  useEffect(() => {
    const ws = new WebSocket('ws://192.168.4.87:5000/call');

    ws.onopen = () => {
      console.log('WebSocket bağlantısı kuruldu');
      setSocket(ws);
    };

    ws.onmessage = e => {
      console.log('Sunucudan gelen mesaj:', e.data);
    };

    ws.onerror = e => {
      console.log('WebSocket hatası:', e.message);
    };

    ws.onclose = () => {
      console.log('WebSocket bağlantısı kapandı');
    };

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const sendCall = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ userId: '1234', message: fixedMessage }));
      console.log('Sabit mesaj gönderildi:', fixedMessage);
      Alert.alert(t('Request Sent'));
      onClose();
    } else {
      Alert.alert(t('WebSocket connection failed'));
    }
  };

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <BackgroundWrapper>
        <View style={styles.centeredWrapper}>
          <View style={styles.modalContent}>
            <Title style={styles.titleStyle}>{t('do you need support?')}</Title>

            <View style={styles.videoWrapper}>
              <Video
                source={require('../components/interfaces/Contact.mp4')}
                style={styles.video}
                repeat
                resizeMode="contain"
                muted
              />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={sendCall} style={styles.sendButton}>
                <MaterialIcons name="support-agent" size={28} color="white" style={styles.icon} />
                <Text style={styles.sendButtonText}>{t('call')}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BackgroundWrapper>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: 200,
    paddingVertical: 60,
    borderRadius: 24,
    alignItems: 'center',
    elevation: 10,
  },
  titleStyle: {
    color: '#8fffd8',
    fontFamily: 'Coolvetica Rg',
    fontSize: 26,
    marginBottom: 30,
    textAlign: 'center',
  },
  videoWrapper: {
    width: 250,
    height: 250,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 30,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 15,
  },
  sendButton: {
    backgroundColor: '#5cae59ff',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginRight:50
  },
  icon: {
    marginRight: 10,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Coolvetica Rg',
  },
  cancelButton: {
    borderColor: '#aaa',
    backgroundColor: '#a3a3a3ff',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 18,
    fontFamily: 'Coolvetica Rg',
  },
});

export default CallPersonnel;
