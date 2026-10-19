import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Subtitle = ({ text }) => {
  return (
    <View style={styles.subtitleContainer}>
      <Text style={styles.subtitleText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  subtitleContainer: {
    position: 'absolute',
    bottom: '18%',
    left: '10%',
    width: '80%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  subtitleText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Subtitle;
