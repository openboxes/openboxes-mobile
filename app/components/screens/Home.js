import React from "react";
import { Block, Text } from "galio-framework";

export default class Home extends React.Component {

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
