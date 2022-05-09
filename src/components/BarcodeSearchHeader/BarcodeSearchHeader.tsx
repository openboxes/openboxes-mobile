import React, {useEffect, useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import { Searchbar } from 'react-native-paper';
import styles  from './styles';
import { Props } from './types';

const BarcodeSearchHeader = (props: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const navigation = useNavigation<any>();

  // If autoSearch is true, then trigger onSearchTermSubmit on a searchTerm change
  useEffect(() => {
    if (props.autoSearch) {
      onSearchTermSubmit()
    }
  }, [searchTerm]);


  // Resets the search bar's search term on the navigation change
  useEffect(() => {
    return navigation.addListener('focus', () => {
      setSearchTerm('');
      props.resetSearch();
    });
  }, [navigation]);

  const onSearchTermSubmit = () => {
    props.onSearchTermSubmit(searchTerm);
  }

  return (
    <Searchbar
      theme={{}}
      placeholder={props.placeholder ? props.placeholder : 'Search by barcode'}
      value={searchTerm}
      style={styles.searchBar}
      autoFocus={props.autoFocus}
      onSubmitEditing={onSearchTermSubmit}
      onChangeText={setSearchTerm}
    />
  );
}

export default BarcodeSearchHeader;
