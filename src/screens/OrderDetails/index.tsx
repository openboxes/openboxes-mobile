import React from 'react';
import styles from './styles';
import {showScreenLoading, hideScreenLoading} from '../../redux/actions/main';
import {connect} from 'react-redux';
import {orderDetailsVMMapper} from './OrderDetailsVMMapper';
import Header from '../../components/Header';
import {FlatList, ListRenderItemInfo, Text, View} from 'react-native';
import {Item} from '../../data/picklist/Item';
import {getPickListAction} from '../../redux/actions/orders';
import {State, DispatchProps, Props} from './types';
import PickListItem from './PickListItem';

class OrderDetails extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      pickList: null,
      error: null,
      pickListItems: [],
    };
  }

  componentDidMount() {
    const {order} = this.props.route.params;
    const actionCallback = (data: any) => {
      if (data?.length == 0) {
        this.setState({
          pickList: null,
          error: 'No Picklist found',
          pickListItems: data,
        });
      } else {
        this.setState({
          pickList: null,
          error: null,
          pickListItems: data ? data : [],
        });
      }
    };
    this.props.getPickListAction(order.id, actionCallback);
  }

  onItemTapped = (item: Item) => {
    const {order} = this.props.route.params;
    this.props.navigation.navigate('PickOrderItem', {
      order,
      pickListItem: item,
    });
  };

  render() {
    const vm = orderDetailsVMMapper(this.props.route?.params, this.state);
    return (
      <View style={styles.screenContainer}>
        <Header
          title={vm.header}
          backButtonVisible={true}
          onBackButtonPress={this.props.exit}
        />
        <View style={styles.contentContainer}>
          <Text style={styles.name}>{vm.name}</Text>
          <FlatList
            data={this.state.pickListItems}
            renderItem={(item: ListRenderItemInfo<Item>) => (
              <PickListItem
                item={item.item}
                onPress={() => {
                  this.onItemTapped(item.item);
                }}
              />
            )}
            keyExtractor={item => `${item.id}`}
            style={styles.list}
          />
        </View>
      </View>
    );
  }
}

const mapDispatchToProps: DispatchProps = {
  getPickListAction,
  showScreenLoading,
  hideScreenLoading,
};

export default connect(null, mapDispatchToProps)(OrderDetails);
