import React from "react";
import Home from "./Home";
import Login from "./Login";
import {connect} from "react-redux";
// @ts-ignore
import {Block} from "galio-framework";
import ProgressDialog from "../ProgressDialog";
import {AppState} from "../../redux/Reducer";

export interface OwnProps {
  //no-op
}

interface StateProps {
  user?: any;
  progressDialog: {
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
      this.props.progressDialog.visible !== nextProps.progressDialog.visible;
  }

  render() {
    return (
      <Block flex>
        <ProgressDialog visible={this.props.progressDialog.visible}/>
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
  progressDialog: state.progressDialog
});

const mapDispatchToProps: DispatchProps = {
  //no-op
};

export default connect<StateProps, DispatchProps, OwnProps, AppState>(mapStateToProps, mapDispatchToProps)(Root);
