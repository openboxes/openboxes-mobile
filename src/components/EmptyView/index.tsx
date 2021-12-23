import React from 'react';
import { Text, View, Image } from 'react-native';
import styles from './EmptyViewStyle';
import { Button } from 'react-native-paper';
import { connect } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { DispatchProps, Props } from './types';

function EmptyView(props: Props) {
  console.log('Proper Values ::', props);
  const {
    fullScreenLoadingIndicator,
    title,
    description,
    uri,
    onPress,
    isRefresh
  } = props;
  return !fullScreenLoadingIndicator?.visible ? (
    <View style={styles.container}>
      <Image
        source={uri ? uri : require('../../assets/images/packing.png')}
        style={styles.stashEmpty}
        resizeMode={'contain'}
      />
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
