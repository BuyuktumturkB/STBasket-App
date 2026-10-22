import React, {useContext, useState} from 'react';
import {
  TouchableOpacity,
  Modal,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {ThemeContext} from '../../context/ThemeContext'; // Tema Context'i import edildi

const {width} = Dimensions.get('window');

const DownloadModal = () => {
  const qrLink = "https://play.google.com/store/apps/details?id=com.selftechnology.selfpark";
  const [isVisible, setVisible] = useState(false);
  
  // Tema bilgisi çekildi
  const {theme} = useContext(ThemeContext);

  const showDownloadModal = () => {
    setVisible(true);
  };

  const qrSize = width * 0.10;

  return (
    <View>
      <TouchableOpacity onPress={showDownloadModal}>
        {/* Buton yazısı QRScreen'deki footer gibi temaya uyarlı hale getirilebilir veya mavi kalabilir */}
        <Text style={[styles.buttonText, {color: theme.textColor}]}>Be Member</Text>
      </TouchableOpacity>

      <Modal visible={isVisible} transparent={false} animationType="slide">
        <View style={styles.modalOverlay}>
          {/* Modal içeriğinin arka planı ve rengi temaya göre ayarlandı */}
          <View style={[
            styles.modalContent, 
            {backgroundColor: theme.isDark ? '#222' : 'white'}
          ]}>
            <Text style={[styles.modalText, {color: theme.textColor}]}>
              Scan QR to Download App
            </Text>
            
            <View style={styles.qrDownloadStyle}>
              {/* Koyu temada QR kodun arka planı beyaz kalırsa okutması daha kolay olur */}
              <QRCode value={qrLink} size={qrSize} backgroundColor="white" color="black" />
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 1)',
  },
  modalContent: {
    width: '80%',
    height: '50%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ff5252',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  qrDownloadStyle: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white', // QR kodun arkası her zaman okunaklı olması için beyaz tutuldu
    borderRadius: 8,
  },
});

export default DownloadModal;