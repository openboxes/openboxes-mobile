import { DispatchProps, Props, State } from './types';
import React from 'react';
import { getOrdersAction } from '../../redux/actions/orders';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { connect } from 'react-redux';
import { hideScreenLoading, showScreenLoading } from '../../redux/actions/main';
import { RootState } from '../../redux/reducers';
import EmptyView from '../../components/EmptyView';
import { getStockTransfers } from '../../redux/actions/transfers';
import showPopup from '../../components/Popup';
import { Card } from 'react-native-paper';
import { common } from '../../assets/styles';
import { Props as LabeledDataType } from '../../components/LabeledData/types';
import DetailsTable from '../../components/DetailsTable';
import { ContentContainer, ContentBody } from '../../components/ContentLayout';

class Transfers extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
      transfersList: null
    };
    this.renderItems = this.renderItems.bind(this);
  }
  componentDidMount() {
    this._getTransfersList();
  }

  _getTransfersList = () => {
    const { getStockTransfers } = this.props;
    const callback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.errorMessage ? 'Inbound order details' : null,
          message: data.errorMessage ?? `Failed to load inbound order details value ${id}`,
          positiveButton: {
            text: 'Retry',
            callback: () => {
              getStockTransfers(callback, id);
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
          const { currentLocation } = this.props;
          this.setState({
            error: null,
            transfersList: data.filter(
              (transferData) =>
                currentLocation?.id === transferData?.origin?.id && transferData.status.name === 'APPROVED'
            )
          });
        }
      }
    };
    getStockTransfers(callback);
  };

  onCallBackHandler = (data: undefined) => {
    const { transfersList } = this.state;
    this.setState({
      error: null,
      transfersList: transfersList.filter((transferData) => data?.id !== transferData?.id)
    });
  };

  onStockTransfersTapped = (data) => {
    this.props.navigation.navigate('TransferDetails', {
      transfers: data,
      onCallBackHandler: this.onCallBackHandler
    });
  };

  renderItems(item: ListRenderItemInfo<any>) {
    const renderItemData: LabeledDataType[] = [
      { label: 'Identify', value: item.item?.orderNumber },
      { label: 'Status', value: item.item?.status.name },
      { label: 'Origin', value: item.item?.origin?.name },
      { label: 'Destination', value: item.item?.destination?.name },
      { label: 'Number of Items', value: item.item?.orderItems?.length }
    ];

    return (
      <Card style={common.listItemContainer} onPress={() => this.onStockTransfersTapped(item.item)}>
        <Card.Content>
          <DetailsTable data={renderItemData} />
        </Card.Content>
      </Card>
    );
  }

  render() {
    const { transfersList } = this.state;
    return (
      <ContentContainer>
        <ContentBody>
          <FlatList
            data={transfersList}
            ListEmptyComponent={<EmptyView title="Transfers" description="There are no items for Transfer" />}
            renderItem={this.renderItems}
            keyExtractor={(item) => item.id}
          />
        </ContentBody>
      </ContentContainer>
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
