import React, { useState, useEffect } from 'react';
import styles from './styles';
import asyncModalSelectStyles from '../AsyncModalSelect/styles';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';
import { Props } from './types';
import ModalSelector from 'react-native-modal-selector-searchable';
import { colors } from '../../constants';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// Consider combining this EditableModalSelect component with AsyncModalSelect into one component in the future.
const EditableModalSelect = ({
  initialData,
  initValue = '',
  onSelect,
  placeholder,
  helperIcon,
  onHelperIconClick
}: Props) => {
  const [label, setLabel] = useState(initValue);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    setLabel(initValue);
  }, [initValue]);

  const onChangeText = (text: string) => {
    setLabel(text);
    onSelect?.({ id: text, name: text });
  }

  return (
    <View style={styles.mainContainer}>
      <>
        <TextInput style={[asyncModalSelectStyles.textInput, styles.textInput]} editable placeholder={placeholder || ''} onChangeText={onChangeText} value={label} />
        {helperIcon && (
          <TouchableOpacity onPress={onHelperIconClick}>
            <Image source={helperIcon} style={[asyncModalSelectStyles.imageIcon, styles.imageIcon]} />
          </TouchableOpacity>
        )}
      </>
      <ModalSelector
        accessible
        initValue=""
        supportedOrientations={['landscape']}
        optionContainerStyle={asyncModalSelectStyles.container}
        optionTextStyle={asyncModalSelectStyles.option}
        scrollViewAccessibilityLabel={'Scrollable options'}
        data={data?.map((item) => ({
          key: item.key || item.id,
          label: item.label || item.name
        }))}
        cancelButtonAccessibilityLabel={'Cancel Button'}
        searchText="Search for more options..."
        onChange={(option: { label: React.SetStateAction<string>; key: any }) => {
          setLabel(option.label);
          onSelect?.({ id: option.key, name: option.label });
        }}
        onSearchFilterer={(searchText, unfilteredData) => unfilteredData}
      >
        <FontAwesome5 name="search" size={24} color={colors.headerColor} style={{ paddingHorizontal: 10 }} />
      </ModalSelector>
    </View>
  );
};

export default EditableModalSelect;
