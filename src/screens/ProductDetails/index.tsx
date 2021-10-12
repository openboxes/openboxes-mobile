import React from 'react';
import {Image, ScrollView, Text, View} from 'react-native';
import styles from './styles';
import Header from '../../components/Header';
import {Props, State} from './Types';
import {vmMapper} from './VMMapper';

class ProductDetails extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    console.log(3333333333,this.props.route.params)
    const vm = vmMapper(this.props.route.params, this.state);
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}>
        <Header
          title={vm.header}
          backButtonVisible={true}
          onBackButtonPress={this.props.exit}
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
          </ScrollView>
          {/*<Text style={styles.descriptionText}>{vm.description}</Text>
          <Text style={styles.descriptionLabel}>Description</Text>
          <Text style={styles.descriptionText}>{vm.description}</Text>
          <Text style={styles.detailsLabel}>Details</Text>
          <View style={styles.detailsContainer}>
            {
              vm.details.map(item => {
                return (
                  <View key={item.key} style={styles.detailsItemContainer}>
                    <Text style={styles.detailsItemName}>{item.name}</Text>
                    <Text style={styles.detailsItemValue}>{item.value}</Text>
                  </View>
                )
              })
            }
          </View>*/}
        </View>
      </View>
    );
  }
}

export default ProductDetails;
