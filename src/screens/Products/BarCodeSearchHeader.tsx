// noinspection DuplicatedCode

import React, {ReactElement} from 'react';
import {Searchbar} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import {Platform, StatusBar} from 'react-native';
// import {setStatusBarBackgroundColor} from 'expo-status-bar';


export interface Props {
  subtitle?: string | null;
  searchBox: boolean;
  onBarCodeSearchQuerySubmitted: (query: string) => void;
}

interface State {
  searchQuery: string;
}

/*
Starts out as a basic header with a back button, title and the search button.

When the user taps on the search button, the header transforms into a search box. The default Searchbar component
does not follow the color template of their header component. So changes have been made to the theme and styling of the
SearchBar component to ensure that the color scheme of the normal header and the Searchbar remains the same.
*/
export default class ProductsSearchCodeHeader extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      searchQuery: '',
    };
    this.onSearchQueryChange = this.onSearchQueryChange.bind(this);
    this.onBarCodeSearchQuerySubmitted =
      this.onBarCodeSearchQuerySubmitted.bind(this);
    // setStatusBarBackgroundColor(Theme.colors.primary, false);
  }

  onSearchQueryChange(query: string) {
    this.setState({
      searchQuery: query,
    });
  }

  onBarCodeSearchQuerySubmitted() {
    this.props.onBarCodeSearchQuerySubmitted(this.state.searchQuery);
  }

  render() {
    return (
      <Searchbar
        theme={{}}
        placeholder="Search by barcode"
        onChangeText={this.onSearchQueryChange}
        value={this.state.searchQuery}
        style={styles.searchBar}
        autoFocus={true}
        onSubmitEditing={this.onBarCodeSearchQuerySubmitted}
      />
    );
  }
}

const styles = StyleSheet.create({
  searchBar: {
    height: 56,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    elevation: 4,
    borderRadius: 0,
  },
});
