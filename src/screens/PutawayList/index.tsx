/* eslint-disable complexity */
import _ from 'lodash';
import { DispatchProps, Props, State } from './types';
import React from 'react';
import { getOrdersAction } from '../../redux/actions/orders';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { connect } from 'react-redux';
import { hideScreenLoading, showScreenLoading } from '../../redux/actions/main';
import styles from './styles';
import PutAwayItems from '../../data/putaway/PutAwayItems';
import { fetchPutAwayFromOrderAction } from '../../redux/actions/putaways';
import PutAway from '../../data/putaway/PutAway';
import EmptyView from '../../components/EmptyView';
import { Card } from 'react-native-paper';
import InputBox from '../../components/InputBox';
import { LayoutStyle } from '../../assets/styles';
import { Props as LabeledDataType } from '../../components/LabeledData/types';
import DetailsTable from '../../components/DetailsTable';

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
      lpnFilter: ''
    };
    this.renderItems = this.renderItems.bind(this);
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
    this.props.navigation.setParams({ refetchPutaways: false });
    const actionCallback = (putAwayList: any) => {
      if (!putAwayList || putAwayList?.error) {
        return Promise.resolve(null);
      } else {
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
      }
      this.props.hideScreenLoading();
    };

    this.props.fetchPutAwayFromOrderAction(query, actionCallback);
  };

  goToPutawayItemDetailScreen = (putAway: PutAway, putAwayItem: PutAwayItems) => {
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
          (putaway) => putaway?.putawayItem?.['inventoryItem.lotNumber'] === text
        );

        if (exactPutaway) {
          this.setState({ lpnFilter: '', putAwayListFiltered: [] }, () =>
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

  renderItems(listRenderItemInfo: ListRenderItemInfo<any>) {
    const { putawayItem } = listRenderItemInfo.item;
    const renderItemData: LabeledDataType[] = [
      { label: 'Product Code', value: putawayItem?.['product.productCode'] },
      { label: 'Lot Number', value: putawayItem?.['inventoryItem.lotNumber'], defaultValue: 'Default' },
      { label: 'Current Location', value: putawayItem?.['currentLocation.name'], defaultValue: 'Default' },
      { label: 'Putaway Location', value: putawayItem?.['putawayLocation.name'], defaultValue: 'Default' }
    ];

    return (
      <Card
        style={LayoutStyle.listItemContainer}
        onPress={() => this.goToPutawayItemDetailScreen(listRenderItemInfo.item, listRenderItemInfo.item?.putawayItem)}
      >
        <Card.Content>
          <DetailsTable data={renderItemData} />
        </Card.Content>
      </Card>
    );
  }

  render() {
    const { showList, putAwayList, putAwayListFiltered, lpnFilter } = this.state;

    return (
      <View style={styles.screenContainer}>
        {showList && (
          <View style={styles.contentContainer}>
            {putAwayList?.length && (
              <InputBox
                style={styles.lpnFilter}
                value={lpnFilter}
                disabled={false}
                editable={false}
                label={'Scan Lot Number'}
                onChange={this.onChangeLpnFilter}
              />
            )}
            <FlatList
              data={putAwayListFiltered?.length ? putAwayListFiltered : putAwayList}
              ListEmptyComponent={
                <EmptyView title="Putaway" description="There are no items to putaway" isRefresh={false} />
              }
              renderItem={this.renderItems}
              keyExtractor={(item) => item.id}
              style={styles.list}
            />
          </View>
        )}
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
