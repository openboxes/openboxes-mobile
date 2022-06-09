import React, { Component } from 'react';
import { DispatchProps, Props, State } from './types';
import { FlatList, Text, SafeAreaView, RefreshControl, Alert } from 'react-native';
import { RootState } from '../../redux/reducers';
import styles from './styles';
import { hideScreenLoading, showScreenLoading } from '../../redux/actions/main';
import { connect } from 'react-redux';
import { getCandidates } from '../../redux/actions/putaways';
import EmptyView from '../../components/EmptyView';
import { Card } from 'react-native-paper';
import { LayoutStyle } from '../../assets/styles';
import BarcodeSearchHeader from '../../components/BarcodeSearchHeader/BarcodeSearchHeader';
import _ from 'lodash';

class PutawayCandidates extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      refreshing: false,
      putawayCandidates: [],
      filteredPutawayCandidates: []
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
      let putawayCandidates = candidates.filter((candidate: any) => candidate.putawayStatus === 'READY');
      putawayCandidates = putawayCandidates.sort((a: any, b: any) =>
        a['currentLocation.name'].toLowerCase().localeCompare(b['currentLocation.name'].toLowerCase())
      );
      if (putawayCandidates.length !== this.state.putawayCandidates.length) {
        this.setState({ putawayCandidates });
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

  naviageteToPutawayITem = (item: any) => {
    this.props.navigation.navigate('PutawayItem', { item });
  }

  filterPutawayCandidates = (searchTerm: string) => {
    if (searchTerm) {
      const exactPutawayCandidate = _.filter(
        this.state.putawayCandidates,
        (putawayCandidate: any) =>
          putawayCandidate['inventoryItem.lotNumber']?.toLowerCase() === searchTerm.toLowerCase()
      );

      if (exactPutawayCandidate.length === 1) {
        this.resetFiltering();
        this.naviageteToPutawayITem(exactPutawayCandidate[0]);
      } else {
        const filteredPutawayCandidates = _.filter(this.state.putawayCandidates, (putawayCandidate: any) =>
          putawayCandidate['inventoryItem.lotNumber']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          putawayCandidate['currentLocation.name']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          putawayCandidate['currentLocation.id']?.toLowerCase().includes(searchTerm.toLowerCase())

        );
        this.setState({
          ...this.state,
          filteredPutawayCandidates
        });
      }

      return;
    }

    this.resetFiltering();
  };

  resetFiltering = () => {
    this.setState({
      ...this.state,
      filteredPutawayCandidates: []
    });
  };

  render() {
    const { filteredPutawayCandidates, putawayCandidates } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <BarcodeSearchHeader
          autoSearch
          placeholder="Search by LPN or current location"
          resetSearch={this.resetFiltering}
          searchBox={false}
          onSearchTermSubmit={this.filterPutawayCandidates}
        />
        {putawayCandidates.length ? (
          <FlatList
            refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.getScreenData} />}
            data={filteredPutawayCandidates.length > 0 ? filteredPutawayCandidates : putawayCandidates}
            renderItem={({ item }) => this.renderItem(item)}
          />
        ) : (
          <EmptyView title="Putaway Candidates" description="There are no candidate items to Putaway" isRefresh={false} />
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
