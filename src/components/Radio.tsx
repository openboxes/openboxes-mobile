import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';

const Radio = ({ title, setValue,disabled }: any) => {
  const [checked, setChecked] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.radioButton}>
        <RadioButton
          color={'grey'}
          value="false"
          disabled={disabled}
          status={checked ? 'checked' : 'unchecked'}
          onPress={() => {
            setChecked(!checked)
            setValue(!checked);
          }}
        />
      </View>
      <View style={styles.title}>
        <Text style={styles.titleText(disabled)}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "flex-start"
  },
  title: {
    flex: 9,
  },
  radioButton: {
    flex: 1
  },
  titleText : (disabled : any) =>({
    fontSize: 16,
    fontWeight : "bold",
    color: disabled? "grey" :"black"
  }),
});
export default Radio;
