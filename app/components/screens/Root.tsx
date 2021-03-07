import React from "react";
import Home from "./Home";
import Login from "./Login";
import {connect} from "react-redux";
// @ts-ignore
import {Block} from "galio-framework";
import FullScreenLoadingIndicator from "../FullScreenLoadingIndicator";
import {AppState} from "../../redux/Reducer";

export interface OwnProps {
  //no-op
}

interface StateProps {
  user?: any;
  fullScreenLoadingIndicator: {
    visible: boolean;
  }
}

interface DispatchProps {
  //no-op
}


type Props = OwnProps & StateProps & DispatchProps;

interface State {
  //no-op
}

class Root extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return this.props.user !== nextProps.user ||
      this.props.fullScreenLoadingIndicator.visible !== nextProps.fullScreenLoadingIndicator.visible;
  }

  render() {
    return (
      <Block flex>
        <FullScreenLoadingIndicator visible={this.props.fullScreenLoadingIndicator.visible}/>
        {
          this.props.user
            ? <Home/>
            : <Login/>
        }
      </Block>
    );
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  user: state.user,
  fullScreenLoadingIndicator: state.fullScreenLoadingIndicator
});

const mapDispatchToProps: DispatchProps = {
  //no-op
};

export default connect<StateProps, DispatchProps, OwnProps, AppState>(mapStateToProps, mapDispatchToProps)(Root);
