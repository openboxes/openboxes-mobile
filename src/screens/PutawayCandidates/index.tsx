import _ from 'lodash';
import React, { Component } from 'react';
import { Alert, FlatList, RefreshControl, SafeAreaView, View } from 'react-native';
import { Caption, Card, Chip, Divider, Subheading } from 'react-native-paper';
import { connect } from 'react-redux';

import { LayoutStyle } from '../../assets/styles';
import BarcodeSearchHeader from '../../components/BarcodeSearchHeader/BarcodeSearchHeader';
import Button from '../../components/Button';
import EmptyView from '../../components/EmptyView';
import ListLoadingSkeleton from '../../components/ListLoadingSkeleton';
import showPopup from '../../components/Popup';
import { getCandidates } from '../../redux/actions/putaways';
import { RootState } from '../../redux/reducers';
import { emptyStateMessage } from '../../utils/emptyStateMessage';
import PutawayCandidateCardSkeleton from './PutawayCandidateCardSkeleton';
import styles from './styles';
import { DispatchProps, Props, State } from './types';

class PutawayCandidates extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      refreshing: false,
      putawayCandidates: [],
      filteredPutawayCandidates: [],
      initialLoading: true,
      searchTerm: ''
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
        initialLoading: false,
        putawayCandidates
      });
    }
  }

  getScreenData = async () => {
    this.setState({ refreshing: true });
    const { currentLocation } = this.props;
    this.props.getCandidates(
      currentLocation.id,
      (data: any) => {
        if (data?.error) {
          this.setState({ refreshing: false, initialLoading: false });
          showPopup({
            title: 'Putaway Candidates',
            message: data.errorMessage ?? 'Failed to load putaway candidates',
            positiveButton: {
              text: 'Retry',
              callback: () => this.getScreenData()
            },
            negativeButtonText: 'Cancel'
          });
        }
      },
      true
    );
  };

  renderItem = (item: any) => {
    const { productSummaryConfig } = this.props;
    const showLotNumber = productSummaryConfig?.lotNumber !== false;
    const showExpirationDate = productSummaryConfig?.expirationDate !== false;

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
          {showLotNumber && (
            <Caption style={styles.caption}> {`Lot Number: ${item?.['inventoryItem.lotNumber'] ?? 'Default'}`}</Caption>
          )}

          <View style={styles.additionalInfoRow}>
            {showExpirationDate && (
              <Chip icon="calendar" style={styles.chipDefault} textStyle={styles.chipDefaultText}>
                {`Expiration Date: ${item['inventoryItem.expirationDate'] ?? 'Never'}`}
              </Chip>
            )}
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

  filterPutawayCandidates = (query: string) => {
    this.setState({ searchTerm: query });
    if (query) {
      const exactPutawayCandidate = _.filter(
        this.state.putawayCandidates,
        (putawayCandidate: any) => putawayCandidate['inventoryItem.lotNumber']?.toLowerCase() === query.toLowerCase()
      );

      if (exactPutawayCandidate.length === 1) {
        this.resetFiltering();
        this.navigateToPutawayItem(exactPutawayCandidate[0]);
      } else {
        const filteredPutawayCandidates = _.filter(
          this.state.putawayCandidates,
          (putawayCandidate: any) =>
            putawayCandidate['inventoryItem.lotNumber']?.toLowerCase().includes(query.toLowerCase()) ||
            putawayCandidate['currentLocation.name']?.toLowerCase().includes(query.toLowerCase()) ||
            putawayCandidate['currentLocation.id']?.toLowerCase().includes(query.toLowerCase())
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
      searchTerm: '',
      filteredPutawayCandidates: []
    });
  };

  render() {
    const { filteredPutawayCandidates, putawayCandidates, initialLoading, refreshing, searchTerm } = this.state;
    const visibleData = filteredPutawayCandidates.length > 0 ? filteredPutawayCandidates : putawayCandidates;
    return (
      <SafeAreaView style={styles.container}>
        <BarcodeSearchHeader
          autoSearch
          placeholder="Search by lot number or current location"
          resetSearch={this.resetFiltering}
          searchBox={false}
          loading={initialLoading || refreshing}
          accessibilityLabel="Search putaway candidates"
          onSearchTermSubmit={this.filterPutawayCandidates}
        />
        <Button
          style={styles.refreshButton}
          size="90%"
          title="Refresh (Get Latest Data)"
          onPress={this.getScreenData}
        />
        {initialLoading ? (
          <ListLoadingSkeleton visible count={6} CardComponent={PutawayCandidateCardSkeleton} />
        ) : (
          <FlatList
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.getScreenData} />}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            data={visibleData}
            renderItem={({ item }) => this.renderItem(item)}
            ListEmptyComponent={
              <EmptyView
                title="Putaway Candidates"
                description={emptyStateMessage('candidates', searchTerm, 'There are no candidate items to Putaway')}
                isRefresh={false}
              />
            }
          />
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  candidates: state.putawayReducer.candidates,
  currentLocation: state.mainReducer.currentLocation,
  productSummaryConfig: state.settingsReducer.productSummaryConfig
});

const mapDispatchToProps: DispatchProps = {
  getCandidates
};

export default connect(mapStateToProps, mapDispatchToProps)(PutawayCandidates);
