import _, { Dictionary } from 'lodash';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Card, List, Text } from 'react-native-paper';
import { connect } from 'react-redux';

import GarageIcon from '../../assets/images/icon_garage.svg';
import EmptyView from '../../components/EmptyView';
import showPopup from '../../components/Popup';
import Location from '../../data/location/Location';
import { getLocationsAction, setCurrentLocationAction } from '../../redux/actions/locations';
import { hideScreenLoading, showScreenLoading } from '../../redux/actions/main';
import { RootState } from '../../redux/reducers';
import Theme from '../../utils/Theme';
import styles from './styles';

const NO_ORGANIZATION_NAME = 'No organization';
const NO_LOCATION_GROUP_NAME = 'NO_LOCATION_GROUP_PROVIDED';

export interface OwnProps {
  navigation: any;
  groupLocationEntries?: boolean;
  currentLocation?: Location | null
}

interface DispatchProps {
  getLocationsAction: (callback: (locations: any) => void) => void;
  setCurrentLocationAction: (location: Location, callback: (data: any) => void) => void;
  showScreenLoading: (message?: string) => void;
  hideScreenLoading: () => void;
}

type Props = OwnProps & DispatchProps;

interface State {
  availableLocations: Location[];
}

class ChooseCurrentLocation extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      availableLocations: []
    };
  }

  componentDidMount = () => {
    const actionCallback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.errorMessage ? 'Failed to load locations' : 'Error',
          message: data.errorMessage ?? 'Failed to load locations',
          positiveButton: {
            text: 'Retry',
            callback: () => {
              this.props.getLocationsAction(actionCallback);
            }
          },
          negativeButtonText: 'Cancel'
        });
      } else {
        const sortedLocations = _.sortBy(data, ['name']);

        this.setState({ availableLocations: sortedLocations });
        this.props.hideScreenLoading();
      }
    };
    this.props.getLocationsAction(actionCallback);
  };

  setCurrentLocation = async (location: Location) => {
    const actionCallback = (data: any) => {
      if (data?.error) {
        showPopup({
          message: 'Failed to set current location',
          positiveButton: {
            text: 'Try Again',
            callback: () => {
              this.props.setCurrentLocationAction(location, actionCallback);
            }
          },
          negativeButtonText: 'Cancel'
        });
      } else {
        global.location = location;
        this.props.navigation.navigate('Dashboard');
      }
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

  renderGroupedLocations = (locations: Dictionary<Location[]>, currentLocation: Location | null | undefined) => (
    <List.AccordionGroup>
      {_.map(_.keys(locations), (orgName: string) => {
        return (
          <List.Accordion
            title={orgName}
            description={`${locations[orgName].length} Location(s)`}
            id={`orgName_${orgName}`}
            left={(props) => <List.Icon {...props} color={Theme.colors.primary} icon="office-building" />}
            key={`orgName_${orgName}`}
            style={{ backgroundColor: Theme.colors.surface, borderRadius: Theme.roundness }}
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
        );
      })}
    </List.AccordionGroup>
  );

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

  render() {
    const { availableLocations } = this.state;
    const { groupLocationEntries, currentLocation } = this.props;

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

    return (
      <View>
        <ScrollView style={styles.scrollView}>
          {groupLocationEntries
            ? this.renderGroupedLocations(this.getSortedOrgNameAndLocationsDictionary(availableLocations), currentLocation)
            : this.renderAllLocations(availableLocations, currentLocation)}
        </ScrollView>
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
  setCurrentLocationAction,
  showScreenLoading,
  hideScreenLoading
};

export default connect(mapStateToProps, mapDispatchToProps)(ChooseCurrentLocation);
