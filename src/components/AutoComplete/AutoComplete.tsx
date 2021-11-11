import {View} from "react-native";
import {Menu, TextInput} from "react-native-paper";
import React, {useState} from "react";
import {Props} from "./types";
import styles from "./styles";

const AutoComplete = ({
                          value: origValue,
                          label,
                          refs,
                          edit,
                          data,
                          keyboard,
                          containerStyle,
                          onChange: origOnChange,
                          icon,
                          inputStyle = {},
                          menuStyle = {},
                          onEndEdit,
                          right = () => {
                          },
                          left = () => {
                          },
                      }: Props) => {
    const [value, setValue] = useState(origValue);
    const [menuVisible, setMenuVisible] = useState(false);
    const [filteredData, setFilteredData] = useState([]);

    const filterData = (text: string) => {
        return data.filter(
            (val: any) => val?.toLowerCase()?.indexOf(text?.toLowerCase()) > -1
        );
    };
    return (
        <View style={[styles.container, containerStyle]}>
            <TextInput
                onFocus={() => {
                    if (value && value.length === 0) {
                        setMenuVisible(true);
                    }
                }}
                onBlur={() => setMenuVisible(false)}
                label={label}
                right={right}
                left={left}
                style={[styles.input, inputStyle]}
                onChangeText={(text) => {
                    origOnChange(text);
                    if (data && text && text.length > 0) {
                        setFilteredData(filterData(text));
                    } else if (data && text && text.length === 0) {
                        setFilteredData(data);
                    }
                    setMenuVisible(true);
                    setValue(text);
                }}
                value={value}
                mode={"outlined"}
                ref={refs}
                placeholder={label}
                disabled={edit || false}
                keyboardType={keyboard || "default"}
                onEndEditing={(e) => {
                    if (onEndEdit) {
                        onEndEdit(e.nativeEvent.text)
                    }
                }}
            />
            {data && menuVisible && filteredData && (
                <View
                    style={styles.autoCompleteView}>
                    {filteredData && filteredData.map((datum, i) => (
                        <Menu.Item
                            key={i}
                            style={[styles.menuItem, menuStyle]}
                            // icon={icon}
                            onPress={() => {
                                setValue(datum);
                                setMenuVisible(false);
                            }}
                            title={datum}
                        />
                    ))}
                </View>
            )}
        </View>
    );
};

export default AutoComplete