/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import {Button as PaperButton} from 'react-native-paper';
import {colors} from '../constants';
export interface Props extends ViewProps {
  title: string;
  onPress?: () => void;
  disabled: boolean;
}

export default function Button(props: Props) {
  return (
    <View
      style={{
        ...(props.style as {}),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 8,
      }}>
      <PaperButton
        onPress={props.onPress}
        mode="contained"
        style={[
          styles.viewStyle,
          {
            backgroundColor: props.disabled
              ? colors.disabledBgColor
              : colors.headerColor,
          },
        ]}
        labelStyle={styles.label}
        disabled={props.disabled}
        compact={true}>
        {props.title}
      </PaperButton>
    </View>
  );
}
const styles = StyleSheet.create({
  label: {
    color: 'white',
    fontSize: 15,
    alignSelf: 'center',
    fontWeight: '600',
    width: '100%',
    textAlign: 'center',
  },
  viewStyle: {
    width: '80%',
    height: 45,
    marginTop: 25,
    backgroundColor: colors.headerColor,
    alignSelf: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
});
