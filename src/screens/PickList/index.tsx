import React from 'react';
import {State, DispatchProps, Props} from './types';
import styles from './styles';
import Header from '../../components/Header';
import {Text, TextInput, View} from 'react-native';
import {pickListVMMapper} from './PickListVMMapper';
import {showScreenLoading, hideScreenLoading} from '../../redux/actions/main';
import {connect} from 'react-redux';

class PickOrderItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
      pickListItem: null,
      order: null,
    };
  }

  render() {
    const vm = pickListVMMapper(this.props.route.params, this.state);
    console.log(333333, this.props.route.params)
    return (
      <View style={styles.screenContainer}>
        <Header
          title={vm.header}
          backButtonVisible={true}
          // onBackButtonPress={this.props.exit}
        />
        <View style={styles.contentContainer}>
          <Text style={styles.name}>{vm.picklistItems.product.name}</Text>
          <View style={styles.row}>
            <View style={styles.col50}>
              <Text style={styles.label}>Product Code</Text>
              <Text style={styles.value}>{vm.picklistItems.productCode}</Text>
            </View>
            <View style={styles.col50}>
              <Text style={styles.label}>Product Name</Text>
              <Text style={styles.value}>{vm.picklistItems.product.name}</Text>
            </View>
          </View>
          <View style={styles.row} />
          <View style={styles.row}>
            <View style={styles.col50}>
              <Text style={styles.label}>Qty Required</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Qty Required"
                value={vm.picklistItems.quantityRequired.toString()}
              />
              {/*<Text style={styles.value}>{vm.picklistItems.quantityRequired}</Text>*/}
            </View>
            <View style={styles.col50}>
              <Text style={styles.label}>Qty Picked</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Qty Picked"
                value={vm.picklistItems.quantityPicked.toString()}
              />
              {/*<Text style={styles.value}>{vm.picklistItems.quantityPicked}</Text>*/}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const mapDispatchToProps: DispatchProps = {
  showScreenLoading,
  hideScreenLoading,
};
export default connect(null, mapDispatchToProps)(PickOrderItem);
