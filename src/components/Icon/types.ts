export enum Name {
  Boxes,
  ShoppingCart,
  User,
  Cross,
  Search,
  Category
}

export interface Props {
  name: Name;
  size?: number;
  onPress?: () => void;
  color?: string;
}
