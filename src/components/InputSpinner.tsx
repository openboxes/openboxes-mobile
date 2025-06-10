import React from 'react';
import { StyleSheet, View } from 'react-native';
import Spinner from 'react-native-input-spinner';
import { device } from '../constants';
import Theme from '../utils/Theme';

const DEFAULT_RATIO = 1.08;

const InputSpinner = ({ title, value, max, setValue, ratio = DEFAULT_RATIO }: any) => {
  if (ratio < 1) {
    console.warn('Ratio should be greater than or equal to 1');
    ratio = DEFAULT_RATIO;
  }

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
          width={device.windowWidth / ratio}
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
