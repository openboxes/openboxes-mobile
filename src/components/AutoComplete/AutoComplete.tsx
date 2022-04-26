import {Image, TouchableOpacity, View} from 'react-native';
import {Menu, TextInput} from 'react-native-paper';
import React, {useState} from 'react';
import {Props} from './types';
import styles from './styles';
import CLEAR from "../../assets/images/icon_clear.png";

const AutoComplete = ({
  value,
  label,
  refs,
  edit,
  data,
  keyboard,
  containerStyle,
  onChange: origOnChange,
  icon,
  onIconClick,
  inputStyle = {},
  menuStyle = {},
  onEndEdit,
  right = () => {},
  left = () => {},
  placeholder,
}: Props) => {
  // const [inputValue, setInputValue] = useState(value);
  const [menuVisible, setMenuVisible] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  const filterData = (text: string) => {
    return data.filter(
      (val: any) => val?.toLowerCase()?.indexOf(text?.toLowerCase()) > -1,
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
        onChangeText={text => {
          origOnChange(text);
          if (data && text && text.length > 0) {
            setFilteredData(filterData(text));
          } else if (data && text && text.length === 0) {
            setFilteredData(data);
          }
          setMenuVisible(true);
          // setInputValue(text);
        }}
        value={value}
        mode={'outlined'}
        ref={refs}
        placeholder={placeholder}
        disabled={edit || false}
        keyboardType={keyboard || 'default'}
        onEndEditing={e => {
          if (onEndEdit) {
            onEndEdit(e.nativeEvent.text);
          }
        }}
      />
      {icon ?
        <TouchableOpacity onPress={onIconClick}>
          <Image source={icon} style={styles.imageIcon} />
        </TouchableOpacity> : null}
      {data && menuVisible && filteredData && (
        <View style={styles.autoCompleteView}>
          {filteredData &&
            filteredData.map((datum, i) => (
              <Menu.Item
                key={i}
                style={[styles.menuItem, menuStyle]}
                // icon={icon}
                onPress={() => {
                  value = datum;
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

export default AutoComplete;
