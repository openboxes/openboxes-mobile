import React, {useState} from 'react';
import styles from './styles';
import {View, Text, Image} from 'react-native';
import AutoComplete from 'react-native-autocomplete-input';
import {Props} from './types';
import {TouchableOpacity} from 'react-native-gesture-handler';
const iconClear = require('../../assets/images/icon_clear.png');

export default function ({
  refs,
  data,
  disabled,
  selectedData,
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
      <AutoComplete
        editable={disabled}
        containerStyle={styles.autoCompleteInputContainer}
        inputContainerStyle={styles.autoCompleteInputContainer}
        onChangeText={(text: string) => {
          setShowResult(false);
          setQuery(text);
        }}
        hideResults={showResult}
        flatListProps={{
          keyboardShouldPersistTaps: 'always',
          keyExtractor: (_, idx) => idx,
          style: {maxHeight: 100},
          nestedScrollEnabled: true,
          renderItem: ({item}: any) => (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => {
                setQuery(item?.name || item);
                setShowResult(true);
                selectedData?.(item);
              }}>
              <Text style={styles.textInput}>{item?.name || item}</Text>
            </TouchableOpacity>
          ),
        }}
        onShowResults={(res: boolean) =>
          !res && getMoreData?.('here you can pass params for api')
        }
        data={data.filter((value: any) => dataFilter(value))}
        value={query}
      />
      <TouchableOpacity
        onPress={() => {
          setQuery('');
        }}>
        <Image style={styles.clearButton} source={iconClear} />
      </TouchableOpacity>
    </View>
  );
}
