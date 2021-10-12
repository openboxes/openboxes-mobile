import Product from '../../data/product/Product';
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {ReactElement} from 'react';
import Theme from '../../utils/Theme';

export interface Props {
  products: Product[] | null;
  onProductTapped: (product: Product) => void;
}

export default function ProductsList(props: Props) {
  return props.products ? (
    <FlatList
      data={props.products}
      renderItem={(item: ListRenderItemInfo<Product>) =>
        renderProduct(item.item, () => props.onProductTapped(item.item))
      }
      keyExtractor={product => product.id}
      style={styles.list}
    />
  ) : null;
}

function renderProduct(
  product: Product,
  onProductTapped: () => void,
): ReactElement {
  return (
    <TouchableOpacity
      style={styles.listItemContainer}
      onPress={() => onProductTapped()}>
      <View style={styles.listItemNameContainer}>
        <Text style={styles.listItemNameLabel}>Name</Text>
        <Text style={styles.listItemName}>{product.name}</Text>
      </View>
      <View style={styles.listItemCategoryContainer}>
        <Text style={styles.listItemCategoryLabel}>Category</Text>
        <Text style={styles.listItemCategory}>{product.category.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  list: {
    width: '100%',
  },
  listItemContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    borderRadius: Theme.roundness,
    borderColor: Theme.colors.backdrop,
    borderWidth: 1,
    margin: 4,
    padding: 4,
    justifyContent: 'center',
  },
  listItemNameContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4,
  },
  listItemNameLabel: {
    fontSize: 12,
    color: Theme.colors.placeholder,
  },
  listItemName: {
    fontSize: 16,
    color: Theme.colors.text,
  },
  listItemCategoryContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4,
    marginTop: 4,
  },
  listItemCategoryLabel: {
    fontSize: 12,
    color: Theme.colors.placeholder,
  },
  listItemCategory: {
    fontSize: 16,
    color: Theme.colors.text,
  },
});
