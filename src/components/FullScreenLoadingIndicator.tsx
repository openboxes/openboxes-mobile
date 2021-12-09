import React from 'react';
import {View, Modal, StyleSheet, Text} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';

export interface Props {
  visible: boolean;
  message?: string | null;
}

export default function FullScreenLoadingIndicator(props: Props) {
  return (
    <View style={styles.modalParent}>
      <Modal visible={props.visible} transparent>
        <View style={styles.modalChild}>
          <View style={styles.progressContainer}>
            <ActivityIndicator />
            {props.message ? (
              <Text style={styles.progressMessage}>{props.message}</Text>
            ) : null}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalParent: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalChild: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000099',
  },
  progressContainer: {
    flex: 0,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    padding: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressMessage: {
    marginTop: 8,
    fontSize: 16,
  },
});
