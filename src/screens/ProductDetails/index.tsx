import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Card, Chip, Divider, Paragraph, Subheading } from 'react-native-paper';
import { connect } from 'react-redux';

import Button from '../../components/Button';
import showPopup from '../../components/Popup';
import PrintModal from '../../components/PrintModal';
import { HYPHEN } from '../../constants';
import { hideScreenLoading, showScreenLoading } from '../../redux/actions/main';
import { getProductByIdAction } from '../../redux/actions/products';
import { RootState } from '../../redux/reducers';
import styles from './styles';
import { DispatchProps, Props, State } from './Types';
import { vmMapper } from './VMMapper';

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card style={styles.sectionCard}>
      <Card.Title titleStyle={styles.title} title={title} />
      <Card.Content>{children}</Card.Content>
    </Card>
  );
}

function RowDetail({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Paragraph>{label}</Paragraph>
      <Chip style={styles.chipDefault} textStyle={styles.chipText}>
        {value}
      </Chip>
    </View>
  );
}

class ProductDetails extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      visible: false,
      productDetails: {}
    };
  }

  getProduct = () => {
    const { product } = this.props.route.params;
    this.getProductDetails(product.id);
  };

  closeModal = () => {
    this.setState({ visible: false });
  };

  handleClick = () => {
    const { product } = this.props.route.params;
    this.props.getProductByIdAction(product.id, (data) => {
      this.setState({ visible: true });
    });
  };

  componentDidMount() {
    this.getProduct();
  }

  componentDidUpdate() {
    if (this.props.route.params.refetchProduct) {
      const { product } = this.props.route.params;
      this.getProductDetails(product.id);
    }
  }

  getProductDetails(id: string) {
    this.props.navigation.setParams({ refetchProduct: false });
    this.props.showScreenLoading('');
    if (!id) {
      showPopup({
        message: 'Product id is empty',
        positiveButton: { text: 'Ok' }
      });
      return;
    }

    const actionCallback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.errorMessage ? `Failed to load product details with value = "${id}"` : null,
          message: data.errorMessage ?? `Failed to load product details with value = "${id}"`,
          positiveButton: {
            text: 'Retry',
            callback: () => {
              this.props.getProductByIdAction(id, actionCallback);
            }
          },
          negativeButtonText: 'Cancel'
        });
      } else {
        this.setState({ productDetails: data });
      }
    };
    this.props.hideScreenLoading();
    this.props.getProductByIdAction(id, actionCallback);
  }

  navigateToDetails = (item: any) => {
    this.props.navigation.navigate('ViewAvailableItem', {
      item,
      imageUrl: this.state.productDetails?.defaultImageUrl
    });
  };

  renderListItem = (item: any, index: any) => (
    <TouchableOpacity key={index} style={styles.itemView} onPress={() => this.navigateToDetails(item)}>
      <Card style={styles.cardContainer}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Chip icon="pin" style={styles.chipDefault} textStyle={styles.chipText}>
              {`Bin Location: ${item?.binLocation?.name ?? 'Default'}`}
            </Chip>
          </View>
          <Divider style={styles.contentDivider} />

          <Subheading style={styles.subheading}> {`Lot Number: ${item?.lotNumber || 'Default'}`} </Subheading>
          <View style={styles.additionalInfoRow}>
            {item.quantityOnHand ? (
              <Chip icon="package-variant" style={styles.chipDefault} textStyle={styles.chipText}>
                {`Qty On Hand: ${item.quantityOnHand}`}
              </Chip>
            ) : null}
            {item.quantityAvailable ? (
              <Chip icon="thumb-up" style={styles.chipDefault} textStyle={styles.chipText}>
                {`Qty Available: ${item.quantityAvailable}`}
              </Chip>
            ) : null}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  render() {
    const vm = vmMapper(this.state.productDetails, this.state);
    const product = this.props.selectedProduct;
    const { visible } = this.state;
    const filteredItems =
      vm?.availableItems?.filter((item) => item.quantityOnHand > 0 || item.quantityAvailable > 0) ?? [];

    return (
      <>
        <PrintModal
          visible={visible}
          closeModal={this.closeModal}
          product={product}
          type={'products'}
          defaultBarcodeLabelUrl={product?.defaultBarcodeLabelUrl}
        />
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <Chip icon="barcode" style={styles.chipDefault} textStyle={styles.chipText}>
                {vm.productCode}
              </Chip>
            </View>

            <Divider style={styles.contentDivider} />

            <Subheading style={styles.name}>{vm.name}</Subheading>

            <View style={styles.additionalInfoRow}>
              <Chip icon="package" style={styles.chipDefault} textStyle={styles.chipText}>
                {`Items Available: ${filteredItems.length}`}
              </Chip>
            </View>

            <Button
              style={styles.refreshButton}
              size="100%"
              title="Refresh (Get Latest Stock)"
              onPress={this.getProduct}
            />
          </View>
          <Divider />
          <ScrollView style={styles.detailsSection}>
            <SectionCard title="Availability">
              {[
                { label: 'Status', value: vm.status },
                { label: 'Quantity On Hand', value: `${vm.quantityOnHand} ${vm.unitOfMeasure}` },
                { label: 'Quantity Available', value: `${vm.quantityAvailable} ${vm.unitOfMeasure}` },
                { label: 'Allocated To Order', value: `${vm.quantityAllocated} ${vm.unitOfMeasure}` },
                { label: 'On Order', value: `${vm.quantityOnOrder} ${vm.unitOfMeasure}` }
              ].map((item) => (
                <RowDetail key={item.label} label={item.label} value={item.value} />
              ))}
            </SectionCard>

            <SectionCard title="Details">
              {[
                { label: 'Product Code', value: vm.productCode || HYPHEN },
                { label: 'Category', value: vm.category.name || HYPHEN },
                { label: 'Product Type', value: vm.productType.name || 'Default' },
                { label: 'Price Per Unit', value: String(vm.pricePerUnit) || HYPHEN }
              ].map((item) => (
                <RowDetail key={item.label} label={item.label} value={item.value} />
              ))}
            </SectionCard>

            {filteredItems.length > 0 ? (
              <SectionCard title="Available Items">
                {filteredItems.map((item, index) => {
                  return this.renderListItem(item, index);
                })}
              </SectionCard>
            ) : null}
            <Button style={styles.printButton} title={'Print Barcode Label'} size="100%" onPress={this.handleClick} />
          </ScrollView>
        </View>
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  selectedProduct: state.productsReducer.selectedProduct
});
const mapDispatchToProps: DispatchProps = {
  getProductByIdAction,
  showScreenLoading,
  hideScreenLoading
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);
