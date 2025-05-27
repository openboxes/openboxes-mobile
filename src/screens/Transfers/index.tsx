import React from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { Caption, Card, Chip, Divider, Subheading } from 'react-native-paper';
import { connect } from 'react-redux';

import { LayoutStyle } from '../../assets/styles';
import EmptyView from '../../components/EmptyView';
import showPopup from '../../components/Popup';
import { hideScreenLoading, showScreenLoading } from '../../redux/actions/main';
import { getOrdersAction } from '../../redux/actions/orders';
import { getStockTransfers } from '../../redux/actions/transfers';
import { RootState } from '../../redux/reducers';
import Theme from '../../utils/Theme';
import styles from './styles';
import { DispatchProps, Props, State } from './types';
import { appConfig, DEFAULT_DATE_FORMAT_OPTIONS } from '../../constants';

class Transfers extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
      transfersList: null
    };
  }
  componentDidMount() {
    this._getTransfersList();
  }

  _getTransfersList = () => {
    const { getStockTransfers, currentLocation } = this.props;

    if (!currentLocation || !currentLocation.id) {
      showPopup({
        title: 'Error',
        message: 'Current location is not set. Please try again later.',
        negativeButtonText: 'OK'
      });
      return;
    }

    const callback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.errorMessage ? 'Inbound order details' : null,
          message: data.errorMessage ?? `Failed to load inbound order details value ${currentLocation.id}`,
          positiveButton: {
            text: 'Retry',
            callback: () => {
              getStockTransfers(currentLocation.id, callback);
            }
          },
          negativeButtonText: 'Cancel'
        });
      } else {
        if (data.length === 0) {
          this.setState({
            error: 'No products found',
            transfersList: data
          });
        } else {
          const filteredList = data.filter(
            (transferData) => transferData.status === 'APPROVED' || transferData.status === 'PENDING'
          );

          this.setState({
            error: null,
            transfersList: filteredList
          });
        }
      }
    };

    getStockTransfers(currentLocation.id, callback);
  };

  onCallBackHandler = (data: undefined) => {
    const { transfersList } = this.state;
    this.setState({
      error: null,
      transfersList: transfersList ? transfersList.filter((transferData) => data?.id !== transferData?.id) : []
    });
  };

  onStockTransfersTapped = (data) => {
    this.props.navigation.navigate('TransferDetails', {
      transfers: data,
      onCallBackHandler: this.onCallBackHandler
    });
  };

  render() {
    const { transfersList } = this.state;

    return (
      <View style={styles.screenContainer}>
        {transfersList ? (
          <FlatList
            data={transfersList}
            ListEmptyComponent={<EmptyView title="Transfers" description="There are no items for Transfer" />}
            renderItem={(item: ListRenderItemInfo<any>) => {
              const formattedDate = new Date(item.item?.dateCreated).toLocaleDateString(
                appConfig.LOCALE,
                DEFAULT_DATE_FORMAT_OPTIONS
              );

              return (
                <Card style={LayoutStyle.listItemContainer} onPress={() => this.onStockTransfersTapped(item.item)}>
                  <Card.Content>
                    <View style={styles.headerRow}>
                      <Chip icon="identifier" style={styles.chipDefault} textStyle={styles.chipText}>
                        {item.item?.orderNumber}
                      </Chip>
                      <Chip style={styles.chipDefault} textStyle={styles.chipText}>
                        {item.item?.status}
                      </Chip>
                    </View>
                    <Divider style={{ marginVertical: Theme.spacing.medium }} />

                    <Subheading
                      style={styles.subheading}
                    >{`Number of Items: ${item.item?.orderItemsCount}`}</Subheading>
                    <Caption style={styles.caption}>{`Created on: ${formattedDate}`}</Caption>

                    <View style={styles.additionalInfoRow}>
                      <Chip icon="truck" style={styles.chipDefault} textStyle={styles.chipText}>
                        {item.item?.origin}
                      </Chip>
                      <Chip icon="map-marker-check" style={styles.chipDefault} textStyle={styles.chipText}>
                        {item.item?.destination}
                      </Chip>
                    </View>
                  </Card.Content>
                </Card>
              );
            }}
            keyExtractor={(item) => item.id}
            style={styles.list}
          />
        ) : null}
      </View>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  transfers: state.putawayReducer.putAway,
  currentLocation: state.mainReducer.currentLocation
});

const mapDispatchToProps: DispatchProps = {
  showScreenLoading,
  hideScreenLoading,
  getOrdersAction,
  getStockTransfers
};
export default connect(mapStateToProps, mapDispatchToProps)(Transfers);
