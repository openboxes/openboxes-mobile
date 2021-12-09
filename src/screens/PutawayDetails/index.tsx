/* eslint-disable react-native/no-unused-styles */
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import React, { ReactElement } from 'react';
import Theme from '../../utils/Theme';
import { Order } from '../../data/order/Order';
import PutAway from '../../data/putaway/PutAway';
import PutAwayItems from '../../data/putaway/PutAwayItems';
import { connect } from 'react-redux';
import PutAwayItem from '../../components/PutAwayItem';

export interface Props {
  putAway: PutAway | null;
  exit: () => void;
  navigation: any;
}

export interface State {
  putAway: PutAway | null;
}

class PutawayDetail extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      putAway: null
    };
  }

  componentDidMount() {
    const { putAway } = this.props.route.params;
    this.setState({
      putAway: putAway
    });
  }

  goToPutawayItemDetailScreen = (
    putAway: PutAway,
    putAwayItem: PutAwayItems
  ) => {
    if (putAwayItem?.quantity > 1) {
      this.props.navigation.navigate('PutawayItemDetail', {
        putAway,
        putAwayItem: putAwayItem,
        exit: () => {
          this.props.navigation.navigate('PutawayList');
        }
      });
    }
  };

  render() {
    return (
      <TouchableOpacity style={styles.contentContainer}>
        <View style={styles.row}>
          <View style={styles.col50}>
            <Text style={styles.label}>PutAway Number</Text>
            <Text style={styles.value}>
              {this.state.putAway?.putawayNumber}
            </Text>
          </View>
          <View style={styles.col50}>
            <Text style={styles.label}>Status</Text>
            <Text style={styles.value}>
              {this.state.putAway?.putawayStatus}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col50}>
            <Text style={styles.label}>Origin</Text>
            <Text style={styles.value}>
              {this.state.putAway?.['origin.name']}
            </Text>
          </View>
          <View style={styles.col50}>
            <Text style={styles.label}>Destination</Text>
            <Text style={styles.value}>
              {this.state.putAway?.['destination.name']}
            </Text>
          </View>
        </View>
        {
          <FlatList
            data={this.state.putAway?.putawayItems}
            renderItem={(putAwayItem: ListRenderItemInfo<PutAwayItems>) => (
              <PutAwayItem
                item={putAwayItem.item}
                onItemTapped={() =>
                  this.goToPutawayItemDetailScreen(
                    this.state.putAway,
                    putAwayItem.item
                  )
                }
              />
            )}
            keyExtractor={(item) => item.id}
            style={styles.list}
          />
        }
      </TouchableOpacity>
    );
  }
}

export default connect(null, null)(PutawayDetail);

const styles = StyleSheet.create({
  contentContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    padding: 8
  },
  list: {
    width: '100%'
  },
  listItemContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    borderRadius: Theme.roundness,
    borderColor: Theme.colors.backdrop,
    borderWidth: 1,
    margin: 4,
    padding: 4,
    justifyContent: 'center'
  },
  listItemNameContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4
  },
  listItemNameLabel: {
    fontSize: 12,
    color: Theme.colors.placeholder
  },
  listItemName: {
    fontSize: 16,
    color: Theme.colors.text
  },
  listItemCategoryContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4,
    marginTop: 4
  },
  listItemCategoryLabel: {
    fontSize: 12,
    color: Theme.colors.placeholder
  },
  listItemCategory: {
    fontSize: 16,
    color: Theme.colors.text
  },
  row: {
    flexDirection: 'row',
    borderColor: Theme.colors.background,
    // borderBottomWidth: 1,
    marginTop: 1,
    padding: 2,
    width: '100%'
  },
  col50: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4,
    width: '50%'
  },
  label: {
    fontSize: 12,
    color: Theme.colors.placeholder
  },
  value: {
    fontSize: 16,
    color: Theme.colors.text
  }
});
