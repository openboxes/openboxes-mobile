import React, {useState} from 'react';
import styles from './styles';
import {View, TouchableOpacity, Text, Image} from 'react-native';
import {TextInput} from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown'
import {Props} from "./types";
const Edit = require("../../assets/images/edit.png")
const Done = require( '../../assets/images/tick.png')
const Dots = require('../../assets/images/dots.png')

export default function ({refs, value, label, showSelect, disabled, onChange, keyboard, editable = true, onEndEdit}: Props) {
    const [edit, setEdit] = useState(disabled)
    const onEdit = () => {
        setEdit(!edit)
    }


    const renderIcon = () => {
        return (
            <Image style={styles.arrowDownIcon} source={require('../../assets/images/arrow-down.png')}/>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <TextInput
                    mode={"outlined"}
                    ref={refs}
                    label={label}
                    placeholder={label}
                    value={value}
                    disabled={edit||false}
                    keyboardType={keyboard||"default"}
                    onChangeText={onChange}
                    onEndEditing={(e) =>{
                        if (onEndEdit) {
                            onEndEdit(e.nativeEvent.text)
                        }}}
                    style={styles.input}
                    right={!showSelect ?
                        <TextInput.Icon name={Dots}/>
                        : null}
                />
                {
                    showSelect ?
                        <SelectDropdown
                            data={['EA', 'BX/10', 'CS/100', 'PL/100']}
                            onSelect={(selectedItem, index) => {
                                console.log(selectedItem, index)
                            }}
                            disabled={!editable}
                            defaultValueByIndex={0}
                            renderDropdownIcon={renderIcon}
                            buttonStyle={styles.select}
                            buttonTextAfterSelection={(selectedItem, index) => selectedItem}
                            rowTextForSelection={(item, index) => item}
                        />
                        : null
                }
                {editable?<TouchableOpacity
                    onPress={onEdit}>
                    <Image source={edit ? Edit : Done}/>
                </TouchableOpacity>: null}
            </View>
        </View>

    );
}

