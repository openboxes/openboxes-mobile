import React from 'react';
import Spinner from 'react-native-input-spinner';
import { StyleSheet, Text, View } from 'react-native';
import { colors, device } from '../constants';

const InputSpinner = ({ title, value, max, setValue }: any) => {
  return (
    <>
      <View style={styles.container}>
        <Spinner
          selectTextOnFocus
          showBorder
          step={1}
          color={colors.headerColor}
          max={max}
          skin={'square'}
          min={0}
          longStep={10}
          speed={1}
          width={device.windowWidth / 1.16}
          value={value}
          onChange={(num: any) => {
            setValue(num);
          }}
        />
      </View>
    </>
  );
};
export default InputSpinner;
const styles = StyleSheet.create({
  container: {
    marginTop: 20
  },
  textView: {
    marginTop: 10,
    marginStart: 5
  }
});
