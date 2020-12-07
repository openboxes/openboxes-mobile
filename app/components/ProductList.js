import React from "react";
import { FlatList, ScrollView, StyleSheet } from "react-native";
import { Button, Block, Text, Input, theme } from "galio-framework";
import Product from "../components/Product";

class ProductList extends React.Component {
  render() {
    const { navigation, products } = this.props;

    // Need to transform some properties of product
    // const productList = products.map((product) => {
    //   return {
    //     title: product.description,
    //   };
    // });

    return (
      //   <ScrollView
      //     showsVerticalScrollIndicator={false}
      //     contentContainerStyle={styles.products}
      //   >

      //   </ScrollView>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Product product={item} />}
      ></FlatList>
    );
  }
}

// {this.productList.map((product) => {
//     <Block flex>
//       <Product product={product} full />;
//     </Block>;
//   })}

{
  /* <Text style={{ fontSize: 20 }}>
Test {item.id} - {item.title}
</Text> */
}

export default ProductList;

const styles = StyleSheet.create({
  products: {
    //width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE * 2,
  },
});
