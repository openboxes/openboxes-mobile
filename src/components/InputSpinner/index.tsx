import React from 'react';
import Spinner from 'react-native-input-spinner';
import { View } from 'react-native';
import { colors, device } from '../../constants';
import { Props } from './types';
import styles from './styles';

const InputSpinner = ({ value, max, setValue }: Props) => {
  return (
    <View style={styles.container}>
      <Spinner
        selectTextOnFocus
        showBorder
        step={1}
        color={colors.headerColor}
        max={max}
        skin="square"
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
  );
};
export default InputSpinner;
