import React from "react";
import {Text, View} from "react-native";

export interface OwnProps {
  //no-op
}

interface StateProps {
  //no-op
}

interface DispatchProps {
  //no-op
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {

}

export default class Dashboard extends React.Component<Props, State> {

  render() {
    return (
      <View>
        <Text>
          If you can see this, then you are definitely logged in.
        </Text>
      </View>
    );
  }
}
