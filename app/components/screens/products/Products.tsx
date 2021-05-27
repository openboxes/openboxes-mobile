// noinspection DuplicatedCode

import React from "react";
import {StyleSheet, View} from "react-native";
import {AppState} from "../../../redux/Reducer";
import {connect} from "react-redux";
import Product from "../../../data/product/Product";
import getProductsFromApi from "../../../data/product/GetProducts";
import showPopup from "../../Popup";
import {
  searchProductsByName as searchProductsByNameFromApi,
  searchProductsByCategory as searchProductsByCategoryFromApi
} from "../../../data/product/SearchProducts";
import {
  dispatchHideProgressBarAction as hideProgressBar,
  dispatchShowProgressBarAction as showProgressBar
} from "../../../redux/Dispatchers";
import ProductsSearchHeader from "./ProductsSearchHeader";
import ProductsList from "./ProductsList";
import CentralMessage from "./CentralMessage";
import FloatingActionButtonMenu from "./FloatingActionButtonMenu";
import ProductCategoryPickerPopup from "./ProductCategoryPickerPopup";
import {ProductCategory} from "../../../data/product/category/ProductCategory";
import ProductDetails from "../product_details/ProductDetails";
import {DispatchProps, OwnProps, Props, StateProps} from "./Props";
import {NavigationStateHere, NavigationStateProductDetails, NavigationStateType, State} from "./State";
import {VM} from "./VM";
import vmMapper from "./VMMapper";

