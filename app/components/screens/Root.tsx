import React from "react";
import Dashboard from "./Dashboard";
import Login from "./Login";
import {connect} from "react-redux";
import FullScreenLoadingIndicator from "../FullScreenLoadingIndicator";
import {AppState} from "../../redux/Reducer";
import ChooseCurrentLocation from "./ChooseCurrentLocation";
import Location from "../../data/location/Location";
import {StyleSheet, View} from "react-native";
import {Session} from "../../data/auth/Session";
import getSession from "../../data/auth/GetSession";
import showPopup from "../Popup";

export interface OwnProps {
  //no-op
}

interface StateProps {
  loggedIn: boolean
  fullScreenLoadingIndicator: {
    visible: boolean;
    message?: string | null
  }
  currentLocation?: Location | null
  session?: Session | null
}

interface DispatchProps {
  getSession: () => void
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {
  //no-op
}

class Root extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.getSession = this.getSession.bind(this)
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return this.props.fullScreenLoadingIndicator.visible !== nextProps.fullScreenLoadingIndicator.visible ||
      this.props.loggedIn != nextProps.loggedIn ||
      this.props.currentLocation !== nextProps.currentLocation ||
      this.props.session !== nextProps.session
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
    if(this.props.loggedIn && this.props.currentLocation !== null && this.props.session === null) {
      (async () => {
        await this.getSession()
      })()
    }
  }

  async getSession(): Promise<void> {
    try {
      return await this.props.getSession()
    } catch(e) {
      await showPopup({
        message: "Failed to fetch session",
        positiveButtonText: "Retry"
      })
      return await this.getSession()
    }
  }

  render() {
    let content
    if (this.props.loggedIn) {
      if (this.props.currentLocation != null) {
        if(this.props.session != null) {
          content = <Dashboard/>
        } else {
          content = null
        }
      } else {
        content = <ChooseCurrentLocation/>
      }
    } else {
      content = <Login/>
    }
    return (
      <View style={styles.container}>
        <FullScreenLoadingIndicator
          visible={this.props.fullScreenLoadingIndicator.visible}
          message={this.props.fullScreenLoadingIndicator.message}
        />
        {content}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1
  }
})

const mapStateToProps = (state: AppState): StateProps => ({
  loggedIn: state.loggedIn,
  fullScreenLoadingIndicator: state.fullScreenLoadingIndicator,
  currentLocation: state.currentLocation,
  session: state.session
})

const mapDispatchToProps: DispatchProps = {
  getSession
};

export default connect<StateProps, DispatchProps, OwnProps, AppState>(mapStateToProps, mapDispatchToProps)(Root);
