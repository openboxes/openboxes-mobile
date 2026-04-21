import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useSelector } from 'react-redux';

import { appConfig } from '../../constants';
import { RootState } from '../../redux/reducers';
import styles from './styles';

interface OwnProps {
  subtitle?: string | null;
  placeholder?: string;
  searchBox: boolean;
  onSearchTermSubmit: (query: string) => void;
  resetSearch?: () => void;
  autoSearch: boolean;
  autoFocus?: boolean;
  /**
   * Override the debounce time (in ms) applied when autoSearch is enabled.
   * Defaults to the `searchDebounceTime` from settings, or DEFAULT_SEARCH_DEBOUNCE_TIME.
   */
  debounceTime?: number;
  loading?: boolean;
  accessibilityLabel?: string;
}

const BarcodeSearchHeader: React.FC<OwnProps> = (props) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigation = useNavigation<any>();
  const storedDebounceTime = useSelector(
    (state: RootState) => state.settingsReducer.searchDebounceTime ?? appConfig.DEFAULT_SEARCH_DEBOUNCE_TIME
  );
  const searchDebounceTime = props.debounceTime !== undefined ? props.debounceTime : storedDebounceTime;

  const onSubmitRef = useRef(props.onSearchTermSubmit);
  useEffect(() => {
    onSubmitRef.current = props.onSearchTermSubmit;
  }, [props.onSearchTermSubmit]);

  const debouncedSubmit = useMemo(
    () => _.debounce((query: string) => onSubmitRef.current(query), searchDebounceTime),
    [searchDebounceTime]
  );

  useEffect(() => {
    return () => debouncedSubmit.cancel();
  }, [debouncedSubmit]);

  // Skip the very first render so mounting with an empty search term does
  // not race a sibling fetch (e.g. componentDidMount) and cause a double
  // fetch / double skeleton flash. Subsequent changes — user typing,
  // clearing via the X icon, or navigation-focus reset — still fire.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (props.autoSearch) {
      debouncedSubmit(searchTerm);
    }
  }, [searchTerm, props.autoSearch, debouncedSubmit]);

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
    debouncedSubmit.cancel();
    props.onSearchTermSubmit(searchTerm);
  };

  return (
    <View style={styles.container}>
      <Searchbar
        autoCompleteType="off"
        theme={{}}
        placeholder={props.placeholder ? props.placeholder : 'Search...'}
        value={searchTerm}
        style={styles.searchBar}
        autoFocus={props.autoFocus}
        loading={props.loading}
        returnKeyType="search"
        accessibilityLabel={props.accessibilityLabel ?? 'Search'}
        onSubmitEditing={onSearchTermSubmit}
        onChangeText={setSearchTerm}
      />
    </View>
  );
};

export default BarcodeSearchHeader;
