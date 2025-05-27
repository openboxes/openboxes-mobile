import React from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { connect } from 'react-redux';
import EmptyIcon from '../../assets/images/icon_empty.svg';
import { RootState } from '../../redux/reducers';
import styles from './EmptyViewStyle';
import { Props } from './types';

function EmptyView(props: Props) {
  const { fullScreenLoadingIndicator, title, description, onPress, isRefresh = false } = props;
  return !fullScreenLoadingIndicator?.visible ? (
    <View style={styles.container}>
      <EmptyIcon />
      <Text style={styles.titleText}>{title}</Text>
      <Text style={styles.subTitleText}>{description}</Text>
      {isRefresh && (
        <Button icon="refresh" mode="outlined" onPress={onPress}>
          Refresh
        </Button>
      )}
    </View>
  ) : null;
}

const mapStateToProps = (state: RootState) => ({
  fullScreenLoadingIndicator: state.mainReducer.fullScreenLoadingIndicator
});

export default connect(mapStateToProps)(EmptyView);
