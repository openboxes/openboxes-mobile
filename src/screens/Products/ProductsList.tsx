import React, { ReactElement } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Card, Chip, Divider, Subheading } from 'react-native-paper';

import { LayoutStyle } from '../../assets/styles';
import EmptyView from '../../components/EmptyView';
import { appConfig, HYPHEN } from '../../constants';
import Product from '../../data/product/Product';
import Theme from '../../utils/Theme';

export interface Props {
  products: Product[] | null;
  onProductTapped: (product: Product) => void;
  onEndReached?: () => void;
  loadingMore?: boolean;
  hasMore?: boolean;
}

export default function ProductsList(props: Props) {
  const { products, onProductTapped, onEndReached, loadingMore, hasMore } = props;

  if (!products) {
    return <EmptyView title="Product List" description="There are no products on the list" />;
  }

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="small" color={Theme.colors.primary} />
        </View>
      );
    }

    if (hasMore === false && (products?.length ?? 0) > 0) {
      return (
        <View style={styles.footer}>
          <Text style={styles.footerText}>End of list</Text>
        </View>
      );
    }

    return null;
  };

  return (
    <FlatList
      data={products}
      renderItem={(item: ListRenderItemInfo<Product>) => renderProduct(item.item, () => onProductTapped(item.item))}
      keyExtractor={(product) => product.id}
      style={styles.list}
      keyboardShouldPersistTaps="handled"
      ListFooterComponent={renderFooter}
      onEndReached={onEndReached}
      onEndReachedThreshold={appConfig.LIST_END_REACHED_THRESHOLD}
    />
  );
}

function renderProduct(product: Product, onProductTapped: () => void): ReactElement {
  return (
    <TouchableOpacity onPress={() => onProductTapped()}>
      <Card style={LayoutStyle.listItemContainer}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Chip icon="barcode" style={styles.chipDefault} textStyle={styles.chipText}>
              {`Product Code: ${product.productCode || HYPHEN}`}
            </Chip>
          </View>
          <Divider style={styles.contentDivider} />

          <Subheading style={styles.subheading}> {product.name} </Subheading>
          <View style={styles.additionalInfoRow}>
            {product?.upc ? (
              <Chip icon="barcode" style={styles.chipDefault} textStyle={styles.chipText}>
                {`Barcode: ${product.upc ?? HYPHEN}`}
              </Chip>
            ) : null}
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
  footer: {
    paddingBottom: Theme.spacing.medium,
    alignItems: 'center'
  },
  footerText: {
    fontSize: 13,
    color: Theme.colors.secondaryForeground
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