class Products extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      error: null,
      allProducts: null,
      searchBoxVisible: false,
      categoryPickerPopupVisible: false,
      searchByName: null,
      searchByCategory: null,
      navigationState: new NavigationStateHere()
    }
    this.getProducts = this.getProducts.bind(this)
    this.searchProducts = this.searchProducts.bind(this)
    this.onSearchQuerySubmitted = this.onSearchQuerySubmitted.bind(this)
    this.onSearchBoxVisibilityChange = this.onSearchBoxVisibilityChange.bind(this)
    this.onSearchByProductNamePress = this.onSearchByProductNamePress.bind(this)
    this.onSearchByCategoryPress = this.onSearchByCategoryPress.bind(this)
    this.hideCategoryPickerPopup = this.hideCategoryPickerPopup.bind(this)
    this.onCategoryChosen = this.onCategoryChosen.bind(this)
    this.onBackButtonPress = this.onBackButtonPress.bind(this)
    this.renderContent = this.renderContent.bind(this)
    this.showProductDetailsScreen = this.showProductDetailsScreen.bind(this)
    this.renderProductDetailsScreen = this.renderProductDetailsScreen.bind(this)
    this.showProductsScreen = this.showProductsScreen.bind(this)
  }

  onSearchByProductNamePress() {
    this.setState({
      searchBoxVisible: true
    })
  }

  onSearchByCategoryPress() {
    this.showCategoryPickerPopup()
  }

  onSearchBoxVisibilityChange(visible: boolean) {
    if (!visible) {
      const error =
        !this.state.allProducts ||
        this.state.allProducts.length == 0
          ?
          "No products found"
          :
          null
      this.setState({
        error: error,
        searchBoxVisible: false,
        searchByName: null
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

      if (this.state.searchByName?.query == query) {
        return
      }

      const searchedProducts = await this.searchProducts(query)
      if (!searchedProducts) {
        return
      }

      if (searchedProducts.length == 0) {
        this.setState({
          searchByName: {
            query: query,
            results: null
          },
          error: `No search results found for product name "${query}"`
        })
      } else {
        this.setState({
          searchByName: {
            query: query,
            results: searchedProducts,
          },
          error: null
        })
      }
    })()
  }

  async searchProducts(query: string): Promise<Product[] | null> {
    try {
      this.props.showProgressBar(`Searching for products with name "${query}"`)
      return await searchProductsByNameFromApi(query)
    } catch (e) {
      const title = e.message ? `Failed to load search results with name = "${query}"` : null
      const message = e.message ?? `Failed to load search results with name = "${query}"`
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
          error: "No products found",
          allProducts: products
        })
      } else {
        this.setState({
          error: null,
          allProducts: products
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

  onCategoryChosen(category: ProductCategory) {
    this.hideCategoryPickerPopup();
    (async () => {
      const searchedProducts = await this.searchProductsByCategory(category)
      if (!searchedProducts) {
        return
      }

      if (searchedProducts.length == 0) {
        this.setState({
          error: `No products found in category "${category.name}"`,
          searchByCategory: {
            category: category,
            results: null
          }
        })
      } else {
        this.setState({
          error: null,
          searchByCategory: {
            category: category,
            results: searchedProducts
          }
        })
      }
    })()
  }

  async searchProductsByCategory(category: ProductCategory): Promise<Product[] | null> {
    try {
      this.props.showProgressBar(`Searching for products in category "${category.name}"`)
      return await searchProductsByCategoryFromApi(category)
    } catch (e) {
      const title = e.message ? `Failed to load search results for products in category = ${category.name}` : null
      const message = e.message ?? `Failed to load search results for products in category = ${category.name}`
      const shouldRetry = await showPopup({
        title: title,
        message: message,
        positiveButtonText: "Retry",
        negativeButtonText: "Cancel"
      })
      if (shouldRetry) {
        return await this.searchProductsByCategory(category)
      } else {
        return Promise.resolve(null)
      }
    } finally {
      this.props.hideProgressBar()
    }
  }

  showCategoryPickerPopup() {
    this.setState({
      categoryPickerPopupVisible: true
    })
  }

  hideCategoryPickerPopup() {
    this.setState({
      categoryPickerPopupVisible: false
    })
  }

  onBackButtonPress() {
    const currState = this.state
    if (currState.searchByCategory) {
      this.setState({
        error: null,
        searchByCategory: null
      })
    } else {
      this.props.exit()
    }
  }

  render() {
    const vm = vmMapper(this.state)
    switch (vm.navigationState.type) {
      case NavigationStateType.Here:
        return this.renderContent(vm);
      case NavigationStateType.ProductDetails:
        const navigationStateProductDetails = vm.navigationState as NavigationStateProductDetails
        return this.renderProductDetailsScreen(navigationStateProductDetails.product);
    }
  }

  renderContent(vm: VM) {
    return (
      <View style={styles.screenContainer}>
        <ProductsSearchHeader
          subtitle={vm.subtitle}
          searchBoxVisible={vm.searchBoxVisible}
          onBackButtonPress={this.onBackButtonPress}
          onSearchQuerySubmitted={this.onSearchQuerySubmitted}
          onSearchBoxVisibilityChange={this.onSearchBoxVisibilityChange}
        />
        <View style={styles.content}>
          <ProductsList products={vm.list} onProductTapped={this.showProductDetailsScreen}/>
          <CentralMessage message={vm.centralErrorMessage}/>
          <FloatingActionButtonMenu
            visible={vm.floatingActionButtonVisible}
            onSearchByProductNamePress={this.onSearchByProductNamePress}
            onSearchByCategoryPress={this.onSearchByCategoryPress}
          />
          <ProductCategoryPickerPopup
            visible={vm.categoryPickerPopupVisible}
            onCategoryChosen={this.onCategoryChosen}
            onCancelPressed={this.hideCategoryPickerPopup}
          />
        </View>
      </View>
    )
  }

  showProductDetailsScreen(product: Product) {
    this.setState({
      navigationState: new NavigationStateProductDetails(product)
    })
  }

  renderProductDetailsScreen(product: Product) {
    return (
      <ProductDetails
        product={product}
        exit={this.showProductsScreen}
      />
    )
  }

  showProductsScreen() {
    this.setState({
      navigationState: new NavigationStateHere()
    })
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
