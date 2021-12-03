/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import styles from './styles';
import PrintModal from '../../components/PrintModal';
import Refresh from '../../components/Refresh';
import {DispatchProps, Props, State} from './types';
import {vmMapper} from './VMMapper';
import {getProductByIdAction} from '../../redux/actions/products';
import {hideScreenLoading, showScreenLoading} from '../../redux/actions/main';
import {connect} from 'react-redux';
import showPopup from '../../components/Popup';
import {RootState} from '../../redux/reducers';
import {Card} from 'react-native-paper';
import RenderData from '../../components/RenderData';
import Button from '../../components/Button';

class ProductDetails extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      visible: false,
      productDetails: {},
    };
  }

  getProduct = () => {
    const {product} = this.props.route.params;
    console.log(product);
    this.getProductDetails(product.id);
  };

  closeModal = () => {
    this.setState({visible: false});
  };

  handleClick = () => {
    const {product} = this.props.route.params;
    this.props.getProductByIdAction(product.productCode, data => {
      this.setState({visible: true});
    });
  };

  componentDidMount() {
    this.getProduct();
  }

  getProductDetails(id: string) {
    this.props.showScreenLoading();
    if (!id) {
      showPopup({
        message: 'Product id is empty',
        positiveButton: {text: 'Ok'},
      });
      return;
    }

    const actionCallback = (data: any) => {
      console.log(JSON.stringify(data));
      if (data?.error) {
        showPopup({
          title: data.errorMessage
            ? `Failed to load product details with value = "${id}"`
            : null,
          message:
            data.errorMessage ??
            `Failed to load product details with value = "${id}"`,
          positiveButton: {
            text: 'Retry',
            callback: () => {
              this.props.getProductByIdAction(id, actionCallback);
            },
          },
          negativeButtonText: 'Cancel',
        });
      } else {
        this.setState({productDetails: data});
      }
    };
    this.props.hideScreenLoading();
    this.props.getProductByIdAction(id, actionCallback);
  }

  navigateToDetails = (item: any) => {
    this.props.navigation.navigate('ViewAvailableItem', {
      item,
      imageUrl:
        this.state.productDetails?.defaultImageUrl ??
        'https://reactnative.dev/img/tiny_logo.png',
    });
  };

  renderListItem = (item: any, index: any) => (
    <TouchableOpacity
      key={index}
      onPress={() => this.navigateToDetails(item)}
      style={styles.itemView}>
      <Card>
        <Card.Content>
          <View style={styles.rowItem}>
            <RenderData
              title={'Bin Location'}
              subText={item?.binLocation?.name ?? 'Default'}
            />
            {item.quantityOnHand && (
              <RenderData
                title={'Quantity OnHand'}
                subText={item.quantityOnHand}
              />
            )}
          </View>
          <View style={styles.rowItem}>
            <RenderData
              title={'Lot Number'}
              subText={item?.inventoryItem?.lotNumber ?? 'Default'}
            />
            {item.quantityAvailable && (
              <RenderData
                title={'Quantity Available'}
                subText={item.quantityAvailable}
              />
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  render() {
    const vm = vmMapper(this.state.productDetails, this.state);
    const product = this.props.selectedProduct;
    const {visible} = this.state;
    return (
      <View
        style={{
          flexDirection: 'column',
          flex: 1,
        }}>
        <PrintModal
          visible={visible}
          closeModal={this.closeModal}
          product={product}
          type={'products'}
          defaultBarcodeLabelUrl={product?.defaultBarcodeLabelUrl}
        />
        <View style={styles.contentContainer}>
          <Refresh onRefresh={this.getProduct}>
            <View style={styles.header}>
              <View style={styles.rowItem}>
                <View style={{width: '75%'}}>
                  <Text style={styles.name}>{vm.productCode}</Text>
                  <Text style={styles.name}>{vm.name}</Text>
                </View>
                <View style={{width: '25%', alignItems: 'flex-end', flex: 1}}>
                  <Image
                    style={{width: 50, height: 50, resizeMode: 'contain'}}
                    source={{uri: vm.defaultImageUrl}}
                  />
                </View>
              </View>
            </View>
          </Refresh>
          <ScrollView>
            <Text style={styles.boxHeading}>Availability</Text>
            <Card>
              <View style={styles.container}>
                <View style={styles.row}>
                  <View style={styles.label}>
                    <Text>{'Status'}</Text>
                  </View>
                  <View style={styles.value}>
                    <Text style={styles.textAlign}>{vm.status}</Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.label}>
                    <Text>{'Quantity On Hand'}</Text>
                  </View>
                  <View style={styles.value}>
                    <Text style={styles.textAlign}>
                      {vm.quantityOnHand}
                      {vm.unitOfMeasure}
                    </Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.label}>
                    <Text>{'Quantity Available'}</Text>
                  </View>
                  <View style={styles.value}>
                    <Text style={styles.textAlign}>
                      {vm.quantityAvailable}
                      {vm.unitOfMeasure}
                    </Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.label}>
                    <Text>{'Allocated to Order'}</Text>
                  </View>
                  <View style={styles.value}>
                    <Text style={styles.textAlign}>
                      {vm.quantityAllocated}
                      {vm.unitOfMeasure}
                    </Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.label}>
                    <Text>{'On Order'}</Text>
                  </View>
                  <View style={styles.value}>
                    <Text style={styles.textAlign}>
                      {vm.quantityOnOrder}
                      {vm.unitOfMeasure}
                    </Text>
                  </View>
                </View>
              </View>
            </Card>
            <Text style={styles.boxHeading}>Details</Text>
            <Card>
              <View style={styles.container}>
                <View style={styles.row}>
                  <View style={styles.label}>
                    <Text>{'Product Code'}</Text>
                  </View>
                  <View style={styles.value}>
                    <Text style={styles.textAlign}>{vm.productCode}</Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.label}>
                    <Text>{'Category'}</Text>
                  </View>
                  <View style={styles.value}>
                    <Text style={styles.textAlign}>{vm.category.name}</Text>
                  </View>
                </View>
                {vm?.attributes?.map((item, index) => {
                  return (
                    <View key={index} style={styles.row}>
                      <Text style={styles.label}>{item.name}</Text>
                      <Text style={styles.value}>{item.value}</Text>
                    </View>
                  );
                })}
                <View style={styles.row}>
                  <View style={styles.label}>
                    <Text>{'Product Type'}</Text>
                  </View>
                  <View style={styles.value}>
                    <Text style={styles.textAlign}>{vm.productType.name}</Text>
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.label}>
                    <Text>{'Price per unit'}</Text>
                  </View>
                  <View style={styles.value}>
                    <Text style={styles.textAlign}>{vm.pricePerUnit}</Text>
                  </View>
                </View>
              </View>
            </Card>
            <Text style={styles.boxHeading}>Available Items</Text>
            <Card>
              {vm?.availableItems?.map((item, index) => {
                return this.renderListItem(item, index);
              })}
              <Button
                title={'Print Barcode Label'}
                onPress={this.handleClick}
              />
            </Card>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  selectedProduct: state.productsReducer.selectedProduct,
});
const mapDispatchToProps: DispatchProps = {
  getProductByIdAction,
  showScreenLoading,
  hideScreenLoading,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);
