import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import Video from 'react-native-video';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Appbar from '../Bars/Appbar';
import {useTranslation} from 'react-i18next';
import BackgroundWrapper from '../../context/BackgroundWrapper';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faFrown} from '@fortawesome/free-solid-svg-icons';
import {ThemeContext} from '../../context/ThemeContext'; // Tema contextini unutma

const screenWidth = Dimensions.get('window').width;

function WaitingPayment() {
  const isReset = useSelector(state => state.products.isReset);
  const navigation = useNavigation();
  const {t} = useTranslation();
  const {theme} = useContext(ThemeContext);

  const animationIntervalRef = useRef(null);
  const resetIntervalRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  const [circleStatus, setCircleStatus] = useState([
    false,
    false,
    false,
    false,
  ]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    startPaymentProcess();
    return () => clearAllIntervals();
  }, []);

  useEffect(() => {
    if (isReset) {
      navigation.navigate('PaymentCompleted');
    }
  });

  const clearAllIntervals = () => {
    clearInterval(animationIntervalRef.current);
    clearInterval(resetIntervalRef.current);
    clearInterval(countdownIntervalRef.current);
  };

  const startPaymentProcess = () => {
    clearAllIntervals();
    setTimeLeft(10);
    setCircleStatus([false, false, false, false]);

    animationIntervalRef.current = setInterval(() => {
      setCircleStatus(prevStatus => {
        const nextStatus = [...prevStatus];
        for (let i = 0; i < nextStatus.length; i++) {
          if (!nextStatus[i]) {
            nextStatus[i] = true;
            break;
          }
        }
        return nextStatus;
      });
    }, 1000);

    resetIntervalRef.current = setInterval(() => {
      setCircleStatus([false, false, false, false]);
    }, 5000);

    countdownIntervalRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 0) {
          clearAllIntervals();
          setShowModal(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const handleTryAgain = () => {
    setShowModal(false);
    startPaymentProcess();
  };

  const navigatePaymnetOptions = () => {
    clearAllIntervals();
    setShowModal(false);
    navigation.goBack();
  };

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <BackgroundWrapper>
      <Appbar />
      <View style={styles.mainBox}>
        <Text style={styles.timerText}>
          {t('waitingPayment')} : {formatTime(timeLeft)}
        </Text>

        <View style={styles.videoWrapper}>
          <Video
            style={styles.video}
            repeat
            resizeMode="contain"
            source={require('./PaymentAnimtion.mp4')}
          />
        </View>
      </View>

      <Modal
        visible={showModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowModal(false)}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { backgroundColor: theme.backgroundColor }]}>
              
              <Text style={styles.modalTitle}>{t('paymentFailed')}</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.buttonStyle, styles.tryAgainButton]}
                  onPress={handleTryAgain}>
                  <Text style={styles.buttonText}>{t('tryAgain')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.buttonStyle, styles.changeMethodButton]}
                  onPress={navigatePaymnetOptions}>
                  <Text style={styles.buttonText}>
                    {t('changePaymentMethod')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </BackgroundWrapper>
  );
}

const styles = StyleSheet.create({
  mainBox: {
    alignContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    flexDirection: 'column',
    margin: 50,
    justifyContent: 'center',
    borderRadius: 10,
  },
  timerText: {
    marginTop: 20,
    fontSize: 30,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Coolvetica Rg',
  },
  videoWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 30,
  },
  video: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.3,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalCard: {
    width: '85%',
    maxWidth: 500,
    padding: 24,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 30,
    fontFamily: 'Coolvetica Rg',
    color: '#ff5454ff',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  buttonStyle: {
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  tryAgainButton: {
    backgroundColor: '#b3f8aaff',
  },
  changeMethodButton: {
    backgroundColor: '#75d6f1ff',
  },
  buttonText: {
    color: 'black',
    fontFamily: 'Coolvetica Rg',
    fontSize: 16,
  },
});

export default WaitingPayment;
