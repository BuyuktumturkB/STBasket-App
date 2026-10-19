import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemeContext } from './ThemeContext';

const BackgroundWrapper = ({ children, style }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BackgroundWrapper;
