import React from "react";
import {Image, ScrollView, StyleSheet, Text, View} from "react-native";
import {AppState} from "../../../redux/Reducer";
import {
  dispatchHideProgressBarAction as hideProgressBar,
  dispatchShowProgressBarAction as showProgressBar
} from "../../../redux/Dispatchers";
import {connect} from "react-redux";
import ScreenContainer from "../../ScreenContainer";
import Header from "../../Header";
import {DispatchProps, OwnProps, Props, StateProps} from "./Props";
import {State} from "./State";
import {vmMapper} from "./VMMapper";
import Theme from "../../../utils/Theme";

class ProductDetails extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const vm = vmMapper(this.props, this.state)
    return (
      <ScreenContainer>
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
              <View style={styles.label}><Text>{'On Hand Quantity'}</Text></View>
              <View style={styles.value}><Text style={styles.textAlign}>{vm.availability.quantityOnHand.value} {vm.availability.quantityOnHand.unitOfMeasure.code}</Text></View>
            </View>
            <View style={styles.row}>
              <View style={styles.label}><Text>{'Available to Promise'}</Text></View>
              <View style={styles.value}><Text style={styles.textAlign}>{vm.availability.quantityAvailableToPromise.value} {vm.availability.quantityAvailableToPromise.unitOfMeasure.code}</Text></View>
            </View>
            <View style={styles.row}>
              <View style={styles.label}><Text>{'Allocated to Order'}</Text></View>
              <View style={styles.value}><Text style={styles.textAlign}>{vm.availability.quantityAllocated.value} {vm.availability.quantityAllocated.unitOfMeasure.code}</Text></View>
            </View>
            <View style={styles.row}>
              <View style={styles.label}><Text>{'On Order'}</Text></View>
              <View style={styles.value}><Text style={styles.textAlign}>{vm.availability.quantityOnOrder.value} {vm.availability.quantityOnOrder.unitOfMeasure.code}</Text></View>
            </View>
          </View>

          <Text style={styles.boxHeading}>Details</Text>
          <View style={styles.container}>
            <View style={styles.row}>
              <View style={styles.label}><Text>{'Product Code'}</Text></View>
              <View style={styles.value}><Text style={styles.textAlign}>{vm.productCode} {vm.availability.quantityOnHand.unitOfMeasure.code}</Text></View>
            </View>
            <View style={styles.row}>
              <View style={styles.label}><Text>{'Category'}</Text></View>
              <View style={styles.value}><Text style={styles.textAlign}>{vm.category.name} {vm.availability.quantityAvailableToPromise.unitOfMeasure.code}</Text></View>
            </View>
            {
              vm.attributes.map(item => {
                return (
                  <View key={item.code} style={styles.row}>
                    <Text style={styles.label}>{item.name}</Text>
                    <Text style={styles.value}>{item.value}</Text>
                  </View>
                )
              })
            }
            <View style={styles.row}>
              <View style={styles.label}><Text>{'Product Type'}</Text></View>
              <View style={styles.value}><Text style={styles.textAlign}>{vm.productType.name}</Text></View>
            </View>
            <View style={styles.row}>
              <View style={styles.label}><Text>{'Price per unit'}</Text></View>
              <View style={styles.value}><Text style={styles.textAlign}>{vm.pricePerUnit}</Text></View>
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
      </ScreenContainer>
    )
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    padding: 8
  },
  name: {
    fontSize: 17,
    color: Theme.colors.text,
    fontWeight: "bold"
  },
  boxHeading: {
    fontSize: 15,
    color: Theme.colors.text,
    fontWeight: "bold",
    marginTop: 8
  },
  box: {
    borderColor: Theme.colors.onBackground,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
    padding: 8
  },
  descriptionLabel: {
    fontSize: 20,
    color: Theme.colors.text,
    fontWeight: "bold",
    marginTop: 8
  },
  descriptionText: {
    fontSize: 16,
    color: Theme.colors.text,
    borderColor: Theme.colors.onBackground,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
    padding: 8
  },
  detailsLabel: {
    fontSize: 20,
    color: Theme.colors.text,
    fontWeight: "bold",
    marginTop: 8
  },
  detailsContainer: {
    padding: 8,
    borderColor: Theme.colors.onBackground,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8
  },
  detailsItemContainer: {
    display: "flex",
    flexDirection: "row",
    flex: 0
  },
  detailsItemName: {
    fontSize: 16,
    color: Theme.colors.text,
    fontWeight: "bold"
  },
  detailsItemValue: {
    fontSize: 16,
    color: Theme.colors.text,
    marginStart: 8
  },
  container: {
    flexWrap: 'wrap',
    alignItems: 'flex-start', // if you want to fill rows left to right
    borderColor: Theme.colors.onBackground,
    borderWidth: 1,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    borderColor: Theme.colors.onBackground,
    borderBottomWidth: 1,
    marginTop: 8,
    padding: 8,
    width: '100%'
  },
  label: {
    width: '50%', // is 50% of container width
  },
  value: {
    width: '50%', // is 50% of container width
    textAlign: "right"
  },
  textAlign: {
    textAlign: "right"
  },
  tinyLogo: {
    width: '100%',
    height: '20%',
  },
  logo: {
    width: 66,
    height: 58,
  }
})

const mapStateToProps = (state: AppState): StateProps => ({})

const mapDispatchToProps: DispatchProps = {
  showProgressBar,
  hideProgressBar
}

export default connect<StateProps, DispatchProps, OwnProps, AppState>(mapStateToProps, mapDispatchToProps)(ProductDetails)
