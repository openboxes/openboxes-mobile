import _ from 'lodash';
import React, { Component } from 'react';
import { Alert, FlatList, RefreshControl, SafeAreaView, View } from 'react-native';
import { Caption, Card, Chip, Divider, Subheading } from 'react-native-paper';
import { connect } from 'react-redux';

import { LayoutStyle } from '../../assets/styles';
import BarcodeSearchHeader from '../../components/BarcodeSearchHeader/BarcodeSearchHeader';
import Button from '../../components/Button';
import EmptyView from '../../components/EmptyView';
import { hideScreenLoading, showScreenLoading } from '../../redux/actions/main';
import { getCandidates } from '../../redux/actions/putaways';
import { RootState } from '../../redux/reducers';
import styles from './styles';
import { DispatchProps, Props, State } from './types';

class PutawayCandidates extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      refreshing: false,
      putawayCandidates: [],
      filteredPutawayCandidates: []
    };
  }

  componentDidMount() {
    this.getScreenData();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.candidates !== this.props.candidates) {
      const putawayCandidates = this.props.candidates
        .filter((candidate: any) => candidate.putawayStatus === 'READY')
        .sort((a: any, b: any) =>
          a['currentLocation.name'].toLowerCase().localeCompare(b['currentLocation.name'].toLowerCase())
        );

      this.setState({
        refreshing: false,
        putawayCandidates
      });
    }
  }

  getScreenData = async () => {
    this.setState({ refreshing: true });
    const { currentLocation } = this.props;
    await this.props.getCandidates(currentLocation.id);
  };

  renderItem = (item: any) => {
    return (
      <Card
        style={LayoutStyle.listItemContainer}
        onPress={() =>
          item.id
            ? Alert.alert('Item is already in a pending putaway')
            : this.props.navigation.navigate('PutawayItem', { item })
        }
      >
        <Card.Content>
          <View style={styles.headerRow}>
            <Chip icon="pin" style={styles.chipDefault} textStyle={styles.chipDefaultText}>
              {`Location: ${item['currentLocation.name']}`}
            </Chip>
            <Chip style={styles.chipWarning} textStyle={styles.chipWarningText}>
              {item.putawayStatus}
            </Chip>
          </View>
          <Divider style={styles.contentDivider} />

          <Subheading style={styles.destinationSubheading}>
            {`${item['product.productCode']} - ${item['product.name']}`}
          </Subheading>
          <Caption style={styles.caption}> {`Lot Number: ${item?.['inventoryItem.lotNumber'] ?? 'Default'}`}</Caption>

          <View style={styles.additionalInfoRow}>
            <Chip icon="calendar" style={styles.chipDefault} textStyle={styles.chipDefaultText}>
              {`Expiration Date: ${item['inventoryItem.expirationDate'] ?? 'Never'}`}
            </Chip>
            <Chip icon="package" style={styles.chipDefault} textStyle={styles.chipDefaultText}>
              {`Quantity: ${item.quantity}`}
            </Chip>
          </View>
        </Card.Content>
      </Card>
    );
  };

  navigateToPutawayItem = (item: any) => {
    this.props.navigation.navigate('PutawayItem', { item });
  };

  filterPutawayCandidates = (searchTerm: string) => {
    if (searchTerm) {
      const exactPutawayCandidate = _.filter(
        this.state.putawayCandidates,
        (putawayCandidate: any) =>
          putawayCandidate['inventoryItem.lotNumber']?.toLowerCase() === searchTerm.toLowerCase()
      );

      if (exactPutawayCandidate.length === 1) {
        this.resetFiltering();
        this.navigateToPutawayItem(exactPutawayCandidate[0]);
      } else {
        const filteredPutawayCandidates = _.filter(
          this.state.putawayCandidates,
          (putawayCandidate: any) =>
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
          placeholder="Search by lot number or current location"
          resetSearch={this.resetFiltering}
          searchBox={false}
          onSearchTermSubmit={this.filterPutawayCandidates}
        />
        <Button
          style={styles.refreshButton}
          size="90%"
          title="Refresh (Get Latest Data)"
          onPress={this.getScreenData}
        />
        {putawayCandidates.length ? (
          <FlatList
            refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.getScreenData} />}
            data={filteredPutawayCandidates.length > 0 ? filteredPutawayCandidates : putawayCandidates}
            renderItem={({ item }) => this.renderItem(item)}
          />
        ) : (
          <EmptyView
            title="Putaway Candidates"
            description="There are no candidate items to Putaway"
            isRefresh={false}
          />
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
