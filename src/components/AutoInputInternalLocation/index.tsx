/* eslint-disable react/display-name */
/* eslint-disable react/jsx-boolean-value */
import React, { useState } from 'react';
import styles from './styles';
import { View, TextInput } from 'react-native';
import { Props } from './types';
import ModalSelector from 'react-native-modal-selector-searchable';

export default function ({
  data,
  selectedData,
  initValue = '',
  placeholder = ''
}: Props) {
  const [query, setQuery] = useState(initValue);

  return (
    <View style={styles.mainContainer}>
      <ModalSelector
        data={data.map((item, index) => ({
          key: item?.id || index ,
          label:item?.name  || item ,
          select: index === 0
        }))}
        initValue=""
        supportedOrientations={['landscape']}
        optionContainerStyle={styles.container}
        optionTextStyle={styles.option}
        accessible={true}
        scrollViewAccessibilityLabel={'Scrollable options'}
        cancelButtonAccessibilityLabel={'Cancel Button'}
        onChange={(option: {
          label: React.SetStateAction<string>;
          key: any;
        }) => {
          setQuery(option.label);
          selectedData?.({
            id: option.key,
            label: option.label
          });
        }}
        onCancel={() => setQuery('')}
      >
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
