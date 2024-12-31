import React from 'react';
import { FlatList, Image, ListRenderItemInfo, Text, TouchableOpacity, View } from 'react-native';
import { Card } from 'react-native-paper';
import EmptyView from '../../components/EmptyView';
import { Props, State } from './Types';
import dashboardData from './dashboardData';
import styles from './styles';

class Dashboard extends React.Component<Props, State> {
  renderItem = (item: any, index: any) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.cardContainer}
        onPress={() => {
          this.props.navigation.navigate(item.navigationScreenName);
        }}
      >
        <Card style={styles.card}>
          <Image style={styles.cardImage} resizeMode="contain" source={item.icon} />
          <Text style={styles.cardLabel}>{item.screenName}</Text>
        </Card>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={styles.screenContainer}>
        <FlatList
          data={dashboardData}
          horizontal={false}
          numColumns={2}
          ListEmptyComponent={<EmptyView title={''} isRefresh={undefined} />}
          renderItem={(item: ListRenderItemInfo<any>) => this.renderItem(item.item, item.index)}
        />
      </View>
    );
  }
}

export default Dashboard;
