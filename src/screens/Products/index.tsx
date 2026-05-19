import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import BarcodeSearchHeader from '../../components/BarcodeSearchHeader/BarcodeSearchHeader';
import ListLoadingSkeleton from '../../components/ListLoadingSkeleton';
import showPopup from '../../components/Popup';
import { appConfig } from '../../constants';
import { ProductCategory } from '../../data/product/category/ProductCategory';
import Product from '../../data/product/Product';
import {
  getProductsAction,
  searchProductByCodeAction,
  searchProductGloballyAction,
  searchProductSByCategoryAction,
  searchProductsByNameAction
} from '../../redux/actions/products';
import { RootState } from '../../redux/reducers';
import { emptyStateMessage } from '../../utils/emptyStateMessage';
import CentralMessage from './CentralMessage';
import ProductCardSkeleton from './ProductCardSkeleton';
import ProductCategoryPickerPopup from './ProductCategoryPickerPopup';
import ProductsList from './ProductsList';
import ProductsSearchCodeHeader from './ProductsSearchCodeHeader';
import ProductsSearchHeader from './ProductsSearchHeader';
import styles from './styles';
import { DispatchProps, Props, State } from './types';
import vmMapper from './VMMapper';

class Products extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      searchGlobally: null,
      error: null,
      allProducts: null,
      allProductsHasMore: true,
      loadingMore: false,
      searchBoxVisible: false,
      searchBoxProductCodeVisible: false,
      categoryPickerPopupVisible: false,
      searchByName: null,
      searchByProductCode: null,
      searchByCategory: null,
      barcodeNo: '',
      loading: true,
      searchTerm: ''
    };
  }

  componentDidMount = () => {
    this.getProducts();
  };

  getProducts = () => {
    this.setState({
      loading: true,
      searchTerm: '',
      allProducts: [],
      allProductsHasMore: true,
      loadingMore: false
    });
    this.fetchProductsPage(0);
  };

  fetchProductsPage = (offset: number) => {
    const actionCallback = (data: any) => {
      if (data?.error) {
        this.setState({ loading: false, loadingMore: false });
        showPopup({
          title: data.errorMessage ? 'Failed to fetch products' : 'Error',
          message: data.errorMessage ?? 'Failed to fetch products',
          positiveButton: {
            text: 'Retry',
            callback: () => {
              this.fetchProductsPage(offset);
            }
          },
          negativeButtonText: 'Cancel'
        });
        return;
      }
      const items: Product[] = Array.isArray(data) ? data : [];
      this.setState((prev) => {
        const baseList = offset === 0 ? [] : prev.allProducts ?? [];
        const merged = [...baseList, ...items];
        return {
          loading: false,
          loadingMore: false,
          allProducts: merged,
          allProductsHasMore: items.length === appConfig.DEFAULT_PAGE_SIZE,
          error: merged.length === 0 ? emptyStateMessage('products', '', 'No products available') : null
        };
      });
    };

    this.props.getProductsAction(actionCallback, true, {
      max: appConfig.DEFAULT_PAGE_SIZE,
      offset
    });
  };

  loadMoreProducts = () => {
    const { allProducts, allProductsHasMore, loadingMore, loading } = this.state;
    if (loading || loadingMore || !allProductsHasMore) {
      return;
    }
    const loaded = allProducts?.length ?? 0;
    if (loaded === 0) {
      return;
    }
    this.setState({ loadingMore: true });
    this.fetchProductsPage(loaded);
  };

  goToProductDetails = (product: Product) => {
    this.props.navigation.navigate('ProductDetails', {
      product,
      fromSortation: this.props.route?.params?.fromSortation
    });
  };

  onSearchByProductNamePress = () => {
    this.setState({
      searchBoxVisible: true
    });
  };

  onSearchByProductCodePress = () => {
    this.setState({
      searchBoxProductCodeVisible: true
    });
  };

  onSearchByCategoryPress = () => {
    this.showCategoryPickerPopup();
  };

  onSearchBoxVisibilityChange = (visible: boolean) => {
    if (!visible) {
      const error =
        !this.props.products || this.props.products.length === 0
          ? emptyStateMessage('products', '', 'No products available')
          : null;
      this.setState({
        error: error,
        searchBoxVisible: false,
        searchBoxProductCodeVisible: false,
        searchByName: null,
        searchByProductCode: null
      });
    }
  };

  onSearchQuerySubmitted = (query: string) => {
    if (!query) {
      showPopup({
        message: 'Search query is empty',
        positiveButton: { text: 'Ok' }
      });
      return;
    }

    if (this.state.searchByName?.query === query) {
      return;
    }

    this.setState({ loading: true, searchTerm: query });
    const actionCallback = (data: any) => {
      this.setState({ loading: false });
      if (data?.error) {
        showPopup({
          title: data.errorMessage ? `Failed to load search results with name = "${query}"` : null,
          message: data.errorMessage ?? `Failed to load search results with name = "${query}"`,
          positiveButton: {
            text: 'Retry',
            callback: () => {
              this.onSearchQuerySubmitted(query);
            }
          },
          negativeButtonText: 'Cancel'
        });
        return;
      }
      if (data.length === 0) {
        this.setState({
          searchByName: { query, results: null },
          error: emptyStateMessage('products', query, 'No products available')
        });
      } else if (data.length === 1) {
        this.goToProductDetails(data[0]);
      } else {
        this.setState({
          searchByName: { query, results: data },
          error: null
        });
      }
    };

    this.props.searchProductsByNameAction(query, actionCallback, true);
  };

  onSearchProductCodeQuerySubmitted = (query: string) => {
    if (!query) {
      showPopup({
        message: 'Search query is empty',
        positiveButton: { text: 'Ok' }
      });
      return;
    }

    if (this.state.searchByProductCode?.query === query) {
      return;
    }

    this.setState({ loading: true, searchTerm: query });
    const actionCallback = (data: any) => {
      this.setState({ loading: false });
      if (data?.error) {
        showPopup({
          title: data.errorMessage ? `Failed to load search results with code = "${query}"` : null,
          message: data.errorMessage ?? `Failed to load search results with code = "${query}"`,
          positiveButton: {
            text: 'Retry',
            callback: () => {
              this.onSearchProductCodeQuerySubmitted(query);
            }
          },
          negativeButtonText: 'Cancel'
        });
        return;
      }
      if (data.length === 0) {
        this.setState({
          searchByProductCode: { query, results: null },
          error: emptyStateMessage('products', query, 'No products available')
        });
      } else if (data.length === 1) {
        this.goToProductDetails(data[0]);
      } else {
        this.setState({
          searchByProductCode: { query, results: data },
          error: null
        });
      }
    };

    this.props.searchProductByCodeAction(query, actionCallback, true);
  };

  onCategoryChosen = (category: ProductCategory) => {
    this.hideCategoryPickerPopup();
    this.setState({ loading: true, searchTerm: '' });

    const actionCallback = (data: any) => {
      this.setState({ loading: false });
      if (data?.error) {
        showPopup({
          title: data.errorMessage ? `Failed to load search results for products in category = ${category.name}` : null,
          message: data.errorMessage ?? `Failed to load search results for products in category = ${category.name}`,
          positiveButton: {
            text: 'Retry',
            callback: () => {
              this.onCategoryChosen(category);
            }
          },
          negativeButtonText: 'Cancel'
        });
        return;
      }
      if (data.length === 0) {
        this.setState({
          error: `No products found in category "${category.name}"`,
          searchByCategory: { category, results: null }
        });
      } else {
        this.setState({
          error: null,
          searchByCategory: { category, results: data }
        });
      }
    };

    this.props.searchProductSByCategoryAction(category, actionCallback, true);
  };

  showCategoryPickerPopup = () => {
    this.setState({
      categoryPickerPopupVisible: true
    });
  };

  hideCategoryPickerPopup = () => {
    this.setState({
      categoryPickerPopupVisible: false
    });
  };

  onBackButtonPress = () => {
    const currState = this.state;
    if (currState.searchByCategory) {
      this.setState({
        error: null,
        searchByCategory: null
      });
    } else {
      this.props.navigation.back();
    }
  };

  onSearchTermSubmit = (query: string) => {
    const trimmed = query.trim();

    if (trimmed.length === 0) {
      this.setState({
        searchByName: null,
        searchByProductCode: null,
        searchByCategory: null,
        searchGlobally: null,
        searchTerm: '',
        error: null
      });
      this.getProducts();
      return;
    }

    if (trimmed.length < appConfig.MIN_SEARCH_LENGTH) {
      this.setState({
        searchByName: null,
        searchByProductCode: null,
        searchByCategory: null,
        searchGlobally: null,
        searchTerm: trimmed,
        error: null
      });
      return;
    }

    this.setState({ loading: true, searchTerm: query });
    const actionCallback = (data: any) => {
      this.setState({ loading: false });
      if (data?.error) {
        showPopup({
          title: data.errorMessage ? `Failed to load search results with value = "${query}"` : null,
          message: data.errorMessage ?? `Failed to load search results with value = "${query}"`,
          positiveButton: {
            text: 'Retry',
            callback: () => {
              this.onSearchTermSubmit(query);
            }
          },
          negativeButtonText: 'Cancel'
        });
        return;
      }
      const productList = data?.data ?? [];

      if (productList.length === 0) {
        this.setState({
          searchByProductCode: { query, results: null },
          error: emptyStateMessage('products', query, 'No products available')
        });
      } else if (productList.length === 1) {
        this.goToProductDetails(productList[0]);
      } else {
        this.setState({
          searchByProductCode: { query, results: data },
          error: null
        });
      }
    };

    this.props.searchProductGloballyAction(query, actionCallback, true);
  };

  render() {
    const vm = vmMapper(this.state);
    const { loading } = this.state;
    return (
      <View style={styles.screenContainer}>
        <ProductsSearchHeader
          subtitle={vm.subtitle}
          searchBoxVisible={vm.searchBoxVisible}
          onBackButtonPress={this.onBackButtonPress}
          onSearchQuerySubmitted={this.onSearchQuerySubmitted}
          onSearchBoxVisibilityChange={this.onSearchBoxVisibilityChange}
        />
        <ProductsSearchCodeHeader
          subtitle={vm.subtitle}
          searchBoxProductCodeVisible={vm.searchBoxProductCodeVisible}
          onBackButtonPress={this.onBackButtonPress}
          onSearchProductCodeQuerySubmitted={this.onSearchProductCodeQuerySubmitted}
          onSearchBoxVisibilityChange={this.onSearchBoxVisibilityChange}
        />
        <BarcodeSearchHeader
          autoSearch
          autoFocus
          placeholder={`Search products (min ${appConfig.MIN_SEARCH_LENGTH} chars)`}
          subtitle={vm.subtitle}
          resetSearch={this.getProducts}
          searchBox={false}
          loading={loading}
          accessibilityLabel="Search products"
          onSearchTermSubmit={this.onSearchTermSubmit}
        />
        <View style={styles.content}>
          {loading ? (
            <ListLoadingSkeleton visible count={5} CardComponent={ProductCardSkeleton} />
          ) : (
            <>
              <ProductsList
                products={vm.list}
                loadingMore={vm.showingAllProducts && vm.loadingMore}
                hasMore={vm.showingAllProducts ? vm.allProductsHasMore : undefined}
                onProductTapped={this.goToProductDetails}
                onEndReached={vm.showingAllProducts ? this.loadMoreProducts : undefined}
              />
              {vm?.list?.length === 0 && <CentralMessage message={vm.centralErrorMessage} />}
            </>
          )}
          <ProductCategoryPickerPopup
            visible={vm.categoryPickerPopupVisible}
            onCategoryChosen={this.onCategoryChosen}
            onCancelPressed={this.hideCategoryPickerPopup}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  products: state.productsReducer
});

const mapDispatchToProps: DispatchProps = {
  getProductsAction,
  searchProductsByNameAction,
  searchProductByCodeAction,
  searchProductGloballyAction,
  searchProductSByCategoryAction
};

export default connect(mapStateToProps, mapDispatchToProps)(Products);
