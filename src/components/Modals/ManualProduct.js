import React from 'react';
import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {useTranslation} from 'react-i18next';

const ManualProduct = ({isVisible, onClose, onUseBarcode, OnUseOthers}) => {
  const {t} = useTranslation();

  return (
    <Modal visible={isVisible} transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.contentContainer}>
              <TouchableOpacity onPress={onUseBarcode} style={styles.cardStyle}>
                <Text style={styles.cardText}>{t('useBarcode')}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={OnUseOthers} style={styles.cardStyle}>
                <Text style={styles.cardText}>{t('otherProducts')}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.buttonStyle} onPress={onClose}>
                <Text style={styles.buttonText}>{t('close')}</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,

    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: '50%',
    padding: 30,
    backgroundColor: '#808080',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  cardStyle: {
    width: '100%',
    backgroundColor: '#585858',
    paddingVertical: 16,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  cardText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Coolvetica Rg',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#ff4a4aff',
    borderRadius: 10,
  },
  closeButtonLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Coolvetica Rg',
  },
  buttonStyle: {
    backgroundColor: '#ff4a4a',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontFamily: 'Coolvetica Rg',
  },
});

export default ManualProduct;
