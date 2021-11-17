import React, {useEffect, useState} from 'react';
import {
  Image,
  Modal,
  Text,
  Pressable,
  View,
  TextInput,
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import styles from './styles';
import {Props} from './types';
import {DispatchProps} from './types';
import {printLabelAction} from '../../redux/actions/products';
import {connect} from 'react-redux';
import productsReducer from '../../redux/reducers/productsReducer';
import {RootState} from '../../redux/reducers';
import InputBox from "../InputBox";
import Button from "../../components/Button";

const arrowDown = require('../../assets/images/arrow-down.png');

// const arrowUp = require('../../assets/images/arrow-down.png')

function PrintModal(props: Props) {
  const [label,setLabel] = useState<any>("1")
  console.log("PRint",props)
  const handleClick = () => {
    const {printLabelAction, defaultBarcodeLabelUrl, product} = props;
    printLabelAction({
      productId: product.id,
      barcodeId: defaultBarcodeLabelUrl['id'],
    });
  };

  const onChangeLabel = (text: string) => {
    setLabel(text)
  }
  return (
    <Modal
      animationType="slide"
      transparent={props.printModalVisible}
      visible={props.visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Image
            style={styles.image}
            source={{uri: props?.defaultBarcodeLabelUrl?.url}}
          />
          {/*<View style={styles.form}>*/}
          {/*    <View style={styles.sizeBox}>*/}
          {/*        <View style={styles.sizeItem}>*/}
          {/*            <Text style={styles.sizeLabel}>Width</Text>*/}
          {/*            <TextInput style={styles.inputLabel}/>*/}
          {/*        </View>*/}
          {/*        <View style={styles.sizeItem}>*/}
          {/*            <Text style={styles.sizeLabel}>Height</Text>*/}
          {/*            <TextInput style={styles.inputLabel}/>*/}
          {/*        </View>*/}

          {/*    </View>*/}
          {/*    <View>*/}
          {/*        <Text>Available printers</Text>*/}
          {/*        <SelectDropdown*/}
          {/*            data={['test-1', 'test-2', 'test-3']}*/}
          {/*            onSelect={(selectedItem, index) => {*/}
          {/*                console.log(selectedItem, index)*/}
          {/*            }}*/}
          {/*            renderDropdownIcon={()=> <Image style={styles.arrowDownIcon} source={arrowDown}/>}*/}
          {/*            buttonStyle ={styles.select}*/}
          {/*            buttonTextAfterSelection={(selectedItem, index) => selectedItem}*/}
          {/*            rowTextForSelection={(item, index) => item}*/}
          {/*        />*/}
          {/*    </View>*/}

          {/*</View>*/}
          <InputBox
              value={label}
              disabled={false}
              editable={false}
              onChange={onChangeLabel}
              label={'Number of Labels'}/>
          <View style={styles.bottom}>
            <Button
                title={'Print Label'}
                onPress={handleClick} />
          </View>
          <Pressable style={styles.buttonClose} onPress={props.closeModal}>
            <Text style={styles.textStyle}>X</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const mapStateToProps = (state: RootState) => ({
  printModalVisible: state.productsReducer.printModalVisible,
});

const mapDispatchToProps: DispatchProps = {
  printLabelAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(PrintModal);
