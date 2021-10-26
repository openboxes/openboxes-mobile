import React from 'react';
import {Image, ScrollView, Text, View, Button, KeyboardAvoidingView, Platform} from 'react-native';
import styles from './styles';
import {device} from '../../constants'
import PrintModal from '../../components/PrintModal';
import {Props, State, DispatchProps} from './types';
import {vmMapper} from './VMMapper';
import {getProductByIdAction } from "../../redux/actions/products";
import {showScreenLoading, hideScreenLoading} from '../../redux/actions/main';
import {connect} from "react-redux";
import showPopup from "../../components/Popup";
import Product from '../../data/product/Product';
import {RootState} from "../../redux/reducers";

class ProductDetails extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            visible:false,
            productDetails:{},
        }
    }

    closeModal = () => {
        this.setState({visible: false})
    }

    handleClick = () => {
        const {product} = this.props.route.params
        this.props.getProductByIdAction(product.productCode, (data) => {
            this.setState({visible: true})
        })
    }


    componentDidMount() {
        const {product} = this.props.route.params
        this.getProductDetails(product.id)
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
            if (data?.error) {
                showPopup({
                    title: data.error.message
                        ? `Failed to load product details with value = "${id}"`
                        : null,
                    message:
                        data.error.message ??
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
               this.setState({productDetails:data})
            }
        };
        this.props.hideScreenLoading();
        this.props.getProductByIdAction(id, actionCallback);
    }

    render() {
        const vm = vmMapper(this.state.productDetails, this.state);
        const {visible} = this.state;
        return (
            <View
                style={{
                    flexDirection: 'column',
                    flex: 1
                }}>
                <PrintModal
                    visible={visible}
                    closeModal={this.closeModal}
                    product={vm}
                />
                <View style={styles.contentContainer}>
                    <Text style={styles.name}>{vm.name}</Text>
                    <Text style={styles.title}>{vm.productCode}</Text>
                    <Image
                        style={styles.tinyLogo}
                        source={{uri: vm.image.uri}}
                    />
                    <ScrollView>
                        <Text style={styles.boxHeading}>Availability</Text>
                        <View style={styles.container}>
                            <View style={styles.row}>
                                <View style={styles.label}>
                                    <Text>{'Status'}</Text>
                                </View>
                                <View style={styles.value}>
                                    <Text style={styles.textAlign}>
                                        {vm.status}{' '}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.label}>
                                    <Text>{'On Hand Quantity'}</Text>
                                </View>
                                <View style={styles.value}>
                                    <Text style={styles.textAlign}>
                                        {vm.quantityOnHand}{' '}
                                        {vm.unitOfMeasure}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.label}>
                                    <Text>{'Available to Promise'}</Text>
                                </View>
                                <View style={styles.value}>
                                    <Text style={styles.textAlign}>
                                        {vm.quantityAvailable}{' '}
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
                                        {vm.quantityAllocated}{' '}
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
                                        {vm.quantityOnOrder}{' '}
                                        {vm.unitOfMeasure}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <Text style={styles.boxHeading}>Details</Text>
                        <View style={styles.container}>
                            <View style={styles.row}>
                                <View style={styles.label}>
                                    <Text>{'Product Code'}</Text>
                                </View>
                                <View style={styles.value}>
                                    <Text style={styles.textAlign}>
                                        {vm.productCode}{' '}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.label}>
                                    <Text>{'Category'}</Text>
                                </View>
                                <View style={styles.value}>
                                    <Text style={styles.textAlign}>
                                        {vm.category.name}{' '}
                                    </Text>
                                </View>
                            </View>
                            {vm?.attributes?.map((item,index )=> {
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
                        <Button
                            title={'Print Barcode Label'}
                            onPress={this.handleClick}
                        />
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const mapDispatchToProps: DispatchProps = {
    getProductByIdAction,
    showScreenLoading,
    hideScreenLoading
};

export default connect(null, mapDispatchToProps)(ProductDetails);
