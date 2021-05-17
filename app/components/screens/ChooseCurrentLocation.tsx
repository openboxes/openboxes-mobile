import React from "react";
import {AppState} from "../../redux/Reducer";
import {connect} from "react-redux";
import getLocationsFromApi from "../../data/location/GetLocations";
import Location from "../../data/location/Location";
import _, {Dictionary} from "lodash";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import Header from "../Header";
import {List} from "react-native-paper";
import showPopup from "../Popup";
import setCurrentLocation from "../../data/location/SetCurrentLocation";
import {
  dispatchHideProgressBarAction as hideProgressBar,
  dispatchShowProgressBarAction as showProgressBar
} from "../../redux/Dispatchers";

const NO_ORGANIZATION_NAME = "No organization"

export interface OwnProps {
  //no-op
}

interface StateProps {
  //no-op
}

interface DispatchProps {
  setCurrentLocation: (location: Location) => void
  showProgressBar: (message?: string) => void
  hideProgressBar: () => void
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {
  orgNameAndLocationsDictionary: Dictionary<Location[]>
}

class ChooseCurrentLocation extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      orgNameAndLocationsDictionary: {}
    }
    this.onLocationSelected = this.onLocationSelected.bind(this)
    this.setCurrentLocation = this.setCurrentLocation.bind(this)
    this.getLocations = this.getLocations.bind(this)
    this.getSortedOrgNameAndLocationsDictionary = this.getSortedOrgNameAndLocationsDictionary.bind(this)
  }

  componentDidMount() {
    (async () => {
      const locations = await this.getLocations()
      const orgNameAndLocationsDictionary = this.getSortedOrgNameAndLocationsDictionary(locations)
      this.setState({
        orgNameAndLocationsDictionary: orgNameAndLocationsDictionary
      })
    })()
  }

  async getLocations(): Promise<Location[]> {
    try {
      this.props.showProgressBar("Fetching locations")
      return await getLocationsFromApi()
    } catch (e) {
      const title = e.message ? "Failed to load locations" : null
      const message = e.message ?? "Failed to load locations"
      await showPopup({
        title: title,
        message: message,
        positiveButtonText: "Retry"
      })
      return await this.getLocations()
    } finally {
      this.props.hideProgressBar()
    }
  }

  getSortedOrgNameAndLocationsDictionary(locations: Location[]): Dictionary<Location[]> {
    let orgNameAndLocationsDictionary =
      _.groupBy(
        locations,
        (location: Location) => {
          if (location.organizationName) return location.organizationName
          else return NO_ORGANIZATION_NAME
        }
      )
     return _.keys(orgNameAndLocationsDictionary)
        .sort((leftOrgName: string, rightOrgName: string) => {
          if(leftOrgName == NO_ORGANIZATION_NAME && rightOrgName == NO_ORGANIZATION_NAME) {
            return 0
          } else if(leftOrgName == NO_ORGANIZATION_NAME) {
            return 1
          } else if(rightOrgName == NO_ORGANIZATION_NAME) {
            return -1
          } else {
            if(leftOrgName == rightOrgName) {
              return 0
            } else if(leftOrgName > rightOrgName) {
              return 1
            } else {
              return -1
            }
          }
        })
        .reduce((acc: {}, orgName: string) => ({
          ...acc, [orgName]: orgNameAndLocationsDictionary[orgName]
        }), {})
  }

  async onLocationSelected(orgName: string, location: Location) {
    const selected = await showPopup({
      message: `Do you want to select current location as ${location.name}?`,
      positiveButtonText: "Yes",
      negativeButtonText: "No"
    })
    if(!selected) return
    this.setCurrentLocation(location)
  }

  setCurrentLocation(location: Location) {
    (async () => {
      try {
        this.props.setCurrentLocation(location)
      } catch(e) {
        const tryAgain = await showPopup({
          message: "Failed to set current location",
          positiveButtonText: "Try Again",
          negativeButtonText: "Cancel"
        })
        if(tryAgain) this.setCurrentLocation(location)
      }
    })()
  }

  render() {
    return (
      <View style={styles.container}>
        <Header title="Choose Location"/>
        <ScrollView style={styles.scrollView}>
          <List.AccordionGroup>
            {
              _.map(_.keys(this.state.orgNameAndLocationsDictionary), (orgName: string) => {
                return (
                  <List.Accordion
                    title={orgName}
                    id={`orgName_${orgName}`}
                    left={props => <List.Icon {...props} icon="office-building"/>}
                    key={`orgName_${orgName}`}
                  >
                    {
                      _.map(this.state.orgNameAndLocationsDictionary[orgName], location => {
                        return (
                          <List.Item
                            title={location.name}
                            key={`orgName_${orgName}_locationName_${location.name}`}
                            onPress={() => this.onLocationSelected(orgName, location)}
                          />
                        )
                      })
                    }
                  </List.Accordion>
                )
              })
            }
          </List.AccordionGroup>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1
  },
  scrollView: {}
});
const mapStateToProps = (state: AppState): StateProps => ({
  //no-op
});

const mapDispatchToProps: DispatchProps = {
  setCurrentLocation,
  showProgressBar,
  hideProgressBar
};


export default connect<StateProps, DispatchProps, OwnProps, AppState>(mapStateToProps, mapDispatchToProps)(ChooseCurrentLocation);
