import _, { Dictionary } from 'lodash';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Card, List, Text } from 'react-native-paper';
import { connect } from 'react-redux';

import GarageIcon from '../../assets/images/icon_garage.svg';
import BarcodeSearchHeader from '../../components/BarcodeSearchHeader/BarcodeSearchHeader';
import EmptyView from '../../components/EmptyView';
import ListLoadingSkeleton from '../../components/ListLoadingSkeleton';
import showPopup from '../../components/Popup';
import Location from '../../data/location/Location';
import { getLocationsAction, setCurrentLocationAction } from '../../redux/actions/locations';
import { RootState } from '../../redux/reducers';
import Theme from '../../utils/Theme';
import LocationCardSkeleton from './LocationCardSkeleton';
import styles from './styles';

const NO_ORGANIZATION_NAME = 'No organization';
const NO_LOCATION_GROUP_NAME = 'NO_LOCATION_GROUP_PROVIDED';

export interface OwnProps {
  navigation: any;
  groupLocationEntries?: boolean;
  currentLocation?: Location | null;
}

interface DispatchProps {
  getLocationsAction: (callback: (locations: any) => void, suppressLoading?: boolean) => void;
  setCurrentLocationAction: (location: Location, callback: (data: any) => void, suppressLoading?: boolean) => void;
}

type Props = OwnProps & DispatchProps;

interface State {
  availableLocations: Location[];
  loading: boolean;
  searchTerm: string;
  expandedGroups: { [orgName: string]: boolean };
}

