import React from 'react';
import { StyleSheet, View } from 'react-native';
import Spinner from 'react-native-input-spinner';
import { device } from '../constants';
import Theme from '../utils/Theme';

const InputSpinner = ({ title, value, max, setValue }: any) => {
  return (
    <>
      <View style={styles.container}>
        <Spinner
          selectTextOnFocus
          showBorder
          step={1}
          color={Theme.colors.primary}
          max={max}
          skin={'square'}
          min={0}
          longStep={10}
          speed={1}
          width={device.windowWidth / 1.08}
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
    marginTop: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
