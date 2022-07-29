import React from 'react';
import { FlatList, Image, ListRenderItemInfo, Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import { Props } from './types';
import { Card } from 'react-native-paper';
import dashboardData from './dashboardData';
import EmptyView from '../../components/EmptyView';
class Dashboard extends React.Component<Props> {
  renderItem = (item: ListRenderItemInfo<any>) => {
    const cardItem = item.item;
    const cardIndex = item.index;
    return (
      <TouchableOpacity
        key={cardIndex}
        style={styles.cardContainer}
        onPress={() => {
          this.props.navigation.navigate(cardItem.navigationScreenName);
        }}
      >
        <Card style={styles.card}>
          <Image style={styles.cardImage} resizeMode="contain" source={cardItem.icon} />
          <Text style={styles.cardLabel}>{cardItem.screenName}</Text>
        </Card>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <FlatList
        data={dashboardData}
        horizontal={false}
        numColumns={3}
        ListEmptyComponent={<EmptyView />}
        renderItem={this.renderItem}
      />
    );
  }
}

export default Dashboard;
