import {FontAwesome5} from "@expo/vector-icons";
import React from "react";

export enum Name {
  Boxes,
  ShoppingCart,
  User
}

export interface Props {
  name: Name
  size?: number | null
}

export default function Icon(props: Props) {
  let content
  switch(props.name) {
    case Name.Boxes:
      content = <FontAwesome5 name="boxes" size={props.size}/>;
      break
    case Name.ShoppingCart:
      content = <FontAwesome5 name="shopping-cart" size={props.size}/>;
      break
    case Name.User:
      content = <FontAwesome5 name="user-alt" size={props.size}/>;
      break
  }
  return content
}
