/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import React from 'react';
import { Text, View, Image } from 'react-native';
import styles from './EmptyViewStyle';
import { Button } from 'react-native-paper';

const EmptyView = ({
  title = '',
  description = 'No item found, List is Empty, yet!!',
  onPress,
  isRefresh = false,
  uri = require('../../assets/images/packing.png')
}) => {
  console.log(
    'this.props.fullScreenLoadingIndicator ',
    this.props
  );
  return (
    <View style={styles.container}>
      <Image source={uri} style={styles.stashEmpty} resizeMode={'contain'} />
      <Text style={styles.titleText}>{title}</Text>
      <Text style={styles.subTitleText}>{description}</Text>
      {isRefresh && (
        <Button icon="refresh" mode="outlined" onPress={onPress}>
          Refresh
        </Button>
      )}
    </View>
  );
};

EmptyView.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  onPress: PropTypes.string
};

export default EmptyView;
