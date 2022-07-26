/* eslint-disable react-native/no-unused-styles */
import { FlatList, ListRenderItemInfo, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import PutAway from '../../data/putaway/PutAway';
import PutAwayItems from '../../data/putaway/PutAwayItems';
import { connect } from 'react-redux';
import PutAwayItem from '../../components/PutAwayItem';
import EmptyView from '../../components/EmptyView';
import styles from './styles';

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

  goToPutawayItemDetailScreen = (putAway: PutAway, putAwayItem: PutAwayItems) => {
    this.props.navigation.navigate('PutawayItemDetail', {
      putAway,
      putAwayItem: putAwayItem,
      exit: () => {
        this.props.navigation.navigate('PutawayList');
      }
    });
  };

  render() {
    return (
      <TouchableOpacity style={styles.contentContainer}>
        <View style={styles.row}>
          <View style={styles.col50}>
            <Text style={styles.label}>PutAway Number</Text>
            <Text style={styles.value}>{this.state.putAway?.putawayNumber}</Text>
          </View>
          <View style={styles.col50}>
            <Text style={styles.label}>Status</Text>
            <Text style={styles.value}>{this.state.putAway?.putawayStatus}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col50}>
            <Text style={styles.label}>Origin</Text>
            <Text style={styles.value}>{this.state.putAway?.['origin.name']}</Text>
          </View>
          <View style={styles.col50}>
            <Text style={styles.label}>Destination</Text>
            <Text style={styles.value}>{this.state.putAway?.['destination.name']}</Text>
          </View>
        </View>

        <FlatList
          data={this.state.putAway?.putawayItems}
          ListEmptyComponent={<EmptyView title="Putaway Details" description="There are no items in this putaway" />}
          renderItem={(putAwayItem: ListRenderItemInfo<PutAwayItems>) => (
            <PutAwayItem
              item={putAwayItem.item}
              onItemTapped={() => this.goToPutawayItemDetailScreen(this.state.putAway, putAwayItem.item)}
            />
          )}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      </TouchableOpacity>
    );
  }
}

export default connect(null, null)(PutawayDetail);
