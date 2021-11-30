import React, {useState} from 'react';
import styles from './styles';
import {Image, TouchableOpacity, View} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'
import {Props} from "./types";
import AutoComplete from "../AutoComplete/AutoComplete";

const Edit = require("../../assets/images/edit.png")
const Done = require('../../assets/images/tick.png')
const Dots = require('../../assets/images/dots.png')

export default function ({
                             refs,
                             value,
                             label,
                             showSelect,
                             disabled,
                             onChange,
                             editable = true,
                             onEndEdit,
                             style,
                             data
                         }: Props) {
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
                <AutoComplete
                    data={data}
                    menuStyle={{backgroundColor: 'white'}}
                    refs={refs}
                    label={label}
                    value={value}
                    disabled={edit || false}
                    onChange={onChange}
                    onEndEdit={(e) => {
                        if (onEndEdit) {
                            onEndEdit(e)
                        }
                    }}
                    inputStyle={style}
                    edit={edit}
                    // left={}
                    // right={}
                    // menuStyle={}
                />
                {
                    showSelect ?
                        <SelectDropdown
                            data={['EA', 'BX/10', 'CS/100', 'PL/100']}
                            onSelect={(selectedItem, index) => {
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
                {editable ? <TouchableOpacity
                    style={styles.editIcon}
                    onPress={onEdit}>
                    <Image source={edit ? Edit : Done}/>
                </TouchableOpacity> : null}
            </View>
        </View>

    );
}
