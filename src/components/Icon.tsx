import React from 'react';
import { StyleProp, TextStyle, TouchableOpacity } from 'react-native';
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
  Check,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Warning
}

export interface Props {
  name: Name;
  size?: number;
  onPress?: () => void;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export default function Icon(props: Props) {
  let content;
  switch (props.name) {
    case Name.Boxes:
      content = <FontAwesome5 name="boxes" style={props.style} size={props.size} color={props.color} />;
      break;
    case Name.ShoppingCart:
      content = <FontAwesome5 name="shopping-cart" style={props.style} size={props.size} color={props.color} />;
      break;
    case Name.User:
      content = <FontAwesome5 name="user-alt" style={props.style} size={props.size} color={props.color} />;
      break;
    case Name.Cross:
      content = <Entypo name="cross" style={props.style} size={props.size} color={props.color} />;
      break;
    case Name.Search:
      content = <MaterialCommunityIcons name="magnify" style={props.style} size={props.size} color={props.color} />;
      break;
    case Name.Category:
      content = <MaterialIcons name="category" style={props.style} size={props.size} color={props.color} />;
      break;
    case Name.Check:
      content = <Entypo name="check" style={props.style} size={props.size} color={props.color} />;
      break;
    case Name.ChevronRight:
      content = <Entypo name="chevron-right" style={props.style} size={props.size} color={props.color} />;
      break;
    case Name.ChevronDown:
      content = <Entypo name="chevron-down" style={props.style} size={props.size} color={props.color} />;
      break;
    case Name.ChevronUp:
      content = <Entypo name="chevron-up" style={props.style} size={props.size} color={props.color} />;
      break;
    case Name.Warning:
      content = <MaterialIcons name="warning" style={props.style} size={props.size} color={props.color} />;
      break;
  }

  return props.onPress ? <TouchableOpacity onPress={props.onPress}>{content}</TouchableOpacity> : content;
}
