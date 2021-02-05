import React from "react";
// @ts-ignore
import { Block, Text } from "galio-framework";

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

export default class Home extends React.Component<Props, State> {

  render() {
    return (
      <Block flex center>
        <Text>
          If you can see this, then you are definitely logged in.
        </Text>
      </Block>
    );
  }
}
