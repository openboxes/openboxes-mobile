/* eslint-disable complexity */
import _ from 'lodash';
import React from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { Caption, Card, Chip, Divider, Subheading } from 'react-native-paper';
import { connect } from 'react-redux';

import { LayoutStyle } from '../../assets/styles';
import EmptyView from '../../components/EmptyView';
import InputBox from '../../components/InputBox';
import ListLoadingSkeleton from '../../components/ListLoadingSkeleton';
import { HYPHEN } from '../../constants';
import PutAway from '../../data/putaway/PutAway';
import PutAwayItems from '../../data/putaway/PutAwayItems';
import { getOrdersAction } from '../../redux/actions/orders';
import { fetchPutAwayFromOrderAction } from '../../redux/actions/putaways';
import { RootState } from '../../redux/reducers';
import { emptyStateMessage } from '../../utils/emptyStateMessage';
import PutawayItemCardSkeleton from './PutawayItemCardSkeleton';
import styles from './styles';
import { DispatchProps, Props, State } from './types';

class PutawayList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
      putAwayList: null,
      putAwayListFiltered: null,
      putAway: null,
      orderId: null,
      showList: false,
      showDetail: false,
      lpnFilter: '',
      loading: true,
      searchTerm: ''
    };
  }

  componentDidMount() {
    this.fetchPutAways(null);
  }

  componentDidUpdate() {
    // @ts-ignore
    if (this.props?.route?.params?.refetchPutaways) {
      this.fetchPutAways(null);
    }
  }

  fetchPutAways = (query: any) => {
    this.props.navigation.setParams({ refetchPutaways: false });
    this.setState({ loading: true });
    const actionCallback = (putAwayList: any) => {
      this.setState({ loading: false });
      if (!putAwayList || putAwayList?.error) {
        this.setState({ showList: true, putAwayList: [] });
        return Promise.resolve(null);
      }
      this.setState({
        showList: true,
        putAwayList: _.flatten(
          _.map(putAwayList, (putaway) =>
            _.map(putaway.putawayItems, (item) => ({
              ...putaway,
              putawayItem: {
                ...item
              }
            }))
          )
        ),
        putAway: null
      });
    };

    this.props.fetchPutAwayFromOrderAction(query, actionCallback, true);
  };

  goToPutawayItemDetailScreen = (putAway: PutAway, putAwayItem: PutAwayItems) => {
    this.props.navigation.navigate('PutawayItemDetail', {
      putAway: putAway,
      putAwayItem: putAwayItem
    });
  };

  onChangeLpnFilter = (text: string) => {
    this.setState({ lpnFilter: text, searchTerm: text }, () => {
      if (text) {
        const exactPutaway = _.find(
          this.state.putAwayList,
          (putaway) => putaway?.putawayItem?.['inventoryItem.lotNumber'] === text
        );

        if (exactPutaway) {
          this.setState({ lpnFilter: '', searchTerm: '', putAwayListFiltered: [] }, () =>
            this.goToPutawayItemDetailScreen(exactPutaway, exactPutaway.putawayItem)
          );
        } else {
          const putAwayListFiltered = _.filter(this.state.putAwayList, (putaway) =>
            putaway?.putawayItem?.['inventoryItem.lotNumber']?.includes(text)
          );
          this.setState({ putAwayListFiltered: putAwayListFiltered });
        }
      } else {
        this.setState({ putAwayListFiltered: [] });
      }
    });
  };

  render() {
    const { showList, putAwayList, putAwayListFiltered, lpnFilter, loading, searchTerm } = this.state;
    const { productSummaryConfig } = this.props;
    const showLotNumber = productSummaryConfig?.lotNumber !== false;
    const visibleData = putAwayListFiltered?.length ? putAwayListFiltered : putAwayList;

    return (
      <View style={styles.screenContainer}>
        {loading ? (
          <ListLoadingSkeleton visible count={5} CardComponent={PutawayItemCardSkeleton} />
        ) : showList ? (
          <View style={styles.contentContainer}>
            <View style={styles.headerContainer}>
              {putAwayList?.length ? (
                <InputBox
                  style={styles.lpnFilter}
                  value={lpnFilter}
                  disabled={false}
                  editable={false}
                  label={'Scan Lot Number'}
                  onChange={this.onChangeLpnFilter}
                />
              ) : null}
            </View>
            <Divider />
            <FlatList
              data={visibleData}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              ListEmptyComponent={
                <EmptyView
                  title="Putaway"
                  description={emptyStateMessage('items', searchTerm, 'There are no items to putaway')}
                  isRefresh={false}
                />
              }
              renderItem={(listRenderItemInfo: ListRenderItemInfo<any>) => (
                <Card
                  style={LayoutStyle.listItemContainer}
                  onPress={() =>
                    this.goToPutawayItemDetailScreen(listRenderItemInfo.item, listRenderItemInfo.item?.putawayItem)
                  }
                >
                  <Card.Content>
                    <View style={styles.headerRow}>
                      <Chip icon="pin" style={styles.chipDefault} textStyle={styles.chipDefaultText}>
                        {`Location: ${listRenderItemInfo.item?.putawayItem?.['currentLocation.name']}`}
                      </Chip>
                    </View>
                    <Divider style={styles.contentDivider} />

                    <Subheading style={styles.destinationSubheading}>
                      {`${listRenderItemInfo.item?.putawayItem?.['product.productCode']} - ${listRenderItemInfo.item?.putawayItem?.['product.name']}`}
                    </Subheading>
                    {showLotNumber && (
                      <Caption style={styles.caption}>
                        {`Lot Number: ${
                          listRenderItemInfo.item?.putawayItem?.['inventoryItem.lotNumber'] ?? 'Default'
                        }`}
                      </Caption>
                    )}

                    <View style={styles.rowItem}>
                      <Chip icon="truck" style={styles.chipDefault} textStyle={styles.chipDefaultText}>
                        {`Putaway Location: ${
                          listRenderItemInfo.item?.putawayItem?.['putawayLocation.name'] ?? HYPHEN
                        }`}
                      </Chip>
                    </View>
                  </Card.Content>
                </Card>
              )}
              keyExtractor={(item) => item.id}
              style={styles.list}
            />
          </View>
        ) : null}
      </View>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  productSummaryConfig: state.settingsReducer.productSummaryConfig
});

const mapDispatchToProps: DispatchProps = {
  getOrdersAction,
  fetchPutAwayFromOrderAction
};

export default connect(mapStateToProps, mapDispatchToProps)(PutawayList);
