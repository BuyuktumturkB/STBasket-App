import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useCurrency} from '../../context/CurrencyProvider';
import {CURRENCIES} from '../../constants/Currencies';
import {useTranslation} from 'react-i18next';

const CurrencyBar = () => {
  const {currency, setCurrency} = useCurrency();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const {t} = useTranslation();

  const handleSelect = selected => {
    setCurrency(selected);
    setDropdownVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setDropdownVisible(!dropdownVisible)}>
        <Text style={styles.label}>{t('currencyLabel', 'Currency')}:</Text>
        <Text style={styles.label}>
          {currency.code} ({currency.symbol})
        </Text>
      </TouchableOpacity>

      {dropdownVisible && (
        <ScrollView style={styles.dropdown}>
          {CURRENCIES.map(item => (
            <TouchableOpacity
              key={item.code}
              onPress={() => handleSelect(item)}
              style={styles.option}>
              <Text style={styles.optionText}>
                {t(`currency.${item.key}`)} ({item.symbol})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default CurrencyBar;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  selector: {
    backgroundColor: 'transparent',
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 5,
  },
  dropdown: {
    borderBlockColor: 'black',
    borderWidth: 1,
    height: 150,
    marginTop: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: '50%',
    borderRadius: 5,
    overflow: 'hidden',
  },
  option: {
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#555',
  },
  optionText: {
    color: 'white',
  },
});
