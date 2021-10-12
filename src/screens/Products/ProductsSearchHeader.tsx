// noinspection DuplicatedCode

import React, {ReactElement} from 'react';
import {Searchbar} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import {Platform, StatusBar} from 'react-native';
// import Icon, {Name} from '../../Icon';
import Theme from '../../utils/Theme';
// import {setStatusBarBackgroundColor} from 'expo-status-bar';
import Header from '../../components/Header';

export interface Props {
  subtitle?: string | null;
  searchBoxVisible: boolean;
  onBackButtonPress?: () => void;
  onSearchBoxVisibilityChange: (visible: boolean) => void;
  onSearchQuerySubmitted: (query: string) => void;
}

interface State {
  searchQuery: string;
}

const backgroundColor = Theme.colors.primary;
const white = '#FFFFFF';
/*
placeholderColor dictates the color of the "hint" shown in the SearchBar input area.
*/
const placeholderColor = '#FFFFFF80';

/*
Starts out as a basic header with a back button, title and the search button.

When the user taps on the search button, the header transforms into a search box. The default Searchbar component
does not follow the color template of their header component. So changes have been made to the theme and styling of the
SearchBar component to ensure that the color scheme of the normal header and the Searchbar remains the same.
*/
export default class ProductsSearchHeader extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      searchQuery: '',
    };
    this.onSearchButtonPress = this.onSearchButtonPress.bind(this);
    this.onSearchQueryChange = this.onSearchQueryChange.bind(this);
    this.onClearIconPressed = this.onClearIconPressed.bind(this);
    // this.getClearIcon = this.getClearIcon.bind(this);
    this.onSearchQuerySubmitted = this.onSearchQuerySubmitted.bind(this);
    // setStatusBarBackgroundColor(Theme.colors.primary, false);
  }

  onSearchButtonPress() {
    this.props.onSearchBoxVisibilityChange(true);
  }

  onSearchQueryChange(query: string) {
    this.setState({
      searchQuery: query,
    });
  }

  onClearIconPressed() {
    if (this.state.searchQuery.length == 0) {
      this.props.onSearchBoxVisibilityChange(false);
    } else {
      this.setState({
        searchQuery: '',
      });
    }
  }

  // getClearIcon(): ReactElement {
  //   return (
  //     <Icon
  //       name={Name.Cross}
  //       onPress={this.onClearIconPressed}
  //       size={24}
  //       color={Theme.colors.surface}
  //     />
  //   );
  // }

  onSearchQuerySubmitted() {
    this.props.onSearchQuerySubmitted(this.state.searchQuery);
  }

  render() {
    return !this.props.searchBoxVisible ? (
      <Header
        title="Products"
        subtitle={this.props.subtitle}
        backButtonVisible={true}
        onBackButtonPress={this.props.onBackButtonPress}
      />
    ) : (
      <Searchbar
        theme={{
          colors: {
            /*
                This ensures that the selection color and the text input cursor color is set to white. This is
                necessary since the background color has been set to the normally primary purple color.
                */
            primary: white,
            placeholder: placeholderColor,
          },
        }}
        placeholder="Search by product name"
        onChangeText={this.onSearchQueryChange}
        value={this.state.searchQuery}
        style={styles.searchBar}
        // clearIcon={this.getClearIcon}
        autoFocus={true}
        inputStyle={{
          color: white,
        }}
        iconColor={white}
        onSubmitEditing={this.onSearchQuerySubmitted}
      />
    );
  }
}

const styles = StyleSheet.create({
  searchBar: {
    height: 56,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    elevation: 4,
    backgroundColor: backgroundColor,
    borderRadius: 0,
    color: white,
  },
});
