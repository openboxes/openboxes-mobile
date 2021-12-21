import PropTypes from 'prop-types';
import React from 'react';
import { Text, View, Image } from 'react-native';
import styles from './EmptyViewStyle';
import { Button } from 'react-native-paper';

const EmptyView = ({
  title = 'Oops!!!',
  description = 'Your List is Empty, yet!!',
  onPress
}) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/empty_box.png')}
        style={styles.stashEmpty}
        resizeMode={'contain'}
      />
      <Text style={styles.titleText}>{title}</Text>
      <Text style={styles.subTitleText}>{description}</Text>
      <Button icon="refresh" mode="outlined" onPress={onPress}>
        Refresh
      </Button>
    </View>
  );
};

EmptyView.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  onPress: PropTypes.string
};

export default EmptyView;
