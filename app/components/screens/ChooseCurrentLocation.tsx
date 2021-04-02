import React from "react";
import {AppState} from "../../redux/Reducer";
import {connect} from "react-redux";
import getLocations from "../../data/location/GetLocations";
import {Location} from "../../data/location/Models";
import _, {Dictionary} from "lodash";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import {createLogger} from "../../utils/Logger";
import Header from "../Header";
import {List} from "react-native-paper";
import showPopup from "../Popup";
import setCurrentLocation from "../../data/location/SetCurrentLocation";
import {ApiError} from "../../utils/ApiClient";

const logger = createLogger("ChooseCurrentLocation.tsx")
const NO_ORGANIZATION_NAME = "No organization"

export interface OwnProps {
  //no-op
}

interface StateProps {
  //no-op
}

interface DispatchProps {
  setCurrentLocation: (location: Location) => void
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
  }

  componentDidMount() {
    (async () => {
      //FIXME: Implement retry mechanism in case API fails.
      let locations = await getLocations()
      let orgNameAndLocationsDictionary =
        _.groupBy(
          locations,
          (location: Location) => {
            if (location.organizationName) return location.organizationName
            else return NO_ORGANIZATION_NAME
          }
        )
      orgNameAndLocationsDictionary =
        _.keys(orgNameAndLocationsDictionary)
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

      this.setState({
        orgNameAndLocationsDictionary: orgNameAndLocationsDictionary
      })
    })()
  }

  async onLocationSelected(orgName: string, location: Location) {
    const selected = await showPopup({
      message: `Do you want to select current location as ${location.name}?`,
      positiveButtonText: "Yes",
      negativeButtonText: "No"
    })
    if(!selected) return
    await this.setCurrentLocation(location)
  }

  async setCurrentLocation(location: Location): Promise<boolean> {
    try {
      await this.props.setCurrentLocation(location)
      return true
    } catch(e) {
      logger.e("setCurrentLocation failed", e)
      const tryAgain = await showPopup({
        message: "Failed to set current location",
        positiveButtonText: "Try Again",
        negativeButtonText: "Cancel"
      })
      if(tryAgain) return this.setCurrentLocation(location)
      else return false
    }
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
  setCurrentLocation
};


export default connect<StateProps, DispatchProps, OwnProps, AppState>(mapStateToProps, mapDispatchToProps)(ChooseCurrentLocation);
