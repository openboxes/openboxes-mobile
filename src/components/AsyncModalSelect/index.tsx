import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

import ModalSelector from 'react-native-modal-selector-searchable';
import CLEAR from '../../assets/images/icon_clear.png';
import { appConfig } from '../../constants';
import showPopup from '../Popup';
import styles from './styles';
import { Props } from './types';

const AsyncModalSelect = ({
  initialData,
  onSelect,
  initValue = '',
  searchAction,
  searchActionParams,
  placeholder,
  serverSearchEnabled = true
}: Props) => {
  const [label, setLabel] = useState(initValue);
  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (searchTerm) {
      dispatch(searchAction(searchTerm, searchActionParams, callback));
    } else {
      setData(initialData);
    }
  }, [searchTerm, initialData, dispatch, searchAction, searchActionParams]);

  const callback = (data: any) => {
    if (data?.error) {
      showPopup({
        title: data.message ? 'Searching error' : '',
        message: data.errorMessage ?? 'Failed to search for additional options',
        positiveButton: { text: 'Ok' }
      });
      return;
    }
    setData(
      _.map(data?.data, (item: any) => ({
        name: item.name,
        id: item.id
      }))
    );
  };

  const clearSelection = () => {
    setLabel('');
    setData(initialData);
    setSearchTerm('');
    onSelect?.({ id: '', name: '' });
  };

  const debounceOnSearchTerm = _.debounce((term: string) => setSearchTerm(term), appConfig.DEFAULT_DEBOUNCE_TIME);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.inputContainer}>
        <ModalSelector
          accessible
          initValue=""
          cancelText="Cancel"
          supportedOrientations={['landscape']}
          optionContainerStyle={styles.container}
          optionTextStyle={styles.option}
          scrollViewAccessibilityLabel="Scrollable options"
          data={data.map((item) => ({
            key: item.key || item.id,
            label: item.label || item.name
          }))}
          cancelButtonAccessibilityLabel="Cancel Button"
          searchText="Search for more options..."
          renderItem={() => null}
          onChange={(option: { label: string; key: any }) => {
            setLabel(option.label);
            onSelect?.({ id: option.key, name: option.label });
          }}
          onSearchFilterer={
            serverSearchEnabled
              ? (searchText, unfilteredData) => unfilteredData
              : (searchText, unfilteredData) =>
                  unfilteredData.filter((item) =>
                    (item.label || '').toLowerCase().includes((searchText || '').toLowerCase())
                  )
          }
          onChangeSearch={serverSearchEnabled ? debounceOnSearchTerm : undefined}
        >
          <TextInput
            multiline
            style={styles.textInput}
            editable={false}
            textAlignVertical="center"
            placeholder={placeholder || ''}
            value={label}
          />
        </ModalSelector>

        {label ? (
          <TouchableOpacity style={styles.imageIconContainer} onPress={clearSelection}>
            <Image source={CLEAR} style={styles.imageIcon} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default AsyncModalSelect;
