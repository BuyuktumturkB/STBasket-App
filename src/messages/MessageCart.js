import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Title, Text, Avatar} from 'react-native-paper';
const MessageCart = ({userName, userImage, message}) => {
  return (
    <TouchableOpacity>
      <Avatar.Image source={userImage} size={30} />
      <View>
        <Title> {userName} </Title>
        <Text> {message}</Text>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  contentStyle: {
    flexDirection: 'row',
    display: 'flex',
  },
  rightContent: {
    flexDirection: 'column',
    display: 'flex',
  },
});
