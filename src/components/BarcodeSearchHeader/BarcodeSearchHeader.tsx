import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { appConfig } from '../../constants';
import styles from './styles';

interface OwnProps {
  subtitle?: string | null;
  placeholder?: string;
  searchBox: boolean;
  onSearchTermSubmit: (query: string) => void;
  resetSearch?: () => void;
  autoSearch: boolean;
  autoFocus?: boolean;
}

const BarcodeSearchHeader: React.FC<OwnProps> = (props) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const navigation = useNavigation<any>();

  const onSearchTermSubmitRef = useRef(props.onSearchTermSubmit);
  onSearchTermSubmitRef.current = props.onSearchTermSubmit;

  const debouncedSearchTermSubmit = useRef(
    _.debounce((term: string) => onSearchTermSubmitRef.current(term), appConfig.DEFAULT_SEARCH_DEBOUNCE_TIME)
  ).current;

  // If autoSearch is true, then trigger onSearchTermSubmit on a searchTerm change
  useEffect(() => {
    if (props.autoSearch) {
      debouncedSearchTermSubmit(searchTerm);
    }
  }, [debouncedSearchTermSubmit, props.autoSearch, searchTerm]);

  // Cancel pending debounced calls on unmount
  useEffect(() => {
    return () => debouncedSearchTermSubmit.cancel();
  }, [debouncedSearchTermSubmit]);

  // Resets the search bar's search term on the navigation change
  useEffect(() => {
    return navigation.addListener('focus', () => {
      setSearchTerm('');
      if (props.resetSearch) {
        props.resetSearch();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, props.resetSearch]);

  const onSearchTermSubmit = () => {
    props.onSearchTermSubmit(searchTerm);
  };

  return (
    <View style={styles.container}>
      <Searchbar
        theme={{}}
        placeholder={props.placeholder ? props.placeholder : 'Search...'}
        value={searchTerm}
        style={styles.searchBar}
        autoFocus={props.autoFocus}
        onSubmitEditing={onSearchTermSubmit}
        onChangeText={setSearchTerm}
      />
    </View>
  );
};

export default BarcodeSearchHeader;
