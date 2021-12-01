import React, {Component} from 'react';
import {Props} from './types';
import {
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import {RootState} from '../../redux/reducers';
import {DispatchProps} from './types';
import styles from './styles';
import {hideScreenLoading, showScreenLoading} from '../../redux/actions/main';
import {connect} from 'react-redux';
import {getCandidates} from '../../redux/actions/putaways';

class PutawayCandidates extends Component<Props> {
  constructor(props: Props) {
    super(props);

    this.state = {
      refreshing: false,
    };
  }

  UNSAFE_componentWillMount() {
    this.getScreenData();
  }

  getScreenData = async () => {
    this.setState({refreshing: true});
    const {SelectedLocation} = this.props;
    await this.props.getCandidates(SelectedLocation.id);
    this.setState({refreshing: false});
  };

  renderItem = (item: any) => {
    return (
      <TouchableOpacity
        style={styles.itemBox}
        onPress={() => {
          // if (item.id) {
          //   Alert.alert('Item is already in a pending putaway');
          // } else {
            this.props.navigation.navigate('PutawayItem', {item});
          //}
        }}>
        <Text>{`Status - ${item['putawayStatus']}`}</Text>
        <Text>{`Product Code - ${item['product.productCode']}`}</Text>
        <Text>{`Product Name - ${item['product.name']}`}</Text>
        <Text>{`Bin Location - ${item['currentLocation.name']}`}</Text>
        <Text>{`Lot Number - ${
          item['inventoryItem.lotNumber'] ?? 'Default'
        }`}</Text>
        <Text>{`Expiry Date - ${
          item['inventoryItem.expirationDate'] ?? 'Never'
        }`}</Text>
        <Text>{`Quantity - ${item['quantity']}`}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    const {candidates} = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.getScreenData}
            />
          }
          data={candidates}
          renderItem={({item}) => this.renderItem(item)}
          keyExtractor={(item, index) => index}
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  candidates: state.putawayReducer.candidates,
  SelectedLocation: state.locationsReducer.SelectedLocation,
});

const mapDispatchToProps: DispatchProps = {
  getCandidates,
  showScreenLoading,
  hideScreenLoading,
};

export default connect(mapStateToProps, mapDispatchToProps)(PutawayCandidates);
