import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, StyleSheet, Text, View, SafeAreaView} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Divider, Title} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {WsContext} from '../../context/WsContext';
import {useFilter} from '../../context/FilterContext';

const ShoppingPlan = () => {
  const {t} = useTranslation();
  const {replaceUnderScoreWithSpace} = useFilter();
  const {isPersonnel} = useContext(WsContext);
  const [checkedItems, setCheckedItems] = useState({});

  const shoppingItems = useSelector(state => state.planList.planListItems);
  const personnelShoppingItems = useSelector(
    state => state.shoppingListWithStoreStock.ShoppingListWithStoreStockItems,
  );

  useEffect(() => {
    console.log('Shopping items updated:', shoppingItems);
  }, [shoppingItems]);

  const handleCheck = id => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <SafeAreaView style={styles.fullScreenBackground}>
      <Title style={styles.titleStyle}>{t('shoppingList')}</Title>
      <Divider style={styles.dividerStyle} />
      {isPersonnel && (
        <View style={styles.isPersonnelStyle}>
          <Text style={{width: '45%', fontSize: 15, color: '#7BCF7A'}}>
            {t('product')}
          </Text>
          <Text style={{width: '20%', fontSize: 15, color: '#7BCF7A'}}>
            {t('requestedQuantity')}
          </Text>
          <Text style={{width: '20%', fontSize: 15, color: '#7BCF7A'}}>
            {t('availableQuantity')}
          </Text>
        </View>
      )}
      {!isPersonnel && (
        <View style={styles.isPersonnelStyle}>
          <Text style={{width: '45%', fontSize: 15, color: '#7BCF7A'}}>
            {t('product')}
          </Text>
          <Text style={{width: '20%', fontSize: 15, color: '#7BCF7A'}}>
            {t('quantity')}
          </Text>
        </View>
      )}
      <ScrollView>
        {isPersonnel === false &&
          shoppingItems.map(item => (
            <View key={item.id} style={styles.itemContainer}>
              <TouchableOpacity
                style={[
                  styles.circle,
                  checkedItems[item.id] && styles.checkedCircle,
                ]}
                onPress={() => handleCheck(item.id)}>
                {checkedItems[item.id] && (
                  <Text style={styles.checkmark}>✔</Text>
                )}
              </TouchableOpacity>
              <Text
                style={[
                  styles.itemText,
                  checkedItems[item.id] && styles.strikethrough,
                ]}>
                {item.name} - Quantity: {item.quantity}
              </Text>
            </View>
          ))}
        {isPersonnel &&
          personnelShoppingItems.map(item => (
            <View key={item.stockId} style={styles.itemContainer}>
              <TouchableOpacity
                style={[
                  styles.circle,
                  checkedItems[item.stockId] && styles.checkedCircle,
                ]}
                onPress={() => handleCheck(item.stockId)}>
                {checkedItems[item.stockId] && (
                  <Text style={{fontSize: 7}}>✔</Text>
                )}
              </TouchableOpacity>
              <Text
                style={[
                  styles.itemText,
                  checkedItems[item.stockId] && styles.strikethrough,
                  !item.hasEnoughStock && styles.strikethrough, // 👈 burada kontrol
                ]}>
                {replaceUnderScoreWithSpace(item.name)}
              </Text>
              <View style={styles.itemContainer}>
                <Text style={{fontSize: 20}}>{item.availableQuantity}</Text>
                <Text style={styles.itemText}>{item.requestedQuantity}</Text>
              </View>
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ShoppingPlan;

const styles = StyleSheet.create({
  fullScreenBackground: {
    flex: 1,
    backgroundColor: 'transparent', // koyu gri
  },
  container: {
    flex: 1,
    padding: 10,
  },
  titleStyle: {
    marginTop: '5%',
    width: '100%',
    height: '10%',
    color: 'white',
    justifyContent: 'center',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Coolvetica Rg',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemText: {
    color: '#7BCF7A',
    fontSize: 15,
    paddingLeft: 10,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: '#7BCF7A',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#7BCF7A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkedCircle: {
    backgroundColor: '#7BCF7A',
  },
  checkmark: {
    fontSize: 12,
    color: '#1D1D1D',
  },
  dividerStyle: {
    height: 2,
    backgroundColor: '#7BCF7A',
    marginBottom: 20,
  },
  isPersonnelStyle: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
});
