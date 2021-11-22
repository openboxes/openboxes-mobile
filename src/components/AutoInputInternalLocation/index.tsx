import React, {useState} from 'react';
import styles from './styles';
import {View, Text, Image, TextInput} from 'react-native';
import AutoComplete from 'react-native-autocomplete-input';
import {Props} from './types';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ModalSelector from 'react-native-modal-selector-searchable';
import { device } from '../../constants';
const iconClear = require('../../assets/images/icon_clear.png');

export default function ({
  refs,
  data,
  disabled,
  selectedData,
  selectedContainerItem,
  getMoreData,
}: Props) {
  const [query, setQuery] = useState('');
  const [showResult, setShowResult] = useState(true);
  const dataFilter = (value: any) => {
    if (typeof value === 'string') {
      return value.toLowerCase().includes(query.toLowerCase());
    } else if (typeof value === 'object') {
      return value?.name?.includes(query);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ModalSelector
        data={data.map((item, index) => ({key: index, label: item, select: 0 === index}))}
        initValue=""
        supportedOrientations={['landscape']}
        optionContainerStyle={styles.container}
        optionTextStyle={styles.option}
        accessible={true}
        scrollViewAccessibilityLabel={'Scrollable options'}
        cancelButtonAccessibilityLabel={'Cancel Button'}
        onChange={(option)=> {
          setQuery(option.label);
          setShowResult(true);
          selectedData?.(option.label, option.key);

        }}
        onCancel={() =>  setQuery('')}
        >
        <TextInput
          style={{borderWidth:1, borderColor:'#ccc', padding: 10, height: 40, width: device.windowWidth - 20, borderRadius: 4}}
          editable={false}
          placeholder=""
          value={query} 
        />

    </ModalSelector>
    </View>
  );
}
