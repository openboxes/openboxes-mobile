// noinspection DuplicatedCode

import React, {ReactElement} from "react";
import {FlatList, ListRenderItemInfo, StyleSheet, TouchableOpacity, View, Text} from "react-native";
import {AppState} from "../../redux/Reducer";
import {connect} from "react-redux";
import SearchHeader from "../SearchHeader";
import Product from "../../data/product/Product";
import getProductsFromApi from "../../data/product/GetProducts";
import showPopup from "../Popup";
import searchProductsFromApi from "../../data/product/SearchProducts";
import {
  dispatchHideProgressBarAction as hideProgressBar,
  dispatchShowProgressBarAction as showProgressBar
} from "../../redux/Dispatchers";
import Theme from "../../utils/Theme";

export interface OwnProps {
  exit: () => void
}

interface StateProps {
  //no-op
}

interface DispatchProps {
  showProgressBar: (message?: string) => void
  hideProgressBar: () => void
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {
  centralMessage: string | null
  products: Product[] | null
  searchQuery: string | null
  searchProducts: Product[] | null
}

class Products extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      centralMessage: null,
      products: null,
      searchQuery: null,
      searchProducts: null
    }
    this.getProducts = this.getProducts.bind(this)
    this.searchProducts = this.searchProducts.bind(this)
    this.onSearchQuerySubmitted = this.onSearchQuerySubmitted.bind(this)
    this.onSearchBoxVisibilityChange = this.onSearchBoxVisibilityChange.bind(this)
    this.renderProduct = this.renderProduct.bind(this)
  }

  onSearchBoxVisibilityChange(visible: boolean) {
    if (!visible) {
      const centralMessage = !this.state.products || this.state.products.length == 0 ? "No products found" : null
      this.setState({
        searchQuery: null,
        searchProducts: null,
        centralMessage: centralMessage
      })
    }
  }

  onSearchQuerySubmitted(query: string) {
    (async () => {
      if (!query) {
        await showPopup({
          message: "Search query is empty",
          positiveButtonText: "Ok"
        })
        return
      }

      if (this.state.searchQuery == query) {
        return
      }

      const searchedProducts = await this.searchProducts(query)
      if (!searchedProducts) {
        return
      }

      if (searchedProducts.length == 0) {
        this.setState({
          searchQuery: query,
          centralMessage: `No search results found for product name = ${query}`
        })
      } else {
        this.setState({
          searchQuery: query,
          searchProducts: searchedProducts,
          centralMessage: null
        })
      }
    })()
  }

  async searchProducts(query: string): Promise<Product[] | null> {
    try {
      this.props.showProgressBar(`Searching for products with name = ${query}`)
      return await searchProductsFromApi(query)
    } catch (e) {
      const title = e.message ? `Failed to load search results with name = ${query}` : null
      const message = e.message ?? `Failed to load search results with name = ${query}`
      const shouldRetry = await showPopup({
        title: title,
        message: message,
        positiveButtonText: "Retry",
        negativeButtonText: "Cancel"
      })
      if (shouldRetry) {
        return await this.searchProducts(query)
      } else {
        return Promise.resolve(null)
      }
    } finally {
      this.props.hideProgressBar()
    }
  }

  componentDidMount() {
    (async () => {
      const products = await this.getProducts()
      if (!products) {
        this.props.exit()
        return
      }

      if (products.length == 0) {
        this.setState({
          centralMessage: "No products found",
          products: products
        })
      } else {
        this.setState({
          centralMessage: null,
          products: products
        })
      }
    })()
  }

  async getProducts(): Promise<Product[] | null> {
    try {
      this.props.showProgressBar("Fetching products")
      return await getProductsFromApi()
    } catch (e) {
      const title = e.message ? "Failed to fetch products" : null
      const message = e.message ?? "Failed to fetch products"
      const shouldRetry = await showPopup({
        title: title,
        message: message,
        positiveButtonText: "Retry",
        negativeButtonText: "Cancel"
      })
      if (shouldRetry) {
        return await this.getProducts()
      } else {
        return Promise.resolve(null)
      }
    } finally {
      this.props.hideProgressBar()
    }
  }

  renderProduct(item: ListRenderItemInfo<Product>): ReactElement {
    return (
      <TouchableOpacity style={styles.listItemContainer}>
        <View style={styles.listItemNameContainer}>
          <Text style={styles.listItemNameLabel}>Name</Text>
          <Text style={styles.listItemName}>{item.item.name}</Text>
        </View>
        <View style={styles.listItemCategoryContainer}>
          <Text style={styles.listItemCategoryLabel}>Category</Text>
          <Text style={styles.listItemCategory}>{item.item.category.name}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    let products: Product[] | null = null
    if(this.state.searchProducts && this.state.searchProducts.length > 0) {
      products = this.state.searchProducts
    } else if(this.state.products && this.state.products.length > 0) {
      products = this.state.products
    }
    return (
      <View style={styles.screenContainer}>
        <SearchHeader
          title="Products"
          backButtonVisible={true}
          onBackButtonPress={this.props.exit}
          searchHint="Search products"
          onSearchQuerySubmitted={this.onSearchQuerySubmitted}
          onSearchBoxVisibilityChange={this.onSearchBoxVisibilityChange}
        />
        <View style={styles.content}>
          {
            products &&
            <FlatList
                data={products}
                renderItem={this.renderProduct}
                keyExtractor={product => product.id}
                style={styles.list}
            />
          }
          {
            this.state.centralMessage &&
            <Text>{this.state.centralMessage}</Text>
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  screenContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1
  },
  content: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  list: {
    width: "100%"
  },
  listItemContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    borderRadius: Theme.roundness,
    borderColor: Theme.colors.backdrop,
    borderWidth: 1,
    margin: 4,
    padding: 4,
    justifyContent: "center"
  },
  listItemNameContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 0,
    marginStart: 4,
  },
  listItemNameLabel: {
    fontSize: 12,
    color: Theme.colors.placeholder
  },
  listItemName: {
    fontSize: 16,
    color: Theme.colors.text
  },
  listItemCategoryContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 0,
    marginStart: 4,
    marginTop: 4
  },
  listItemCategoryLabel: {
    fontSize: 12,
    color: Theme.colors.placeholder
  },
  listItemCategory: {
    fontSize: 16,
    color: Theme.colors.text
  },
  centralMessage: {
    color: Theme.colors.text
  }
});


const mapStateToProps = (state: AppState): StateProps => ({
  //no-op
})

const mapDispatchToProps: DispatchProps = {
  showProgressBar,
  hideProgressBar
}

export default connect<StateProps, DispatchProps, OwnProps, AppState>(mapStateToProps, mapDispatchToProps)(Products);
