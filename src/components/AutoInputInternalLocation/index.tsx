import React, {useState} from 'react';
import styles from './styles';
import {View, TextInput} from 'react-native';
import {Props} from './types';
import ModalSelector from 'react-native-modal-selector-searchable';

export default function ({data, selectedData, initValue = '', placeholder = ''}: Props) {
  const [query, setQuery] = useState(initValue);

  return (
    <View style={styles.mainContainer}>
      <ModalSelector
        data={data.map((item, index) => ({
          key: index,
          label: item,
          select: index === 0,
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
          selectedData?.(option.label, option.key);
        }}
        onCancel={() => setQuery('')}>
        <TextInput
          style={styles.textInput}
          editable={false}
          placeholder={placeholder ?? ''}
          value={query}
        />
      </ModalSelector>
    </View>
  );
}
