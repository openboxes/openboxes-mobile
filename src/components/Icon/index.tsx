import React from 'react';
import { TouchableOpacity } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Props, Name } from './types';

export default function Icon({ name, size, color, onPress }: Props) {
  let content;
  switch (name) {
    case Name.Boxes:
      content = <FontAwesome5 name="boxes" size={size} color={color} />;
      break;
    case Name.ShoppingCart:
      content = <FontAwesome5 name="shopping-cart" size={size} color={color} />;
      break;
    case Name.User:
      content = <FontAwesome5 name="user-alt" size={size} color={color} />;
      break;
    case Name.Cross:
      content = <Entypo name="cross" size={size} color={color} />;
      break;
    case Name.Search:
      content = <MaterialCommunityIcons name="magnify" size={size} color={color} />;
      break;
    case Name.Category:
      content = <MaterialIcons name="category" size={size} color={color} />;
      break;
  }
  return <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity>;
}
