import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import ShoppingDetailModal from './ShoppingHistoryDetailModal';
import BackgroundWrapper from '../../context/BackgroundWrapper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { Title } from 'react-native-paper';

const ShoppingHistoryModal = ({ isVisible, onClose }) => {
  const [shoppingList, setShoppingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const { t } = useTranslation();

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  // 15 günden eski verileri temizleme işlemi
  const cleanOldShoppingSessions = async () => {
    try {
      const storedSessions = await AsyncStorage.getItem('shoppingSessions');
      if (storedSessions) {
        const parsedSessions = JSON.parse(storedSessions);
        const now = new Date();
        const filteredSessions = parsedSessions.filter((session) => {
          const sessionDate = new Date(session.completedAt);
          const diffInDays =
            (now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24);
          return diffInDays <= 15;
        });

        // 15 günden eski veriler siliniyor
        await AsyncStorage.setItem(
          'shoppingSessions',
          JSON.stringify(filteredSessions),
        );
      }
    } catch (error) {
      console.log('Silinme Hatası', error);
    }
  };

  // Filtrelemeyi uygulayan fonksiyon
  const applyFilter = (parsedSessions) => {
    const now = new Date();
    let filteredSessions = parsedSessions;

    // Ortak 15 gün kontrolü
    filteredSessions = filteredSessions.filter((session) => {
      const sessionDate = new Date(session.completedAt);
      const diffInDays =
        (now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24);
      return diffInDays <= 15;
    });

    // Filtreye göre veriyi süz
    if (filter === 'today') {
      filteredSessions = filteredSessions.filter((session) => {
        const sessionDate = new Date(session.completedAt);
        return sessionDate.toDateString() === now.toDateString();
      });
    } else if (filter === 'yesterday') {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      filteredSessions = filteredSessions.filter((session) => {
        const sessionDate = new Date(session.completedAt);
        return sessionDate.toDateString() === yesterday.toDateString();
      });
    } else if (filter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      filteredSessions = filteredSessions.filter((session) => {
        const sessionDate = new Date(session.completedAt);
        return sessionDate >= weekAgo && sessionDate <= now;
      });
    }

    setShoppingList(filteredSessions);
  };

  useEffect(() => {
    const fetchShoppingSessions = async () => {
      setLoading(true);
      try {
        const storedSessions = await AsyncStorage.getItem('shoppingSessions');
        if (storedSessions) {
          const parsedSessions = JSON.parse(storedSessions);

          // Uygulanan filtreyi veri üzerine uygula
          applyFilter(parsedSessions);
        } else {
          setShoppingList([]);
        }
      } catch (error) {
        console.log('Alışveriş geçmişi yüklenirken hata:', error);
        setShoppingList([]);
      } finally {
        setLoading(false);
      }
    };

    if (isVisible) {
      fetchShoppingSessions();
      
      // Sadece ilk açılışta 15 günden eski verileri temizle
      cleanOldShoppingSessions();
    }
  }, [isVisible, filter]);

  const openDetailModal = (item) => {
    setSelectedItem(item);
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={false}>
      <BackgroundWrapper>
        <View style={styles.modalContent}>
          <View style={styles.filterStyle}>
            <TouchableOpacity onPress={() => handleFilterChange('today')}>
              <Title style={styles.filterTextStyle}>{t('today')}</Title>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleFilterChange('yesterday')}>
              <Title style={styles.filterTextStyle}>{t('yesterday')}</Title>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleFilterChange('week')}>
              <Title style={styles.filterTextStyle}>{t('week')}</Title>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleFilterChange('all')}>
              <Title style={styles.filterTextStyle}>{t('all')}</Title>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>{t('shoppingHistory')}</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <ScrollView>
              {shoppingList.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => openDetailModal(item)}>
                  <View style={styles.item}>
                    <Text style={styles.date}>
                      {new Date(item.completedAt).toLocaleString()}
                    </Text>
                    <Text style={styles.price}>{item.totalPrice} ₺</Text>
                    <Text style={styles.sessionInfo}>
                      {t('sessionID')}: {item.sessionId} | {t('date')}:{' '}
                      {item.sessionDate} | {t('time')}: {item.sessionTime}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>{t('close')}</Text>
          </TouchableOpacity>
        </View>

        {selectedItem && (
          <ShoppingDetailModal
            visible={!!selectedItem}
            onClose={() => setSelectedItem(null)}
            shoppingItem={selectedItem}
          />
        )}
      </BackgroundWrapper>
    </Modal>
  );
};

export default ShoppingHistoryModal;

const styles = StyleSheet.create({
  modalContent: {
    width: '85%',
    height: '80%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    padding: 20,
  },
  filterStyle: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  filterTextStyle: {
    color: 'white',
  },
  title: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  date: {
    fontSize: 16,
    color: 'white',
  },
  price: {
    fontSize: 16,
    color: 'lightgreen',
  },
  sessionInfo: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 5,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
