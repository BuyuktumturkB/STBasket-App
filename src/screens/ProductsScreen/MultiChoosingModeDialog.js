import {StyleSheet, View} from 'react-native';
import React, {useContext} from 'react';
import {Text, ListItem, Avatar, Dialog, Button} from '@rneui/themed';
import {useDispatch} from 'react-redux';
import {resetMultiChoosingMode} from '../../Redux/slicers/ProductListSlice';
import {useTranslation} from 'react-i18next';

const MultiChoosingModeDialog = ({
  visible,
  options,
  onPressItem,
  onPressOther,
}) => {
  const {t} = useContext(useTranslation());
  const dispatch = useDispatch();

  const toggleDialog = () => {
    console.log('toggle dialog');
  };

  return (
    <Dialog isVisible={visible}>
      {console.log(visible)}

      <Dialog.Title title={t('product_selection')} />
      {/* <Button onPress={() => dispatch(resetMultiChoosingMode())}>X</Button> */}
      {options.map((l, i) => (
        <ListItem
          onPress={() => onPressItem(l)}
          key={i}
          containerStyle={{
            marginHorizontal: -10,
            borderRadius: 8,
          }}>
          <Avatar />
          <ListItem.Content>
            <ListItem.Title style={{fontWeight: '700'}}>
              {l.name}
            </ListItem.Title>
            {/* <ListItem.Subtitle>Olasılık: {l.probability}</ListItem.Subtitle> */}
            <ListItem.Subtitle>
              {t('unitPrice')}: {l.unitPrice}
            </ListItem.Subtitle>
            <ListItem.Subtitle>
              {t('product_weight')}: {l.weight}
            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      ))}
      <Button onPress={onPressOther}>{t('other')}</Button>
    </Dialog>
  );
};

export default MultiChoosingModeDialog;

const styles = StyleSheet.create({});
