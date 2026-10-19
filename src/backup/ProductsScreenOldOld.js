import {StyleSheet, ScrollView, View} from 'react-native';
import React, {Fragment, useContext, useEffect, useState} from 'react';
import {TokenContext} from '../../context/TokenContext';
import {
  Text,
  ListItem,
  Avatar,
  Icon,
  Badge,
  ListItemProps,
  Button,
  Switch,
  Card,
  lightColors,
  PricingCard,
} from '@rneui/themed';
import {useSelector} from 'react-redux';
import {calculateInfo} from '../../Redux/slicers/ProductListSlice';

const ProductsScreen = () => {
  const {userToken} = useContext(TokenContext);
  const products = useSelector(state => state.products.ProductList);
  const [expanded, setExpanded] = useState(
    Object.keys(products).map((products, idx) => false),
  );
  const [info, setInfo] = useState({
    totalPrice: 0,
    totalQuantity: 0,
    numOfCategories: 0,
  });

  useEffect(() => {
    setInfo(calculateInfo(products));
  }, []);

  return (
    <ScrollView style={styles.list}>
      {Object.entries(products).map(([category_name, category], cat_idx) => (
        <Fragment key={cat_idx}>
          <ListItem.Accordion
            content={
              <>
                <Icon name="shopping-basket" size={30} />
                <ListItem.Content>
                  <ListItem.Title>
                    {category_name.charAt(0).toUpperCase() +
                      category_name.slice(1)}
                  </ListItem.Title>
                </ListItem.Content>
              </>
            }
            icon={<Icon name="arrow-drop-down" size={30} />}
            expandIcon={<Icon name="arrow-drop-down" size={30} />}
            isExpanded={expanded[cat_idx]}
            onPress={() => {
              const newArr = [...expanded];
              newArr[cat_idx] = !expanded[cat_idx];
              console.log(cat_idx);
              console.log(newArr);
              console.log(expanded[cat_idx]);
              setExpanded(newArr);
              // setExpanded(Object.assign([], expanded, {cat_idx: !expanded[cat_idx]}));
            }}>
            {Object.entries(category).map(([product_id, product], i) => (
              <ListItem key={i}>
                {/* <Icon name="user-circle-o" type="font-awesome" color="red" /> */}
                {/* <Avatar rounded source={{uri: l.avatar_url}} /> */}
                <ListItem.Content>
                  <ListItem.Title style={{color: 'red'}}>
                    {product.name}
                  </ListItem.Title>
                  <ListItem.Subtitle>
                    Birim fiyatı: {product.unitPrice}₺
                  </ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Content right>
                  <ListItem.Subtitle right>
                    {product.quantity} adet
                  </ListItem.Subtitle>
                  <ListItem.Title right style={{color: 'green'}}>
                    {product.unitPrice * product.quantity}₺
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
            ))}
          </ListItem.Accordion>
        </Fragment>
      ))}
      <PricingCard
        color={lightColors.primary}
        title="Sepet Tutarı"
        price={info.totalPrice + '₺'}
        info={[`${info.numOfCategories} Kategori, ${info.totalQuantity} Ürün`]}
        button={{title: ' GET STARTED', icon: 'flight-takeoff'}}
      />
    </ScrollView>
  );
};

export default ProductsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: lightColors.greyOutline,
  },
  subtitleView: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 5,
  },
  ratingImage: {
    height: 19.21,
    width: 100,
  },
  ratingText: {
    paddingLeft: 10,
    color: 'grey',
  },
});
