/* eslint-disable complexity */
/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import { margin } from '../../assets/styles';
import PrintModal from '../../components/PrintModal';
import Refresh from '../../components/Refresh';
import { DispatchProps, Props, State } from './types';
import { vmMapper } from './VMMapper';
import { getProductByIdAction } from '../../redux/actions/products';
import { hideScreenLoading, showScreenLoading } from '../../redux/actions/main';
import { connect } from 'react-redux';
import showPopup from '../../components/Popup';
import { RootState } from '../../redux/reducers';
import { Card } from 'react-native-paper';
import Button from '../../components/Button';
import DetailsTable from '../../components/DetailsTable';
import { Props as LabeledDataType } from '../../components/LabeledData/types';
import { ContentContainer, ContentFooter, ContentBody, ContentHeader } from '../../components/ContentLayout';

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
        this.props.getProductByIdAction(product.id, data => {
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

    renderListItem = (item: any, index: any) => {
        const renderData: LabeledDataType[] = [
            { label: 'Bin Location', value: item?.binLocation?.name, defaultValue: 'Default' },
            { label: 'Quantity OnHand', value: item.quantityOnHand },
            { label: 'Lot Number', value: item?.inventoryItem?.lotNumber, defaultValue: 'Default' }
        ];
        if (item.quantityAvailable) {
            renderData.push({ label: 'Quantity Available', value: item.quantityAvailable });
        }

        return (<TouchableOpacity
            key={index}
            style={[margin.M3, margin.MT1]}
            onPress={() => this.navigateToDetails(item)}>
            <Card>
                <Card.Content>
                    <DetailsTable data={renderData} />
                </Card.Content>
            </Card>
        </TouchableOpacity>);
    };


    render() {
        const vm = vmMapper(this.state.productDetails, this.state);
        const product = this.props.selectedProduct;
        const { visible } = this.state;

        const entryStyles = { style: styles.entry, labelStyle: styles.entryText, valueStyle: styles.entryText  };

        const availabilityData: LabeledDataType[] = [
            { label: 'Status', value: vm.status, ...entryStyles },
            { label: 'Quantity On Hand', value: `${vm.quantityOnHand} ${vm.unitOfMeasure}`, ...entryStyles },
            { label: 'Quantity Available', value: `${vm.quantityAvailable} ${vm.unitOfMeasure}`, ...entryStyles },
            { label: 'Allocated to Order', value: `${vm.quantityAllocated} ${vm.unitOfMeasure}`, ...entryStyles },
            { label: 'On Order', value: `${vm.quantityOnOrder} ${vm.unitOfMeasure}`, ...entryStyles, style: [entryStyles.style, { marginBottom: 0 }] }
        ];

        const detailsData: LabeledDataType[] = [
            { label: 'Product Code', value: vm.productCode, ...entryStyles },
            { label: 'Category', value: vm.category.name, ...entryStyles },
            ...vm?.attributes?.map(({ name, value }) => ({
                label: name, value, ...entryStyles
            })),
            { label: 'Product Type', value: vm.productType.name, ...entryStyles },
            { label: 'Price per unit', value: vm.pricePerUnit, ...entryStyles, style: [entryStyles.style, { marginBottom: 0 }] }
        ];

        return (
            <>
                <PrintModal
                    visible={visible}
                    closeModal={this.closeModal}
                    product={product}
                    type={'products'}
                    defaultBarcodeLabelUrl={product?.defaultBarcodeLabelUrl}
                />
                <ContentContainer>
                    <ContentHeader fixed>
                        <Refresh onRefresh={this.getProduct}>
                            <View style={styles.rowItem}>
                                <View style={{ width: '75%' }}>
                                    <Text style={styles.name}>{vm.productCode}</Text>
                                    <Text style={styles.name}>{vm.name}</Text>
                                </View>
                                <View style={{ width: '25%', alignItems: 'flex-end', flex: 1 }}>
                                    <Image
                                        style={{ width: 50, height: 50, resizeMode: 'contain' }}
                                        source={{ uri: vm.defaultImageUrl }}
                                    />
                                </View>
                            </View>
                        </Refresh>
                    </ContentHeader>
                    <ContentBody>
                        <Text style={styles.boxHeading}>Availability</Text>
                        <Card>
                            <DetailsTable columns={1} data={availabilityData} />
                        </Card>
                        <Text style={styles.boxHeading}>Details</Text>
                        <Card>
                            <DetailsTable columns={1} data={detailsData} />
                        </Card>
                        <Text style={styles.boxHeading}>Available Items</Text>
                        <Card>
                            {vm?.availableItems?.map((item, index) => {
                                return this.renderListItem(item, index);
                            })}
                        </Card>
                    </ContentBody>
                    <ContentFooter>
                        <Button
                            title={'Print Barcode Label'}
                            onPress={this.handleClick}
                        />
                    </ContentFooter>
                </ContentContainer>
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
