import _ from 'lodash';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { connect } from 'react-redux';

import GarageIcon from '../../assets/images/icon_garage.svg';
import EmptyView from '../../components/EmptyView';
import showPopup from '../../components/Popup';
import Location from '../../data/location/Location';
import { getLocationsAction, setCurrentLocationAction } from '../../redux/actions/locations';
import { hideScreenLoading, showScreenLoading } from '../../redux/actions/main';
import styles from './styles';

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
    const { availableLocations } = this.state;

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
          {availableLocations.map((location) => (
            <Card key={location.id} style={styles.cardContainer} onPress={() => this.setCurrentLocation(location)}>
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
          ))}
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
