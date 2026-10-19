import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {View, Image, StyleSheet} from 'react-native';
const AuthanticateImage = () => {
  return (
    <View style={styles.imageStyle}>
      <Image
        style={styles.image}
        source={require('../../assets/images/authanticate.png')}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  imageStyle: {
    justifyContent: 'center',
    width: '25%',
    height: '100%',
  },
  image: {
    height: '95%',
    width: '100%',
  },
});
export default AuthanticateImage;
