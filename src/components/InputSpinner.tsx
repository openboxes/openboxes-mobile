import React from 'react';
import Spinner from 'react-native-input-spinner';
import { StyleSheet, Text, View } from 'react-native';
import { colors, device } from '../constants';

const InputSpinner = ({ title, value, max, setValue }: any) => {
  return (
    <>
      <View style={styles.container}>
        <Spinner
          max={max}
          min={0}
          skin={'square'}
          color={colors.headerColor}
          selectTextOnFocus={true}
          showBorder={true}
          step={1}
          longStep={10}
          speed={1}
          width={device.windowWidth/1.16}
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
    marginTop: 20,
  },
  textView: {
    marginTop: 10,
    marginStart: 5
  }
});
