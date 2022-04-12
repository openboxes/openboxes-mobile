import React from 'react';
import {TouchableOpacity} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export enum Name {
  Boxes,
  ShoppingCart,
  User,
  Cross,
  Search,
  Category,
}

export interface Props {
  name: Name;
  size?: number;
  onPress?: () => void;
  color?: string;
}

export default function Icon(props: Props) {
  let content;
  switch (props.name) {
    case Name.Boxes:
      content = (
        <FontAwesome5 name="boxes" size={props.size} color={props.color} />
      );
      break;
    case Name.ShoppingCart:
      content = (
        <FontAwesome5
          name="shopping-cart"
          size={props.size}
          color={props.color}
        />
      );
      break;
    case Name.User:
      content = (
        <FontAwesome5 name="user-alt" size={props.size} color={props.color} />
      );
      break;
    case Name.Cross:
      content = <Entypo name="cross" size={props.size} color={props.color} />;
      break;
    case Name.Search:
      content = (
        <MaterialCommunityIcons
          name="magnify"
          size={props.size}
          color={props.color}
        />
      );
      break;
    case Name.Category:
      content = (
        <MaterialIcons name="category" size={props.size} color={props.color} />
      );
      break;
  }
  return <TouchableOpacity onPress={props.onPress}>{content}</TouchableOpacity>;
}
