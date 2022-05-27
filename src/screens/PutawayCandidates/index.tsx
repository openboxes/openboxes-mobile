import React, { Component } from 'react';
import { DispatchProps, Props } from './types';
import { FlatList, Text, SafeAreaView, RefreshControl, Alert } from 'react-native';
import { RootState } from '../../redux/reducers';
import styles from './styles';
import { hideScreenLoading, showScreenLoading } from '../../redux/actions/main';
import { connect } from 'react-redux';
import { getCandidates } from '../../redux/actions/putaways';
import EmptyView from '../../components/EmptyView';
import { Card } from 'react-native-paper';
import { LayoutStyle } from '../../assets/styles';
class PutawayCandidates extends Component<Props> {
  constructor(props: Props) {
    super(props);

    this.state = {
      refreshing: false,
      updatedList: []
    };
  }

  UNSAFE_componentWillMount() {
    this.getScreenData();
  }

  componentDidUpdate() {
    if (this.props.route.params && this.props.route.params.forceRefresh) {
      this.getScreenData();
      this.props.navigation.setParams({ forceRefresh: false });
    }

    if (!this.state.refreshing) {
      const { candidates } = this.props;
      let updatedList = candidates.filter((candidate) => candidate.putawayStatus === 'READY');
      updatedList = updatedList.sort((a: any, b: any) =>
        a['currentLocation.name'].toLowerCase().localeCompare(b['currentLocation.name'].toLowerCase())
      );
      if (updatedList.length !== this.state.updatedList.length) {
        this.setState({ updatedList });
      }
    }
  }

  getScreenData = async () => {
    this.setState({ refreshing: true });
    const { currentLocation } = this.props;
    await this.props.getCandidates(currentLocation.id);
    this.setState({ refreshing: false });
  };

  renderItem = (item: any) => {
    return (
      <Card
        style={LayoutStyle.listItemContainer}
        onPress={() => {
          if (item.id) {
            Alert.alert('Item is already in a pending putaway');
          } else {
            this.props.navigation.navigate('PutawayItem', { item });
          }
        }}
      >
        <Card.Content>
          <Text>{`Status - ${item.putawayStatus}`}</Text>
          <Text>{`Product Code - ${item['product.productCode']}`}</Text>
          <Text>{`Product Name - ${item['product.name']}`}</Text>
          <Text>{`Current Location - ${item['currentLocation.name']}`}</Text>
          <Text>{`Lot Number - ${item['inventoryItem.lotNumber'] ?? 'Default'}`}</Text>
          <Text>{`Expiry Date - ${item['inventoryItem.expirationDate'] ?? 'Never'}`}</Text>
          <Text>{`Quantity - ${item.quantity}`}</Text>
        </Card.Content>
      </Card>
    );
  };

  render() {
    const { updatedList } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {updatedList.length ? (
          <FlatList
            refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.getScreenData} />}
            data={updatedList}
            renderItem={({ item }) => this.renderItem(item)}
            keyExtractor={(item, index) => index}
          />
        ) : (
          <EmptyView title="Putaway Candidates" description="There are no candidate items to Putaway" />
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  candidates: state.putawayReducer.candidates,
  currentLocation: state.mainReducer.currentLocation
});

const mapDispatchToProps: DispatchProps = {
  getCandidates,
  showScreenLoading,
  hideScreenLoading
};

export default connect(mapStateToProps, mapDispatchToProps)(PutawayCandidates);
