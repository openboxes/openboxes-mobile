import React from "react";
import {ViewProps} from "react-native";
import {AppState} from "../redux/Reducer";
import {connect} from "react-redux";
import {Appbar} from "react-native-paper";

export interface OwnProps extends ViewProps {
  title: string
}

interface StateProps {

}

interface DispatchProps {

}

type Props = OwnProps & StateProps & DispatchProps

interface State {

}

class Header extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
  }

  render() {
    return (
      <Appbar.Header>
        <Appbar.Content title={this.props.title}/>
      </Appbar.Header>
    )
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  //no-op
});

const mapDispatchToProps: DispatchProps = {
  //no-op
};

export default connect<StateProps, DispatchProps, OwnProps, AppState>(mapStateToProps, mapDispatchToProps)(Header)