class ChooseCurrentLocation extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      availableLocations: [],
      loading: true,
      searchTerm: '',
      expandedGroups: {}
    };
  }

  onSearchTermSubmit = (query: string) => {
    this.setState((prev) => ({
      searchTerm: query,
      expandedGroups: query.trim() ? prev.expandedGroups : {}
    }));
  };

  resetSearch = () => {
    this.setState({ searchTerm: '', expandedGroups: {} });
  };

  toggleGroup = (orgName: string) => {
    this.setState((prev) => ({
      expandedGroups: {
        ...prev.expandedGroups,
        [orgName]: !(prev.expandedGroups[orgName] ?? true)
      }
    }));
  };

  getFilteredLocations = (): Location[] => {
    const term = this.state.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.state.availableLocations;
    }
    return this.state.availableLocations.filter((location) =>
      [location.name, location.organizationName, location.locationGroup?.name]
        .filter((field): field is string => Boolean(field))
        .some((field) => field.toLowerCase().includes(term))
    );
  };

  componentDidMount = () => {
    const actionCallback = (data: any) => {
      this.setState({ loading: false });
      if (data?.error) {
        showPopup({
          title: data.errorMessage ? 'Failed to load locations' : 'Error',
          message: data.errorMessage ?? 'Failed to load locations',
          positiveButton: {
            text: 'Retry',
            callback: () => {
              this.setState({ loading: true });
              this.props.getLocationsAction(actionCallback, true);
            }
          },
          negativeButtonText: 'Cancel'
        });
        return;
      }
      const sortedLocations = _.sortBy(data, ['name']);
      this.setState({ availableLocations: sortedLocations });
    };
    this.props.getLocationsAction(actionCallback, true);
  };

  setCurrentLocation = async (location: Location) => {
    const actionCallback = (data: any) => {
      if (data?.error) {
        showPopup({
          message: 'Failed to set current location',
          positiveButton: {
            text: 'Try Again',
            callback: () => {
              this.setCurrentLocation(location);
            }
          },
          negativeButtonText: 'Cancel'
        });
        return;
      }
      global.location = location;
      this.props.navigation.navigate('Dashboard');
    };

    this.props.setCurrentLocationAction(location, actionCallback);
  };

  getSortedOrgNameAndLocationsDictionary = (locations: Location[]): Dictionary<Location[]> => {
    // Group locations by organization name or 'No organization' if no name is provided
    const orgNameAndLocationsDictionary = _.groupBy(
      locations,
      (location: Location) => location.organizationName || NO_ORGANIZATION_NAME
    );

    // Sort the organization names alphabetically, with 'No organization' at the end
    const sortedOrgNames = _.orderBy(
      Object.keys(orgNameAndLocationsDictionary),
      [(orgName) => (orgName === NO_ORGANIZATION_NAME ? Infinity : orgName)],
      ['asc']
    );

    // Rebuild the dictionary with sorted keys
    return _.reduce(
      sortedOrgNames,
      (acc: Dictionary<Location[]>, orgName: string) => {
        const sortedLocations = _.orderBy(orgNameAndLocationsDictionary[orgName], ['name'], ['asc']);
        acc[orgName] = sortedLocations;
        return acc;
      },
      {}
    );
  };

  renderGroupedLocations = (locations: Dictionary<Location[]>, currentLocation: Location | null | undefined) => {
    const isSearching = this.state.searchTerm.trim().length > 0;

    const accordions = _.map(_.keys(locations), (orgName: string) => (
      <List.Accordion
        title={orgName}
        description={`${locations[orgName].length} Location(s)`}
        id={`orgName_${orgName}`}
        left={(props) => <List.Icon {...props} color={Theme.colors.primary} icon="office-building" />}
        key={`orgName_${orgName}`}
        style={{ backgroundColor: Theme.colors.surface, borderRadius: Theme.roundness }}
        {...(isSearching
          ? {
              expanded: this.state.expandedGroups[orgName] ?? true,
              onPress: () => this.toggleGroup(orgName)
            }
          : {})}
      >
        {_.map(locations[orgName], (location) => {
          const isSelected = currentLocation && location.id === currentLocation.id;

          return (
            <List.Item
              title={location.name}
              description={location.locationGroup?.name ?? NO_LOCATION_GROUP_NAME}
              key={`orgName_${orgName}_locationName_${location.name}`}
              hasTVPreferredFocus={false}
              tvParallaxProperties={undefined}
              style={[
                { backgroundColor: Theme.colors.surface, borderRadius: Theme.roundness },
                isSelected && styles.selectedItem
              ]}
              onPress={() => this.setCurrentLocation(location)}
            />
          );
        })}
      </List.Accordion>
    ));

    return isSearching ? <View>{accordions}</View> : <List.AccordionGroup>{accordions}</List.AccordionGroup>;
  };

  renderAllLocations = (locations: Location[], currentLocation: Location | null | undefined) =>
    locations.map((location) => {
      const isSelected = currentLocation && location.id === currentLocation.id;
      return (
        <Card
          key={location.id}
          style={[styles.cardContainer, isSelected && styles.selectedCard]}
          onPress={() => this.setCurrentLocation(location)}
        >
          <Card.Content style={styles.cardContent}>
            <View style={styles.contentContainer}>
              <GarageIcon width={48} height={48} />
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>{location.name}</Text>
                <Text style={styles.cardSubtitle}>{location.locationGroup?.name || NO_LOCATION_GROUP_NAME}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      );
    });

  renderContent = () => {
    const { availableLocations, loading, searchTerm } = this.state;
    const { groupLocationEntries, currentLocation } = this.props;

    if (loading) {
      return (
        <View style={styles.scrollView}>
          <ListLoadingSkeleton visible count={4} CardComponent={LocationCardSkeleton} />
        </View>
      );
    }

    if (!availableLocations || availableLocations.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <EmptyView
            title="No Locations Available"
            description="Please contact your administrator to set up locations."
          />
        </View>
      );
    }

    const filteredLocations = this.getFilteredLocations();

    if (filteredLocations.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <EmptyView title="No Locations Found" description={`No locations match "${searchTerm}".`} />
        </View>
      );
    }

    return (
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        {groupLocationEntries
          ? this.renderGroupedLocations(this.getSortedOrgNameAndLocationsDictionary(filteredLocations), currentLocation)
          : this.renderAllLocations(filteredLocations, currentLocation)}
      </ScrollView>
    );
  };

  render() {
    return (
      <View style={styles.screenContainer}>
        <BarcodeSearchHeader
          autoSearch
          searchBox={false}
          placeholder="Search locations"
          resetSearch={this.resetSearch}
          // Set debounceTime to 0 to trigger search immediately on submit, since the list is filtered client-side and is very fast
          debounceTime={0}
          loading={this.state.loading}
          accessibilityLabel="Search locations"
          onSearchTermSubmit={this.onSearchTermSubmit}
        />
        <View style={styles.content}>{this.renderContent()}</View>
      </View>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  groupLocationEntries: state.settingsReducer.groupLocationEntries,
  currentLocation: state.mainReducer.currentLocation
});

const mapDispatchToProps: DispatchProps = {
  getLocationsAction,
  setCurrentLocationAction
};

export default connect(mapStateToProps, mapDispatchToProps)(ChooseCurrentLocation);
