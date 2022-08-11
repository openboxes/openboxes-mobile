import Product from '../../data/product/Product';
import { FlatList, ListRenderItemInfo, TouchableOpacity } from 'react-native';
import React, { ReactElement } from 'react';
import EmptyView from '../../components/EmptyView';
import { Card } from 'react-native-paper';
import { common } from '../../assets/styles';
export interface Props {
  products: Product[] | null;
  onProductTapped: (product: Product) => void;
}
import { Props as LabeledDataType } from '../../components/LabeledData/types';
import DetailsTable from '../../components/DetailsTable';

export default function ProductsList(props: Props) {
  function renderProduct(item: ListRenderItemInfo<Product>): ReactElement {
    const product = item.item;

    const renderProductData: LabeledDataType[] = [
      { label: 'Product Code', value: product.productCode },
      { label: 'Name', value: product.name },
      { label: 'Category', value: product.category.name }
    ];

    return (
      <TouchableOpacity onPress={() => props.onProductTapped(product)}>
        <Card style={common.listItemContainer}>
          <Card.Content>
            <DetailsTable columns={1} data={renderProductData} />
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  }

  return (
    <FlatList
      data={props.products}
      renderItem={renderProduct}
      ListEmptyComponent={<EmptyView title="Product List" description="There are no products on the list" />}
      keyExtractor={(product) => product.id}
    />
  );
}
