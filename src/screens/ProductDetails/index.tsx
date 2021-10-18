import React from 'react';
import {Image, ScrollView, Text, View, Button, KeyboardAvoidingView, Platform} from 'react-native';
import styles from './styles';
import {device} from '../../constants'
import PrintModal from '../../components/PrintModal';
import {Props, State, DispatchProps} from './types';
import {vmMapper} from './VMMapper';
import {getProductByIdAction} from "../../redux/actions/products";
import {connect} from "react-redux";

class ProductDetails extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            visible: false
        }
    }

    closeModal =()=>{
        this.setState({visible:false})
    }

    handleClick =()=>{
        const {product} = this.props.route.params
        this.props.getProductByIdAction(product.productCode, (data)=>{
            // console.log(3333, data)
            this.setState({visible:true})
        })

    }



    render() {
        const vm = vmMapper(this.props.route.params, this.state);
        const {visible} = this.state;
        return (
            <View
                style={{
                    flexDirection: 'column',
                    flex:1
                }}>
                <PrintModal
                    visible={visible}
                    closeModal={this.closeModal}
                    id={vm.productCode}
                />
                <View style={styles.contentContainer}>
                    <Text style={styles.name}>{vm.name}</Text>
                    <Image
                        style={styles.tinyLogo}
                        source={{
                            uri: 'https://reactnative.dev/img/tiny_logo.png',
                        }}
                    />
                    <ScrollView>
                        <Text style={styles.boxHeading}>Status</Text>
                        <View style={styles.container}>
                            <View style={styles.row}>
                                <View style={styles.label}>
                                    <Text>{'On Hand Quantity'}</Text>
                                </View>
                                <View style={styles.value}>
                                    <Text style={styles.textAlign}>
                                        {vm.availability.quantityOnHand.value}{' '}
                                        {vm.availability.quantityOnHand.unitOfMeasure.code}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.label}>
                                    <Text>{'Available to Promise'}</Text>
                                </View>
                                <View style={styles.value}>
                                    <Text style={styles.textAlign}>
                                        {vm.availability.quantityAvailableToPromise.value}{' '}
                                        {
                                            vm.availability.quantityAvailableToPromise.unitOfMeasure
                                                .code
                                        }
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.label}>
                                    <Text>{'Allocated to Order'}</Text>
                                </View>
                                <View style={styles.value}>
                                    <Text style={styles.textAlign}>
                                        {vm.availability.quantityAllocated.value}{' '}
                                        {vm.availability.quantityAllocated.unitOfMeasure.code}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.label}>
                                    <Text>{'On Order'}</Text>
                                </View>
                                <View style={styles.value}>
                                    <Text style={styles.textAlign}>
                                        {vm.availability.quantityOnOrder.value}{' '}
                                        {vm.availability.quantityOnOrder.unitOfMeasure.code}
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
                                        {vm.availability.quantityOnHand.unitOfMeasure.code}
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
                                        {
                                            vm.availability.quantityAvailableToPromise.unitOfMeasure
                                                .code
                                        }
                                    </Text>
                                </View>
                            </View>
                            {vm.attributes.map(item => {
                                return (
                                    <View key={`${item.code}`} style={styles.row}>
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
};

export default connect(null, mapDispatchToProps)(ProductDetails);
