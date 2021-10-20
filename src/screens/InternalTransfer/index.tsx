import React from 'react';
import {connect} from 'react-redux';
import styles from './styles';
import Location from '../../data/location/Location';
import _, {Dictionary} from 'lodash';
import {ScrollView, View, TouchableOpacity, Text, TextInput, Image} from 'react-native';
import Header from '../../components/Header';
import {List} from 'react-native-paper';
import {Props, State, DispatchProps} from  './types'
import showPopup from '../../components/Popup';
import InputBox from '../../components/InputBox';
import {showScreenLoading, hideScreenLoading} from '../../redux/actions/main';


class InternalTransfer extends React.Component<Props, State> {


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.from}>
          <InputBox label={'Product Code'}/>
          <InputBox label={'From'}/>
          <InputBox label={'To'}/>
          <InputBox label={'Quantity to transfer'} showSelect={true}/>
        </View>
          <View style={styles.bottom}>
            <TouchableOpacity style={styles.button}>
              <Text>TRANSFER</Text>
            </TouchableOpacity>
          </View>
      </View>
    );
  }
}

const mapDispatchToProps: DispatchProps = {
  showScreenLoading,
  hideScreenLoading,
};

export default connect(null, mapDispatchToProps)(InternalTransfer);
