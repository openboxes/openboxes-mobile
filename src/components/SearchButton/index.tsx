import _ from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import { TextInput as PaperTextInput } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';

import { appConfig } from '../../constants';
import { RootState } from '../../redux/reducers';
import Theme from '../../utils/Theme';
import { SkeletonList } from './SkeletonList';
import { SearchResult, SearchType, searchProviders } from './searchProviders';
import styles from './styles';

export type SearchButtonProps = {
  searchType: SearchType;
  onSelect: (value: string) => void;
  onOpen?: () => void;
  onClose?: () => void;
};

export function SearchButton({ searchType, onSelect, onOpen, onClose }: SearchButtonProps) {
  const [visible, setVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const dispatch = useDispatch();
  const searchDebounceTime = useSelector((state: RootState) => state.settingsReducer.searchDebounceTime);
  const provider = searchProviders[searchType];

  const performSearch = (term: string) => {
    if (!term.trim()) {
      setResults([]);
      setLoading(false);
      setHasSearched(false);
      return;
    }

    setLoading(true);

    dispatch(
      provider.createAction(term, ({ results: searchResults, error }) => {
        setLoading(false);
        setHasSearched(true);

        if (error) {
          Alert.alert('Search Error', error);
          return;
        }

        setResults(searchResults || []);
      })
    );
  };

  const performSearchRef = useRef(performSearch);
  useEffect(() => {
    performSearchRef.current = performSearch;
  });

  const debouncedSearch = useMemo(
    () =>
      _.debounce(
        (term: string) => performSearchRef.current(term),
        searchDebounceTime ?? appConfig.DEFAULT_SEARCH_DEBOUNCE_TIME
      ),
    [searchDebounceTime]
  );

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleChangeText = (text: string) => {
    setSearchTerm(text);
    setHasSearched(false);
    debouncedSearch(text);
  };

  const handleSelect = (item: SearchResult) => {
    setVisible(false);
    setSearchTerm('');
    setResults([]);
    debouncedSearch.cancel();
    onClose?.();
    onSelect(item.value);
  };

  const handleOpen = () => {
    setSearchTerm('');
    setResults([]);
    setHasSearched(false);
    setVisible(true);
    onOpen?.();
  };

  const handleClose = () => {
    setVisible(false);
    setSearchTerm('');
    setResults([]);
    setHasSearched(false);
    debouncedSearch.cancel();
    onClose?.();
  };

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={handleOpen}>
        <MaterialCommunityIcons name="text-search" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal transparent visible={visible} animationType="slide" onRequestClose={handleClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.headerRow}>
              <Text style={styles.title}>{provider.title}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <MaterialCommunityIcons name="close" size={18} color={Theme.colors.secondaryForeground} />
              </TouchableOpacity>
            </View>

            <PaperTextInput
              autoFocus
              mode="outlined"
              label={provider.inputLabel}
              placeholder={provider.placeholder}
              value={searchTerm}
              autoCorrect={false}
              autoCompleteType="off"
              onChangeText={handleChangeText}
            />

            {loading ? (
              <SkeletonList />
            ) : (
              <>
                {searchTerm.trim() === '' && results.length === 0 && (
                  <Text style={styles.hintText}>Start typing to search...</Text>
                )}

                {results.length > 0 && (
                  <Text style={styles.resultCount}>
                    {results.length} result{results.length !== 1 ? 's' : ''} found.
                  </Text>
                )}

                {hasSearched && results.length === 0 && <Text style={styles.emptyText}>No results found.</Text>}
              </>
            )}

            {!loading && (
              <FlatList
                style={styles.resultsList}
                data={results}
                keyExtractor={(item) => item.id}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.resultItem} onPress={() => handleSelect(item)}>
                    <View style={styles.resultAccent} />
                    <View style={styles.resultContent}>
                      <Text style={styles.resultLabel}>{item.label}</Text>
                      {item.subtitle !== item.label && (
                        <Text style={styles.resultSubtitle} numberOfLines={1}>
                          {item.subtitle}
                        </Text>
                      )}
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color={Theme.colors.secondaryForeground} />
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}
