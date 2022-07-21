import React from 'react';
import { View, Text } from 'react-native';
import { RadioButton } from 'react-native-paper';
import styles from './styles';
import { Props } from './types';

const Radio: React.FC<Props> = ({ title, checked, setChecked, disabled }) => {
  return (
    <View style={styles.container}>
      <View style={styles.radioButton}>
        <RadioButton
          color={'grey'}
          value="false"
          disabled={disabled}
          status={checked ? 'checked' : 'unchecked'}
          onPress={() => {
            setChecked(!checked);
          }}
        />
      </View>
      <View style={styles.title}>
        <Text
          style={[styles.titleText, disabled ? styles.titleColorGrey : styles.titleColorBlack]}
          onPress={() => (!disabled ? setChecked(!checked) : null)}
        >
          {title}
        </Text>
      </View>
    </View>
  );
};

export default Radio;
