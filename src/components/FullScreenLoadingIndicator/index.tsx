import React from 'react';
import { View, Modal, Text } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Props } from './types';
import styles from './styles';

export default function FullScreenLoadingIndicator(props: Props) {
  return (
    <View style={styles.modalParent}>
      <Modal transparent visible={props.visible}>
        <View style={styles.modalChild}>
          <View style={styles.progressContainer}>
            <ActivityIndicator />
            {props.message ? <Text style={styles.progressMessage}>{props.message}</Text> : null}
          </View>
        </View>
      </Modal>
    </View>
  );
}
