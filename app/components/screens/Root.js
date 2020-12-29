import React from "react";
import Home from "./Home";
import Login from "./Login";
import {connect} from "react-redux";
import {Block} from "galio-framework";
import ProgressDialog from "../ProgressDialog";

class Root extends React.Component {

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
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

const mapStateToProps = state => ({
  user: state.user,
  progressDialog: state.progressDialog
});

const mapDispatchToProps = {
  //no-op
};

export default connect(mapStateToProps, mapDispatchToProps)(Root);
