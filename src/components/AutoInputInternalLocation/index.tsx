import React, {useState} from 'react';
import styles from './styles';
import {View} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import {Props} from './types';

export default function ({refs, onChangeText}: Props) {
  const [edit, setEdit] = useState(disabled);
  const onEdit = () => {
    setEdit(!edit);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row} />
    </View>
  );
}
