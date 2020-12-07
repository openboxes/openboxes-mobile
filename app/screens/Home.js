import React from "react";
import axios from "axios";
import { StyleSheet, Dimensions, ScrollView } from "react-native";
import { Button, Block, Text, Input, theme } from "galio-framework";

import ProductList from "../components/ProductList";
import { Icon, Product } from "../components/";

const { width } = Dimensions.get("screen");
import products from "../constants/products";

const items = [
  { id: "1", text: "Expo 💙" },
  { id: "2", text: "is" },
  { id: "3", text: "Awesome!" },
];

export default class Home extends React.Component {
  componentDidMount() {
    this.getProducts();
  }

  state = {
    loading: false,
    products: [],
    limit: 3,
    error: null,
  };

  getProducts = () => {
    const { limit } = this.state;
    const url = "https://fakestoreapi.com/products?limit=${limit}";
    this.setState({ loading: true });

    axios.get(url).then((res) => {
      const products = res.data;
      this.setState({ products });
    });
  };

  // renderProducts = () => {
  //   return (
  //     <ScrollView
  //       showsVerticalScrollIndicator={false}
  //       contentContainerStyle={styles.products}
  //     >
  //       <Block flex>
  //         <Product product={products[0]} horizontal />
  //         <Block flex row>
  //           <Product
  //             product={products[1]}
  //             style={{ marginRight: theme.SIZES.BASE }}
  //           />
  //           <Product product={products[2]} />
  //         </Block>
  //         <Product product={products[3]} horizontal />
  //         <Product product={products[4]} full />
  //       </Block>
  //     </ScrollView>
  //   );
  // };

  render() {
    return (
      <Block flex center style={styles.home}>
        <ProductList products={this.state.products} />
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
  },
  header: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    elevation: 4,
    zIndex: 2,
  },
  tabs: {
    marginBottom: 24,
    marginTop: 10,
    elevation: 4,
  },
  tab: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    width: width * 0.5,
    borderRadius: 0,
    borderWidth: 0,
    height: 24,
    elevation: 0,
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: "300",
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.MUTED,
  },
  products: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE * 2,
  },
});
