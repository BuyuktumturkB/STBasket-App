import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import BackgroundWrapper from '../../context/BackgroundWrapper';
import {useTranslation} from 'react-i18next';
import {useCurrency} from '../../context/CurrencyProvider';
import {useFilter} from '../../context/FilterContext';

const ShoppingDetailModal = ({visible, onClose, shoppingItem}) => {
  const {replaceUnderScoreWithSpace} = useFilter();
  const {t} = useTranslation();
  const {currency} = useCurrency();

  if (!shoppingItem) {
    return null;
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <BackgroundWrapper>
        <View style={styles.modalContent}>
          <Text style={styles.title}>
            {t('shopping_detail') || 'Alışveriş Detayı'}
          </Text>

          <View style={styles.section}>
            <Text style={styles.detailText}>
              {t('sessionID')}: {shoppingItem.sessionId}
            </Text>
            <Text style={styles.detailText}>
              {t('basketID')}: {shoppingItem.basketId}
            </Text>
            <Text style={styles.detailText}>
              {t('date')}: {new Date(shoppingItem.completedAt).toLocaleString()}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.detailText}>
              {t('sum')}: {shoppingItem.totalPrice} {currency.symbol}
            </Text>
          </View>

          <Text style={[styles.detailText, {marginTop: 10}]}>
            {t('products')}
          </Text>

          <ScrollView style={styles.scrollView}>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.headerRow]}>
                <Text style={styles.tableHeader}>{t('product') || 'Ürün'}</Text>
                <Text style={styles.tableHeader}>
                  {t('quantity') || 'Adet'}
                </Text>
                <Text style={styles.tableHeader}>{t('price') || 'Fiyat'}</Text>
                <Text style={styles.tableHeader}>
                  {t('totalPrice' || 'Toplam')}
                </Text>
              </View>

              {shoppingItem.productList.map((product, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>
                    {replaceUnderScoreWithSpace(product.name)}
                  </Text>
                  <Text style={styles.tableCell}>
                    {replaceUnderScoreWithSpace(product.quantity)}
                  </Text>
                  <Text style={styles.tableCell}>
                    {replaceUnderScoreWithSpace(product.unitPrice)}
                    {currency.symbol}
                  </Text>
                  <Text style={styles.tableCell}>
                    {replaceUnderScoreWithSpace(
                      product.unitPrice * product.quantity,
                    )}
                    {currency.symbol}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>{t('close') || 'Kapat'}</Text>
          </TouchableOpacity>
        </View>
      </BackgroundWrapper>
    </Modal>
  );
};

export default ShoppingDetailModal;

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    padding: 20,
    marginTop: 40,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  section: {
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#fff',
    marginVertical: 2,
  },
  scrollView: {
    marginTop: 10,
    maxHeight: '50%',
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  headerRow: {
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  tableHeader: {
    fontWeight: 'bold',
    width: '25%',
    textAlign: 'center',
    color: 'white',
  },
  tableCell: {
    width: '25%',
    textAlign: 'center',
    color: 'white',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
