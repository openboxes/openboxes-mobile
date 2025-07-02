import React from 'react';
import { FlatList, ListRenderItemInfo, Text, View } from 'react-native';
import { Card } from 'react-native-paper';

import { connect } from 'react-redux';
import EmptyIcon from '../../assets/images/icon_empty.svg';
import Button from '../../components/Button';
import { RootState } from '../../redux/reducers';
import { Props, State } from './Types';
import { getFilteredDashboardEntries, type DashboardEntry } from './dashboardData';
import styles from './styles';

class Dashboard extends React.Component<Props, State> {
  renderItem = ({ item }: ListRenderItemInfo<DashboardEntry>) => {
    const IconComponent = item.icon;

    return (
      <Card
        style={styles.cardContainer}
        onPress={() => {
          this.props.navigation.navigate(item.navigationScreenName);
        }}
      >
        <Card.Content style={styles.cardContent}>
          <View style={styles.iconWrapper}>
            {IconComponent && <IconComponent width={styles.icon.width} height={styles.icon.height} />}
          </View>
          <Text style={styles.cardLabel}>{item.screenName}</Text>
        </Card.Content>
      </Card>
    );
  };

  keyExtractor = (item: DashboardEntry, index: number): string =>
    item.key || item.navigationScreenName || `dashboard-item-${index}`;

  render() {
    const { dashboardEntriesVisibility } = this.props;
    const dashboardEntries = getFilteredDashboardEntries(dashboardEntriesVisibility);

    return (
      <View style={styles.screenContainer}>
        <FlatList
          data={dashboardEntries}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          numColumns={2}
          ListEmptyComponent={
            <View style={styles.emptyScreenContainer}>
              <EmptyIcon />

              <Text style={styles.emptyScreenTitle}>No Dashboard Entries</Text>
              <Text style={styles.emptyScreenDescription}>Please check your settings to enable dashboard entries.</Text>

              <Button
                style={styles.emptyScreenButton}
                title="Go To Settings"
                mode="contained"
                onPress={() => {
                  this.props.navigation.navigate('Settings');
                }}
              />
            </View>
          }
          contentContainerStyle={styles.flatListContentContainer}
        />
      </View>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  dashboardEntriesVisibility: state.settingsReducer.dashboardEntriesVisibility
});

export default connect(mapStateToProps)(Dashboard);
