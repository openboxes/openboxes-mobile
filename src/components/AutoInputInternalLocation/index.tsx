import React, { useState } from 'react';
import styles from './styles';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';
import { Props } from './types';
import ModalSelector from 'react-native-modal-selector-searchable';
import CLEAR from '../../assets/images/icon_clear.png';

const AutoInputInternalLocation = ({ data, selectedData, initValue = '', placeholder = '' }: Props) => {
  const [query, setQuery] = useState(initValue);

  const clearSelection = () => {
    setQuery('');
    selectedData?.({ id: '', name: '' });
  };

  return (
    <View style={styles.mainContainer}>
      <ModalSelector
        accessible
        data={data.map((item, index) => ({
          key: item?.id || index,
          label: item?.name || item,
          select: index === 0
        }))}
        initValue=""
        supportedOrientations={['landscape']}
        optionContainerStyle={styles.container}
        optionTextStyle={styles.option}
        scrollViewAccessibilityLabel={'Scrollable options'}
        cancelButtonAccessibilityLabel={'Cancel Button'}
        onChange={(option: { label: React.SetStateAction<string>; key: any }) => {
          setQuery(option.label);
          selectedData?.({
            id: option.key,
            label: option.label
          });
        }}
      >
        <TextInput style={styles.textInput} editable={false} placeholder={placeholder ?? ''} value={query} />
      </ModalSelector>
      {query ? (
        <TouchableOpacity onPress={clearSelection}>
          <Image source={CLEAR} style={styles.imageIcon} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default AutoInputInternalLocation;
