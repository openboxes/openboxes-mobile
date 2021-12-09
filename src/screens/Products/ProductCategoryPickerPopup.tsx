import React, {ReactElement} from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import {ProductCategory} from '../../data/product/category/ProductCategory';
import {ActivityIndicator} from 'react-native-paper';
import getProductCategories from '../../data/product/category/GetProductCategories';
import Theme from '../../utils/Theme';

export interface Props {
  visible: boolean;
  onCategoryChosen: (category: ProductCategory) => void;
  onCancelPressed: () => void;
}

interface State {
  loading: boolean;
  categories: ProductCategory[] | null;
  message: string | null;
}

export default class ProductCategoryPickerPopup extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      categories: null,
      message: null,
    };
    this.renderCategoryItem = this.renderCategoryItem.bind(this);
    this.resetState = this.resetState.bind(this);
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    if (!prevProps.visible && this.props.visible) {
      (async () => {
        try {
          this.resetState();
          this.setState({
            loading: true,
          });
          const categories = await getProductCategories();
          if (categories.length == 0) {
            this.setState({
              message: 'No categories found',
            });
          } else {
            this.setState({
              categories: categories,
            });
          }
        } catch (e) {
          const message = e.message ?? 'Failed to fetch categories';
          this.setState({
            message: message,
          });
        } finally {
          this.setState({
            loading: false,
          });
        }
      })();
    }
  }

  resetState() {
    this.setState({
      loading: false,
      categories: null,
      message: null,
    });
  }

  renderCategoryItem(item: ListRenderItemInfo<ProductCategory>): ReactElement {
    return (
      <TouchableOpacity
        style={styles.listItemContainer}
        onPress={() => this.props.onCategoryChosen(item.item)}>
        <Text style={styles.listItem}>{item.item.name}</Text>
        <View
          style={{
            borderBottomColor: Theme.colors.background,
            borderBottomWidth: 0,
          }}
        />
      </TouchableOpacity>
    );
  }

  render() {
    return (
      this.props.visible && (
        <View style={styles.modalParent}>
          <Modal transparent>
            <View style={styles.modalChild}>
              <View style={styles.modalContent}>
                <Text style={styles.title}>Choose category</Text>
                <View style={styles.content}>
                  {this.state.categories && (
                    <FlatList
                      data={this.state.categories}
                      renderItem={this.renderCategoryItem}
                      keyExtractor={category => category.id}
                      style={styles.list}
                    />
                  )}
                  {this.state.loading && (
                    <View style={styles.loader}>
                      <ActivityIndicator />
                    </View>
                  )}
                  {this.state.message && (
                    <Text style={styles.loadingFailedError}>
                      {this.state.message}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.cancelButtonContainer}
                  onPress={this.props.onCancelPressed}>
                  <Text style={styles.button}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      )
    );
  }
}

const styles = StyleSheet.create({
  modalParent: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Theme.colors.backdrop,
  },
  modalChild: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '75%',
    height: '50%',
    display: 'flex',
    flex: 0,
    flexDirection: 'column',
    alignSelf: 'center',
    backgroundColor: Theme.colors.background,
  },
  title: {
    color: Theme.colors.primary,
    fontSize: 20,
    margin: 8,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    width: '100%',
  },
  listItemContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    margin: 8,
  },
  listItem: {},
  loader: {},
  loadingFailedError: {},
  cancelButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: 0,
    justifyContent: 'flex-end',
    marginEnd: 8,
    marginBottom: 8,
  },
  button: {
    fontSize: 20,
    color: Theme.colors.primary,
  },
});
