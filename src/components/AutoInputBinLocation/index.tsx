import React, {useState} from 'react';
import styles from './styles';
import {View, TextInput} from 'react-native';
import {Props} from './types';
import ModalSelector from 'react-native-modal-selector-searchable';

export default function ({data, selectedData, initValue = ''}: Props) {
  const [query, setQuery] = useState(initValue);

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
        onChange={(option: {label: React.SetStateAction<string>; key: any}) => {
          setQuery(option.label);
          selectedData?.({ id: option.key, name: option.label });
        }}
      >
        <TextInput
          style={styles.textInput}
          editable={false}
          placeholder=""
          value={query}
        />
      </ModalSelector>
    </View>
  );
}
