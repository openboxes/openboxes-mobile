import React, {useState} from 'react';
import styles from './styles';
import {Image, TextInput, TouchableOpacity, View} from 'react-native';
import {Props} from './types';
import ModalSelector from 'react-native-modal-selector-searchable';
import CLEAR from '../../assets/images/icon_clear.png';

export default function ({data, selectedData, initValue = ''}: Props) {
  const [query, setQuery] = useState(initValue);

  const clearSelection = () => {
    setQuery('');
    selectedData?.({id: '', name: ''});
  }

  return (
    <View style={styles.mainContainer}>
      <ModalSelector
        data={data.map(item => ({
          key: item.key || item.id,
          label: item.label || item.name,
        }))}
        initValue=""
        supportedOrientations={['landscape']}
        optionContainerStyle={styles.container}
        optionTextStyle={styles.option}
        accessible={true}
        scrollViewAccessibilityLabel={'Scrollable options'}
        cancelButtonAccessibilityLabel={'Cancel Button'}
        onChange={(option: { label: React.SetStateAction<string>; key: any }) => {
          setQuery(option.label);
          selectedData?.({id: option.key, name: option.label});
        }}
      >
        <TextInput
          style={styles.textInput}
          editable={false}
          placeholder=""
          value={query}
        />
      </ModalSelector>
      {query != '' ?
        <TouchableOpacity onPress={clearSelection}>
          <Image source={CLEAR} style={styles.imageIcon} />
        </TouchableOpacity> : null}
    </View>
  );
}
