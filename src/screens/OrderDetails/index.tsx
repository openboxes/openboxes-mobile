import React from 'react';
import styles from './styles';
import { showScreenLoading, hideScreenLoading } from '../../redux/actions/main';
import { connect } from 'react-redux';
import { orderDetailsVMMapper } from './OrderDetailsVMMapper';
import Header from '../../components/Header';
import { FlatList, ListRenderItemInfo, Text, View } from 'react-native';
import { Item } from '../../data/picklist/Item';
import { getPickListAction } from '../../redux/actions/orders';
import { State, DispatchProps, Props } from './types';
import PickListItem from './PickListItem';
import { PicklistItem } from '../../data/picklist/PicklistItem';

class OrderDetails extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      pickList: null,
      error: null,
      pickListItems: []
    };
  }

  componentDidMount() {
    const { order } = this.props.route.params;
    const actionCallback = (data: any) => {
      if (data?.length == 0) {
        this.setState({
          pickList: data,
          error: 'No Picklist found',
          pickListItems: data
        });
      } else {
        this.setState({
          pickList: data,
          error: null,
          pickListItems: data ? data : []
        });
      }
    };
    this.props.getPickListAction(order?.picklist?.id, actionCallback);
  }

  onItemTapped = (item: PicklistItem, index: number) => {
    const { order } = this.props.route.params;
    this.props.navigation.navigate('PickOrderItem', {
      order,
      pickListItem: item,
      selectedPinkItemIndex: index
    });
  };

  renderEmptyContainer() {
    return (
      <View style={styles.row}>
        <View style={styles.col50}>
          <Text style={styles.value}>No picklist items</Text>
        </View>
      </View>
    );
  }

  render() {
    const vm = orderDetailsVMMapper(this.props.route?.params, this.state);
    return (
      <View style={styles.screenContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.row}>
            <View style={styles.col50}>
              <Text style={styles.label}>Identifier</Text>
              <Text style={styles.value}>{vm.identifier}</Text>
            </View>
            <View style={styles.col50}>
              <Text style={styles.label}>Status</Text>
              <Text style={styles.value}>{vm.status}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col50}>
              <Text style={styles.label}>Destination</Text>
              <Text style={styles.value}>
                {vm.destination.locationNumber}-{vm.destination.name}
              </Text>
            </View>
            <View style={styles.col50}>
              <Text style={styles.label}>Requested Delivery Date</Text>
              <Text style={styles.value}>{vm.requestedDeliveryDate}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col50}>
              <Text style={styles.label}>Picklist</Text>
            </View>
          </View>
          <View style={styles.bottomList}>
            <FlatList
              data={this.state.pickList?.picklistItems}
              ListEmptyComponent={this.renderEmptyContainer()}
              ListFooterComponent={<View style={styles.bottomList} />}
              renderItem={(item: ListRenderItemInfo<PicklistItem>) => (
                <PickListItem
                  item={item.item}
                  onPress={() => {
                    this.onItemTapped(item.item, item.index);
                  }}
                />
              )}
              keyExtractor={(item) => `${item.id}`}
              style={styles.list}
            />
          </View>
        </View>
      </View>
    );
  }
}

const mapDispatchToProps: DispatchProps = {
  getPickListAction,
  showScreenLoading,
  hideScreenLoading
};

export default connect(null, mapDispatchToProps)(OrderDetails);
