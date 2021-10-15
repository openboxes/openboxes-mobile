import React, {useEffect, useState} from "react";
import {Image, Modal, Text, Pressable, View, TextInput} from "react-native";
import SelectDropdown from 'react-native-select-dropdown'
import styles from './styles'
import {Props} from "./types";

const arrowDown = require('../../assets/images/arrow-down.png')

// const arrowUp = require('../../assets/images/arrow-down.png')

function PrintModal(props: Props) {

    let [visible, setVisible] = useState(false)

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.visible}
            style={{backgroundColor: 'red'}}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Image
                        style={styles.image}
                        source={require('../../assets/images/barcode.png')}
                    />
                    <View style={styles.form}>
                        <View>
                            <Text>Number of labels</Text>
                            <TextInput style={styles.inputLabel}/>
                        </View>
                        <View>
                            <Text>Available printers</Text>
                            <SelectDropdown
                                data={['test-1', 'test-2', 'test-3']}
                                onSelect={(selectedItem, index) => {
                                    console.log(selectedItem, index)
                                }}
                                renderDropdownIcon={()=> <Image style={styles.arrowDownIcon} source={arrowDown}/>}
                                buttonStyle ={styles.select}
                                buttonTextAfterSelection={(selectedItem, index) => selectedItem}
                                rowTextForSelection={(item, index) => item}
                            />
                        </View>


                    </View>
                    <Pressable
                        style={styles.buttonClose}
                        onPress={props.closeModal}
                    >
                        <Text style={styles.textStyle}>X</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};


export default PrintModal;
