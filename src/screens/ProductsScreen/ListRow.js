import { Avatar, ListItem } from '@rneui/themed';
import React, { Fragment, useContext, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import BarcodeModal from '../../components/Modals/BarcodeModal';
import { TokenContext } from '../../context/TokenContext';
import { removeProduct } from '../../Redux/actions/productActions';
import EditWarning from '../../components/errors/EditProduct';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../../context/CurrencyProvider';

const formatProductName = productName => {
  return productName
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const ListRow = ({ product, idx }) => {
  const isRemoved = product.isRemoved;
  const [isBarcodeVisible, setBarcodeVisible] = useState(false);
  const [isWarningVisible, setEditWarning] = useState(false);
  const { userToken, basketId } = useContext(TokenContext);
  const { t } = useTranslation();
  const { currency } = useCurrency();
  const dispatch = useDispatch();

  const optionListItems = useSelector(
    state => state.optionList.optionListItems,
  );

  const showWarning = () => {
    setEditWarning(true);
  };

  const closeWarning = () => {
    setEditWarning(false);
  };

  const confirmEdit = () => {
    closeWarning();
    handleEditAndOpenBarcode();
  };

  const handleEdit = () => {
    if (!optionListItems || optionListItems.length === 0) {
      console.error('optionListItems boş veya undefined!');
      return false;
    }

    const selectedOption = optionListItems.find(
      option => option.name === product.name,
    );

    if (selectedOption) {
      const weight = selectedOption.weight;
      dispatch(removeProduct(product.name, weight, basketId, userToken));
    } else {
      console.error('Ürün optionsList içinde bulunamadı.');
    }
  };

  const openBarcode = () => {
    setBarcodeVisible(true);
  };

  const handleEditAndOpenBarcode = async () => {
    try {
      const isProductRemoved = await handleEdit();
      if (!isProductRemoved) {
        openBarcode();
      }
      await handleEdit();
    } catch (error) {
      console.error('Ürün kaldırma hatası:', error);
    }
  };

  return (
    <Fragment key={idx}>
      <ListItem
        key={idx}
        bottomDivider
        containerStyle={{ backgroundColor: 'transparent' }}>
        <Avatar
          source={{
            uri: product.imageUri
              ? product.imageUri
              : 'https://img.lovepik.com/free-png/20220108/lovepik-egg-milk-products-png-image_401261912_wh300.png',
          }}
          style={styles.tinyLogo}
        />
        <ListItem.Content>
          <ListItem.Title
            style={{
              color: 'white',
              fontFamily:'Coolvetica Rg',
              fontSize:20,
              textDecorationLine: isRemoved ? 'line-through' : 'none',
            }}>
            {formatProductName(product.name)}
          </ListItem.Title>
          <ListItem.Subtitle style={{ color: 'white',fontFamily:'Coolvetica Rg', marginTop:10 }}>
            {t('unitPrice')}: {product.unitPrice} {currency.symbol}
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Content />
        <ListItem.Content right>
          <ListItem.Subtitle style={styles.quantityText}>
            {t('quantity')}: {product.quantity}
          </ListItem.Subtitle>
          <ListItem.Title style={styles.listItemTitleStyle}>
            {product.totalPrice} {currency.symbol}
          </ListItem.Title>
          <TouchableOpacity style={styles.buttonStyle} onPress={showWarning}>
            <Text style={styles.buttonTextStyle}> {t('edit')} </Text>
          </TouchableOpacity>
        </ListItem.Content>
      </ListItem>

      <BarcodeModal
        isVisible={isBarcodeVisible}
        onClose={() => setBarcodeVisible(false)}
      />
      <EditWarning
        isVisible={isWarningVisible}
        onAccept={confirmEdit}
        onClose={closeWarning}
      />
    </Fragment>
  );
};

export default ListRow;

const styles = StyleSheet.create({
  tinyLogo: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffffff33',
    marginRight: 10,
  },
  quantityText: {
    color: 'white',
    fontFamily: 'Coolvetica Rg',
    fontSize: 12,
    marginRight: '30%',
    marginTop: 6,
  },
  listItemTitleStyle: {
    color: 'white',
    fontFamily: 'Coolvetica Rg',
    fontSize: 20,
    
    textAlign: 'right',
    marginRight: '20%',
    marginTop: 4,
  },
  buttonStyle: {
    backgroundColor: '#4fc3f7',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth:120,
    maxHeight:40

  },
  buttonTextStyle: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Coolvetica Rg',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});
