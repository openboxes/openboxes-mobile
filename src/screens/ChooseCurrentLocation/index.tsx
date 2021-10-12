import React from 'react';
import {connect} from 'react-redux';
import styles from './styles';
import Location from '../../data/location/Location';
import _, {Dictionary} from 'lodash';
import {ScrollView, View} from 'react-native';
import Header from '../../components/Header';
import {List} from 'react-native-paper';
import showPopup from '../../components/Popup';
import {showScreenLoading, hideScreenLoading} from '../../redux/actions/main';
import {
  setCurrentLocationAction,
  getLocationsAction,
} from '../../redux/actions/locations';

const NO_ORGANIZATION_NAME = 'No organization';

export interface OwnProps {
  navigation: any;
}

interface StateProps {
  //no-op
}

interface DispatchProps {
  getLocationsAction: (callback: (locations: any) => void) => void;
  setCurrentLocationAction: (
    location: Location,
    callback: (data: any) => void,
  ) => void;
  showScreenLoading: (message?: string) => void;
  hideScreenLoading: () => void;
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {
  orgNameAndLocationsDictionary: Dictionary<Location[]>;
}

class ChooseCurrentLocation extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      orgNameAndLocationsDictionary: {},
    };
  }

  componentDidMount = () => {
    const actionCallback = (data: any) => {
      if (data?.error) {
        showPopup({
          title: data.error.message ? 'Failed to load locations' : null,
          message: data.error.message ?? 'Failed to load locations',
          positiveButton: {
            text: 'Retry',
            callback: () => {
              this.props.getLocationsAction(actionCallback);
            },
          },
          negativeButtonText: 'Cancel',
        });
      } else {
        const orgNameAndLocationsDictionary =
          this.getSortedOrgNameAndLocationsDictionary(data);
        this.setState({
          orgNameAndLocationsDictionary: orgNameAndLocationsDictionary,
        });
        this.props.hideScreenLoading();
      }
    };
    this.props.getLocationsAction(actionCallback);
  };

  getSortedOrgNameAndLocationsDictionary = (
    locations: Location[],
  ): Dictionary<Location[]> => {
    let orgNameAndLocationsDictionary = _.groupBy(
      locations,
      (location: Location) => {
        if (location.organizationName) {
          return location.organizationName;
        } else {
          return NO_ORGANIZATION_NAME;
        }
      },
    );
    return _.keys(orgNameAndLocationsDictionary)
      .sort((leftOrgName: string, rightOrgName: string) => {
        if (
          leftOrgName == NO_ORGANIZATION_NAME &&
          rightOrgName == NO_ORGANIZATION_NAME
        ) {
          return 0;
        } else if (leftOrgName == NO_ORGANIZATION_NAME) {
          return 1;
        } else if (rightOrgName == NO_ORGANIZATION_NAME) {
          return -1;
        } else {
          if (leftOrgName == rightOrgName) {
            return 0;
          } else if (leftOrgName > rightOrgName) {
            return 1;
          } else {
            return -1;
          }
        }
      })
      .reduce(
        (acc: {}, orgName: string) => ({
          ...acc,
          [orgName]: orgNameAndLocationsDictionary[orgName],
        }),
        {},
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
                    this.props.setCurrentLocationAction(
                      location,
                      actionCallback,
                    );
                  },
                },
                negativeButtonText: 'Cancel',
              });
            } else {
              this.props.navigation.navigate('Dashboard');
            }
          };

          this.props.setCurrentLocationAction(location, actionCallback);
        },
      },
      negativeButtonText: 'No',
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Header title="Choose Location" backButtonVisible={false} />
        <ScrollView style={styles.scrollView}>
          <List.AccordionGroup>
            {_.map(
              _.keys(this.state.orgNameAndLocationsDictionary),
              (orgName: string) => {
                return (
                  <List.Accordion
                    title={orgName}
                    id={`orgName_${orgName}`}
                    left={props => (
                      <List.Icon {...props} icon="office-building" />
                    )}
                    key={`orgName_${orgName}`}>
                    {_.map(
                      this.state.orgNameAndLocationsDictionary[orgName],
                      location => {
                        return (
                          <List.Item
                            title={location.name}
                            key={`orgName_${orgName}_locationName_${location.name}`}
                            onPress={() =>
                              this.setCurrentLocation(orgName, location)
                            }
                          />
                        );
                      },
                    )}
                  </List.Accordion>
                );
              },
            )}
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
  hideScreenLoading,
};

export default connect(null, mapDispatchToProps)(ChooseCurrentLocation);
