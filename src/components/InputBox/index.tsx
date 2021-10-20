import React from 'react';
import styles from './styles';
import {View, TouchableOpacity, Text, TextInput, Image} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'
import {Props} from "./types";

export default function ({label, showSelect}: Props) {

    const renderIcon = () => {
        return (
            <Image style={styles.arrowDownIcon} source={require('../../assets/images/arrow-down.png')}/>
        )
    }

    return (
        <View style={styles.container}>
            <Text>{label}</Text>
            <View style={styles.row}>
                <View style={styles.box}>
                    <TextInput style={styles.input}/>
                    {
                        !showSelect ?
                            <Image source={require('../../assets/images/dots.png')}/>
                            :null
                    }
                </View>
                {
                    showSelect ?
                        <SelectDropdown
                            data={['EA', 'BX/10', 'CS/100', 'PL/100']}
                            onSelect={(selectedItem, index) => {
                                console.log(selectedItem, index)
                            }}
                            defaultValueByIndex={0}
                            renderDropdownIcon={renderIcon}
                            buttonStyle={styles.select}
                            buttonTextAfterSelection={(selectedItem, index) => selectedItem}
                            rowTextForSelection={(item, index) => item}
                        />
                        : null
                }

                <Image source={require('../../assets/images/edit.png')}/>
            </View>
        </View>

    );
}

