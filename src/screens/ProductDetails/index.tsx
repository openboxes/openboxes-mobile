import React from 'react';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { Caption, Card, Chip, Divider, Button as PaperButton, Paragraph, Subheading, Title } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import Button from '../../components/Button';
import { CardSkeleton, ProductDetailsSkeleton } from '../../components/ContentSkeleton';
import EmptyView from '../../components/EmptyView';
import PrintModal from '../../components/PrintModal';
import { HYPHEN } from '../../constants';
import { resetToRoutes } from '../../NavigationService';
import { getProductByIdAction, updateProductIdentifierAction } from '../../redux/actions/products';
import { RootState } from '../../redux/reducers';
import Theme from '../../utils/Theme';
import EditBarcodeModal from './EditBarcodeModal';
import styles from './styles';
import { DispatchProps, Props, State } from './Types';
import { vmMapper } from './VMMapper';

function BackToSortationBanner() {
  const handlePress = () => {
    resetToRoutes([{ name: 'Drawer', params: { screen: 'Dashboard' } }, { name: 'Sortation' }]);
  };

  return (
    <TouchableOpacity style={styles.backToSortationBanner} onPress={handlePress}>
      <MaterialCommunityIcons name="arrow-bottom-left" size={20} color={Theme.colors.primary} />
      <Paragraph style={styles.backToSortationText}>BACK TO SORTATION</Paragraph>
    </TouchableOpacity>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card style={styles.sectionCard}>
      <Card.Title titleStyle={styles.sectionTitle} title={title} />
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
      productDetails: {},
      editBarcodeVisible: false,
      isLoading: true
    };
  }

  componentDidMount() {
    this.getProduct();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.route.params.refetchProduct && !prevProps.route.params.refetchProduct) {
      const { product } = this.props.route.params;
      this.getProductDetails(product.id);
    }
  }

  getProduct = () => {
    const { product } = this.props.route.params;
    this.getProductDetails(product.id);
  };

  getProductDetails = (id: string) => {
    this.props.navigation.setParams({ refetchProduct: false });

    if (!id) {
      Alert.alert('Error', 'Product ID is empty.');
      return;
    }

    this.setState({ isLoading: true });

    const actionCallback = (data: any) => {
      this.setState({ isLoading: false });
      if (data?.error) {
        Alert.alert('Failed to Load', data.errorMessage ?? 'Failed to load product details.', [
          { text: 'Retry', onPress: () => this.getProductDetails(id) },
          { text: 'Cancel', style: 'cancel' }
        ]);
      } else {
        this.setState({ productDetails: data });
      }
    };

    this.props.getProductByIdAction(id, actionCallback);
  };

  handlePrint = () => {
    const { product } = this.props.route.params;
    this.props.getProductByIdAction(product.id, () => {
      this.setState({ visible: true });
    });
  };

  handleSaveBarcode = (newBarcode: string, clear: () => void) => {
    const { productDetails } = this.state;
    const id = productDetails.id;
    if (!id) {
      return;
    }

    this.props.updateProductIdentifierAction(id, 'upc', newBarcode, (response: any) => {
      if (!this.state.editBarcodeVisible) {
        return;
      }
      if (response?.error) {
        Alert.alert('Error', response.errorMessage ?? 'Product identifier update failed.');
        clear();
        return;
      }
      this.setState({ editBarcodeVisible: false });
      this.getProductDetails(id);
    });
  };

  navigateToDetails = (item: any) => {
    this.props.navigation.navigate('ViewAvailableItem', {
      item,
      imageUrl: this.state.productDetails?.defaultImageUrl
    });
  };

  renderAvailableItem = (item: any, index: number) => {
    const { productSummaryConfig } = this.props;
    const showLotNumber = productSummaryConfig?.lotNumber !== false;

    return (
      <TouchableOpacity key={index} style={styles.itemView} onPress={() => this.navigateToDetails(item)}>
        <Card style={styles.cardContainer}>
          <Card.Content>
            <View style={styles.headerRow}>
              <Chip icon="pin" style={styles.chipDefault} textStyle={styles.chipText}>
                {`Bin Location: ${item?.binLocation?.name ?? 'Default'}`}
              </Chip>
            </View>
            <Divider style={styles.contentDivider} />

            <Subheading style={styles.subheading}>{item?.product?.name}</Subheading>
            {showLotNumber && <Caption>{`Lot Number: ${item?.lotNumber ?? 'Default'}`}</Caption>}

            <View style={styles.additionalInfoRow}>
              {item.quantityOnHand ? (
                <Chip icon="package-variant" style={styles.chipDefault} textStyle={styles.chipText}>
                  {`Qty On Hand: ${item.quantityOnHand}`}
                </Chip>
              ) : null}
              {item.quantityAvailable ? (
                <Chip icon="package" style={styles.chipDefault} textStyle={styles.chipText}>
                  {`Qty Available: ${item.quantityAvailable}`}
                </Chip>
              ) : null}
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  render() {
    const { isLoading, productDetails, visible, editBarcodeVisible } = this.state;
    const product = this.props.selectedProduct;
    const fromSortation = !!this.props.route?.params?.fromSortation;

    if (isLoading) {
      return (
        <View style={styles.screenContainer}>
          {fromSortation && (
            <View style={styles.header}>
              <BackToSortationBanner />
            </View>
          )}
          <ProductDetailsSkeleton />
          <View style={styles.detailsSection}>
            <CardSkeleton />
            <CardSkeleton />
          </View>
        </View>
      );
    }

    if (!productDetails?.id) {
      return (
        <View style={styles.screenContainer}>
          {fromSortation && (
            <View style={styles.header}>
              <BackToSortationBanner />
            </View>
          )}
          <View style={styles.emptyContainer}>
            <EmptyView
              isRefresh
              title="Product Not Found"
              description="Could not load product details."
              onPress={this.getProduct}
            />
          </View>
        </View>
      );
    }

    const vm = vmMapper(productDetails);
    const filteredItems =
      vm?.availableItems?.filter((item: any) => item.quantityOnHand > 0 || item.quantityAvailable > 0) ?? [];

    return (
      <View style={styles.screenContainer}>
        <PrintModal
          visible={visible}
          closeModal={() => this.setState({ visible: false })}
          product={product}
          type="products"
          defaultBarcodeLabelUrl={product?.defaultBarcodeLabelUrl}
        />
        <EditBarcodeModal
          visible={editBarcodeVisible}
          currentBarcode={productDetails?.upc}
          onClose={() => this.setState({ editBarcodeVisible: false })}
          onSave={this.handleSaveBarcode}
        />

        <ScrollView>
          <View style={styles.header}>
            {fromSortation && (
              <>
                <BackToSortationBanner />
                <Divider style={styles.contentDivider} />
              </>
            )}

            <Title style={styles.title}>{vm.productCode || HYPHEN}</Title>
            <Caption style={styles.subtitle}>{vm.name}</Caption>
            <Caption style={styles.subtitle}>{`Barcode: ${vm.upc}`}</Caption>

            <View style={styles.actionButtons}>
              <PaperButton icon="barcode" mode="contained" onPress={() => this.setState({ editBarcodeVisible: true })}>
                Edit Barcode
              </PaperButton>
              <PaperButton style={styles.fieldGap} icon="refresh" mode="contained" onPress={this.getProduct}>
                Refresh Availability
              </PaperButton>
            </View>
          </View>

          <Divider />

          <View style={styles.detailsSection}>
            <SectionCard title="Availability">
              {[
                { label: 'Status', value: vm.status },
                { label: 'Quantity On Hand', value: `${vm.quantityOnHand} ${vm.unitOfMeasure}` },
                { label: 'Quantity Available', value: `${vm.quantityAvailable} ${vm.unitOfMeasure}` }
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

            {filteredItems.length > 0 && (
              <SectionCard title={`Available Items (${filteredItems.length})`}>
                {filteredItems.map((item: any, index: number) => this.renderAvailableItem(item, index))}
              </SectionCard>
            )}

            <Button style={styles.printButton} title="Print Barcode Label" size="100%" onPress={this.handlePrint} />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  selectedProduct: state.productsReducer.selectedProduct,
  productSummaryConfig: state.settingsReducer.productSummaryConfig
});

const mapDispatchToProps: DispatchProps = {
  getProductByIdAction,
  updateProductIdentifierAction
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);
