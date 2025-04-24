import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Searchbar } from 'react-native-paper';
import styles from './styles';
import { View } from 'react-native';
import Theme from '../../utils/Theme';

interface OwnProps {
  subtitle?: string | null;
  placeholder?: string;
  searchBox: boolean;
  onSearchTermSubmit: (query: string) => void;
  resetSearch?: () => void;
  autoSearch: boolean | false;
  autoFocus?: boolean | false;
}

const BarcodeSearchHeader: React.FC<OwnProps> = (props) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const navigation = useNavigation<any>();

  // If autoSearch is true, then trigger onSearchTermSubmit on a searchTerm change
  useEffect(() => {
    if (props.autoSearch) {
      onSearchTermSubmit();
    }
  }, [searchTerm]);

  // Resets the search bar's search term on the navigation change
  useEffect(() => {
    return navigation.addListener('focus', () => {
      setSearchTerm('');
      if (props.resetSearch) {
        props.resetSearch();
      }
    });
  }, [navigation]);

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
