/* eslint-disable complexity */
import _ from 'lodash';
import { DispatchProps, Props, State } from './types';
import React from 'react';
import { getOrdersAction } from '../../redux/actions/orders';
import {
  FlatList,
  ListRenderItemInfo,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { connect } from 'react-redux';
import { hideScreenLoading, showScreenLoading } from '../../redux/actions/main';
import styles from './styles';
import PutAwayItems from '../../data/putaway/PutAwayItems';
import { fetchPutAwayFromOrderAction } from '../../redux/actions/putaways';
import PutAway from '../../data/putaway/PutAway';
import EmptyView from '../../components/EmptyView';
import { Card } from 'react-native-paper';
import InputBox from '../../components/InputBox';

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
    };
  }

  componentDidMount() {
    this.fetchPutAways(null);
  }

  componentDidUpdate() {
    // @ts-ignore
    if (this.props.route.params.refetchPutaways) {
      this.fetchPutAways(null);
    }
  }

  fetchPutAways = (query: any) => {
    this.props.navigation.setParams({ refetchPutaways : false });
    const actionCallback = (putAwayList: any) => {
      if (!putAwayList || putAwayList?.error) {
        return Promise.resolve(null);
      } else {
        this.setState({
          showList: true,
          putAwayList: _.flatten(
            _.map(putAwayList, putaway => _.map(putaway.putawayItems, item => ({
              ...putaway,
              putawayItem: {
                ...item
              },
            })))),
          putAway: null
        });
      }
      this.props.hideScreenLoading();
    };

    this.props.fetchPutAwayFromOrderAction(query, actionCallback);
  };

  goToPutawayItemDetailScreen = (
    putAway: PutAway,
    putAwayItem: PutAwayItems
  ) => {
    this.props.navigation.navigate('PutawayItemDetail', {
      putAway: putAway,
      putAwayItem: putAwayItem
    });
  };

  onChangeLpnFilter = (text: string) => {
    this.setState({ lpnFilter: text }, () => {
      if (text) {
        const exactPutaway = _.find(
          this.state.putAwayList,
          putaway => putaway?.putawayItem?.['inventoryItem.lotNumber'] === text,
          );

        if (exactPutaway) {
          this.setState(
            { lpnFilter: '', putAwayListFiltered: [] },
            () => this.goToPutawayItemDetailScreen(exactPutaway, exactPutaway.putawayItem),
          );
        } else {
          const putAwayListFiltered = _.filter(
            this.state.putAwayList,
            putaway => putaway?.putawayItem?.['inventoryItem.lotNumber']?.includes(text),
          );
          this.setState({ putAwayListFiltered: putAwayListFiltered });
        }
      } else {
        this.setState({ putAwayListFiltered: [] });
      }
    });
  };

  render() {
    const { showList, putAwayList, putAwayListFiltered, lpnFilter } = this.state;

    return (
      <View style={styles.screenContainer}>
        {showList ? (
          <View style={styles.contentContainer}>
            {putAwayList?.length ? (
              <InputBox
                style={styles.lpnFilter}
                value={lpnFilter}
                disabled={false}
                editable={false}
                label={'Scan Lot Number'}
                onChange={this.onChangeLpnFilter}
              />) : null}
            <FlatList
              data={putAwayListFiltered?.length ? putAwayListFiltered : putAwayList}
              ListEmptyComponent={
                <EmptyView
                  title="Putaway"
                  description="There are no items to putaway"
                  isRefresh={false}
                />
              }
              renderItem={(listRenderItemInfo: ListRenderItemInfo<any>) => (
                <TouchableOpacity
                  style={styles.listItemContainer}
                  onPress={() => this.goToPutawayItemDetailScreen(listRenderItemInfo.item, listRenderItemInfo.item?.putawayItem)}
                >
                  <Card>
                    <Card.Content>
                      <View style={styles.row}>
                        <View style={styles.col50}>
                          <Text style={styles.label}>Product Code</Text>
                          <Text style={styles.value}>
                            {listRenderItemInfo.item?.putawayItem?.['product.productCode']}
                          </Text>
                        </View>
                        <View style={styles.col50}>
                          <Text style={styles.label}>Lot Number</Text>
                          <Text style={styles.value}>
                            {listRenderItemInfo.item?.putawayItem?.['inventoryItem.lotNumber'] || 'Default'}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.row}>
                        <View style={styles.col50}>
                          <Text style={styles.label}>Current Location</Text>
                          <Text style={styles.value}>
                            {listRenderItemInfo.item?.putawayItem?.['currentLocation.name']}
                          </Text>
                        </View>
                        <View style={styles.col50}>
                          <Text style={styles.label}>Putaway Location</Text>
                          <Text style={styles.value}>
                            {listRenderItemInfo.item?.putawayItem?.['putawayLocation.name']}
                          </Text>
                        </View>
                      </View>
                    </Card.Content>
                  </Card>
                </TouchableOpacity>
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

const mapDispatchToProps: DispatchProps = {
  showScreenLoading,
  hideScreenLoading,
  getOrdersAction,
  fetchPutAwayFromOrderAction
};
export default connect(null, mapDispatchToProps)(PutawayList);
