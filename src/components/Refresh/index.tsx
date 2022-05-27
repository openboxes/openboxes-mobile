import React, { Component } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { Props, State, DispatchProps } from './types';
import styles from './styles';
import { RootState } from '../../redux/reducers';
import { connect } from 'react-redux';
import { refreshScreenAction } from '../../redux/actions/main';

class Refresh extends Component<Props, State> {
  handleRefresh = () => {
    this.props.refreshScreenAction();
    this.props.onRefresh();
  };

  render() {
    const { refreshing } = this.props;
    return (
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.handleRefresh} />}
      >
        {this.props.children}
      </ScrollView>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  refreshing: state.mainReducer.refreshing
});

const mapDispatchToProps: DispatchProps = {
  refreshScreenAction
};

export default connect(mapStateToProps, mapDispatchToProps)(Refresh);
