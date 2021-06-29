import {FAB} from "react-native-paper";
import React from "react";
import Icon, {Name} from "../../Icon";
import Theme from "../../../utils/Theme";

export interface Props {
  visible: boolean
  onSearchByProductNamePress: () => void
  onSearchByCategoryPress: () => void
}

interface State {
  open: boolean
}

export default class FloatingActionButtonMenu extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      open: false
    }
    this.flipOpenState = this.flipOpenState.bind(this)
  }

  flipOpenState() {
    const isOpen = this.state.open
    this.setState({
      open: !isOpen
    })
  }

  onSearchByProductNamePress() {
    this.flipOpenState()
    this.props.onSearchByProductNamePress()
  }

  onSearchByCategoryPress() {
    this.flipOpenState()
    this.props.onSearchByCategoryPress()
  }

  render() {
    return (
      <FAB.Group
        visible={this.props.visible}
        open={this.state.open}
        icon={() => <Icon name={Name.Search} size={24} color="#FFFFFF"/>}
        actions={[
          {
            icon: () => <Icon name={Name.Boxes} size={22}/>,
            label: "Search by product name",
            onPress: () => this.onSearchByProductNamePress(),
          },
          {
            icon: () => <Icon name={Name.Category} size={22}/>,
            label: "Search by category",
            onPress: () => this.onSearchByCategoryPress()
          }
        ]}
        onPress={this.flipOpenState}
        onStateChange={() => {
        }}
        fabStyle={{
          backgroundColor: Theme.colors.primary
        }}
      />
    );
  }
}