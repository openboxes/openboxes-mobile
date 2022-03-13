import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import styles from './styles';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';
import { Props } from './types';
import ModalSelector from 'react-native-modal-selector-searchable';
import CLEAR from '../../assets/images/icon_clear.png';
import useDebounce from '../../hooks/useDebounce';
import {useDispatch} from "react-redux";
import showPopup from "../Popup";

export default function ({ initialData, onSelect, initValue = '', searchAction, searchActionParams, placeholder}: Props) {

  const [label, setLabel] = useState(initValue);
  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm: string = useDebounce<string>(searchTerm, 500);
  const dispatch = useDispatch();

  useEffect(
    () => {
      if (debouncedSearchTerm) {
        dispatch(searchAction(debouncedSearchTerm, searchActionParams, callback))
      } else {
        setData(initialData);
      }
    },
    [debouncedSearchTerm, initialData]
  );

  const callback = (data: any) => {
    if (data?.error) {
      showPopup({
        title: data.message ? 'Searching error' : '',
        message: data.errorMessage ?? `Failed to search for additional options`,
        positiveButton: { text: 'Ok' },
      });
    } else {
      if (data?.data.length !== 0) {
        setData(_.map(data.data, (item: any) => ({
          name: item.name,
          id: item.id
        })));
      }
    }
  };

  const clearSelection = () => {
    setLabel('');
    setData(initialData);
    setSearchTerm('');
    onSelect?.({ id: '', name: '' });
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
          setLabel(option.label);
          onSelect?.({ id: option.key, name: option.label });
        }}
        onChangeSearch={(searchData: string) => setSearchTerm(searchData)}
        searchText="Search for more options..."
      >
        <TextInput
          style={styles.textInput}
          editable={false}
          placeholder={placeholder || ''}
          value={label}
        />
      </ModalSelector>
      {label ?
        <TouchableOpacity onPress={clearSelection}>
          <Image source={CLEAR} style={styles.imageIcon} />
        </TouchableOpacity> : null}
    </View>
  );
}
