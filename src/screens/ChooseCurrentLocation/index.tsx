import React from 'react';
import { connect } from 'react-redux';
import styles from './styles';
import Location from '../../data/location/Location';
import _, { Dictionary } from 'lodash';
import { ScrollView, View } from 'react-native';
import { List } from 'react-native-paper';
import showPopup from '../../components/Popup';
import { hideScreenLoading, showScreenLoading } from '../../redux/actions/main';
import { getLocationsAction, setCurrentLocationAction } from '../../redux/actions/locations';

const NO_ORGANIZATION_NAME = 'No organization';
const NO_LOCATION_GROUP_NAME = 'NO_LOCATION_GROUP_PROVIDED';

export interface OwnProps {
  navigation: any;
}

interface DispatchProps {
  getLocationsAction: (callback: (locations: any) => void) => void;
  setCurrentLocationAction: (location: Location, callback: (data: any) => void) => void;
  showScreenLoading: (message?: string) => void;
  hideScreenLoading: () => void;
}

type Props = OwnProps & DispatchProps;

interface State {
  orgNameAndLocationsDictionary: Dictionary<Location[]>;
}

class ChooseCurrentLocation extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      orgNameAndLocationsDictionary: {}
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
        const orgNameAndLocationsDictionary = this.getSortedOrgNameAndLocationsDictionary(data);
        this.setState({ orgNameAndLocationsDictionary });
        this.props.hideScreenLoading();
      }
    };
    this.props.getLocationsAction(actionCallback);
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

  setCurrentLocation = async (orgName: string, location: Location) => {
    showPopup({
      message: `Do you want to select current location as ${location.name}?`,
      positiveButton: {
        text: 'Yes',
        callback: () => {
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
        }
      },
      negativeButtonText: 'No'
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <List.AccordionGroup>
            {_.map(_.keys(this.state.orgNameAndLocationsDictionary), (orgName: string) => {
              return (
                <List.Accordion
                  title={orgName}
                  description={`${this.state.orgNameAndLocationsDictionary[orgName].length} Location(s)`}
                  id={`orgName_${orgName}`}
                  left={(props) => (
                    <View style={styles.iconContainer}>
                      <List.Icon {...props} color="#fff" icon="office-building" />
                    </View>
                  )}
                  key={`orgName_${orgName}`}
                >
                  {_.map(this.state.orgNameAndLocationsDictionary[orgName], (location) => {
                    return (
                      <List.Item
                        title={location.name}
                        description={location.locationGroup?.name ?? NO_LOCATION_GROUP_NAME}
                        key={`orgName_${orgName}_locationName_${location.name}`}
                        hasTVPreferredFocus={false}
                        tvParallaxProperties={undefined}
                        onPress={() => this.setCurrentLocation(orgName, location)}
                      />
                    );
                  })}
                </List.Accordion>
              );
            })}
          </List.AccordionGroup>
        </ScrollView>
      </View>
    );
  }
}

const mapDispatchToProps: DispatchProps = {
  getLocationsAction,
  setCurrentLocationAction,
  showScreenLoading,
  hideScreenLoading
};

export default connect(null, mapDispatchToProps)(ChooseCurrentLocation);
