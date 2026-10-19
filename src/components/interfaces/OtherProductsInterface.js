import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {updateBasket} from '../../Redux/slicers/ProductListSlice';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import {TextInput} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {ThemeContext} from '../../context/ThemeContext';

const OthersInterface = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const {theme} = useContext(ThemeContext);
  const {t} = useTranslation();
  const [pageNumber, setPageNumber] = useState(0);
  const [isbarcodeVisible, setBarcode] = useState(false);
  const currentProducts = useSelector(state => state.products.ProductList);

  const API_URL = `http://192.168.4.88:4343/api/v1/stock/all?page=${pageNumber}&search=${searchQuery}`;
  // API data fetching
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(json => {
        console.log('API Verisi:', json);
        setProducts(json.content); // Backend'den gelen veriyi kaydet
        setLoading(false);
      })
      .catch(error => {
        console.error('API Fetch Error:', error);
        setLoading(false);
      });
  }, [API_URL]);

  if (loading) {
    return <Text>{t('loading')}</Text>;
  }

  const pageNext = () => {
    setPageNumber(prevPageNumber => prevPageNumber + 1);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleProductPress = product => {
    setSelectedProduct(product);
    setModalVisible(true);
    setBarcode(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setQuantity(1);
  };

  const increaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  const handleAddProduct = () => {
    const updatedProducts = [...currentProducts];
    const index = updatedProducts.findIndex(p => p.id === selectedProduct.id);

    const price = Number(selectedProduct.unitPrice);

    if (index >= 0) {
      const existingProduct = updatedProducts[index];
      const newQuantity = existingProduct.quantity + quantity;

      updatedProducts[index] = {
        ...existingProduct,
        quantity: newQuantity,
        totalPrice: newQuantity * existingProduct.unitPrice,
      };
    } else {
      updatedProducts.push({
        id: selectedProduct.id,
        name: selectedProduct.name,
        unitPrice: price,
        quantity: quantity,
        totalPrice: price * quantity,
      });
    }

    // 🔥 garanti için normalize
    const normalizedProducts = updatedProducts.map(p => ({
      ...p,
      totalPrice: p.unitPrice * p.quantity,
    }));

    dispatch(updateBasket({productsList: normalizedProducts}));

    closeModal();
  };

  return (
    <View style={styles.container}>
      <TextInput
        left={<FontAwesomeIcon icon={faMagnifyingGlass} />}
        style={[
          styles.searchInput,
          {backgroundColor: theme.inputBackground, color: theme.textColor},
        ]}
        textColor={theme.textColor}
        placeholderTextColor={theme.textColor}
        placeholder={t('searchProduct')}
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
      />

      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id.toString()}
        numColumns={5}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => handleProductPress(item)}
            style={[
              styles.productContainer,
              {backgroundColor: theme.cardBackground},
            ]}>
            <View style={styles.productDetails}>
              <Text style={[styles.productTitle, {color: theme.textColor}]}>
                {item.name}
              </Text>
              <Text style={[styles.productCategory, {color: theme.textColor}]}>
                {' '}
                {t('category')}: {item.category}
              </Text>
              <Text style={[styles.productPrice, {color: theme.textColor}]}>
                {' '}
                {t('price')}: ${item.unitPrice}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Modal for Electronics Category */}
      <Modal
        visible={modalVisible}
        onRequestClose={closeModal}
        transparent={true}>
        <View style={styles.modalBackground}>
          <View
            style={[
              styles.modalContainer,
              {backgroundColor: theme.cardBackground},
            ]}>
            <Text style={[styles.modalTitle, {color: theme.textColor}]}>
              {selectedProduct?.name}
            </Text>
            <Text style={[styles.modalText, {color: theme.textColor}]}>
              Kaç tane almak istersiniz?
            </Text>
            <View style={styles.quantityContainer}>
              {/* Decrease button (left triangle) */}
              <TouchableOpacity
                onPress={decreaseQuantity}
                style={styles.decreaseButton}>
                <Text style={[styles.buttonText, {color: theme.textColor}]}>
                  -
                </Text>
              </TouchableOpacity>
              <Text style={[styles.quantityText, {color: theme.textColor}]}>
                {quantity}
              </Text>
              {/* Increase button (right triangle) */}
              <TouchableOpacity
                onPress={increaseQuantity}
                style={styles.increaseButton}>
                <Text style={[styles.buttonText, {color: theme.textColor}]}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.totalPriceText, {color: theme.textColor}]}>
              Total: ${(selectedProduct?.unitPrice * quantity).toFixed(2)}
            </Text>

            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                onPress={handleAddProduct}
                style={styles.addButton}>
                <Text style={styles.addButtonText}>{t('add')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>{t('close')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: 'transparent',
  },
  searchInput: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginTop: '-2%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    fontSize: 16,
    borderRadius: 5,
    color: '#585858',
  },
  productContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    marginLeft: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  productDetails: {
    alignItems: 'center',
  },
  productTitle: {
    color: '#585858',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  productCategory: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
  },
  productPrice: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '50%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#585858',
  },
  modalText: {
    color: '#585858',
    fontSize: 20,
    marginBottom: 20,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  decreaseButton: {
    width: 0,
    height: 0,
    borderRightWidth: 30,
    borderLeftWidth: 30,
    borderTopWidth: 50,
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    borderTopColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{rotate: '90deg'}],
  },
  increaseButton: {
    width: 0,
    height: 0,
    borderLeftWidth: 30,
    borderRightWidth: 30,
    borderTopWidth: 50,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{rotate: '270deg'}],
  },
  buttonText: {
    fontSize: 20,
    color: '#585858',
  },
  quantityText: {
    color: 'black',
    fontSize: 18,
    marginHorizontal: 20,
  },
  totalPriceText: {
    fontSize: 16,
    color: 'black',
    marginBottom: 10,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    fontSize: 16,
    color: 'white',
  },
  closeButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
    color: 'white',
  },
});

export default OthersInterface;
