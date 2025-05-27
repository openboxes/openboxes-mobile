import React, { ReactElement } from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Chip, Divider, Subheading } from 'react-native-paper';

import { LayoutStyle } from '../../assets/styles';
import EmptyView from '../../components/EmptyView';
import { HYPHEN } from '../../constants';
import Product from '../../data/product/Product';
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
      keyExtractor={(product) => product.id}
      style={styles.list}
    />
  ) : (
    <EmptyView title="Product List" description="There are no products on the list" />
  );
}

function renderProduct(product: Product, onProductTapped: () => void): ReactElement {
  return (
    <TouchableOpacity onPress={() => onProductTapped()}>
      <Card style={LayoutStyle.listItemContainer}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Chip icon="barcode" style={styles.chipDefault} textStyle={styles.chipText}>
              {product.productCode}
            </Chip>
          </View>
          <Divider style={styles.contentDivider} />

          <Subheading style={styles.subheading}> {product.name} </Subheading>
          <View style={styles.additionalInfoRow}>
            <Chip icon="package" style={styles.chipDefault} textStyle={styles.chipText}>
              {`Category: ${product.category ?? HYPHEN}`}
            </Chip>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  list: {
    width: '100%'
  },
  subheading: {
    fontWeight: 'bold',
    color: Theme.colors.text
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  chipDefault: {
    height: 24,
    justifyContent: 'center',
    borderRadius: 4,
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: Theme.colors.background
  },
  contentDivider: {
    marginVertical: 8
  },
  additionalInfoRow: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  chipText: {
    fontSize: 12,
    color: Theme.colors.text
  }
});
