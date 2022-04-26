import React, {useState} from 'react';
import styles from './styles';
import {Image, View} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'
import {Props} from "./types";
import AutoComplete from "../AutoComplete/AutoComplete";


export default function ({
  refs,
  value,
  label,
  placeholder,
  icon,
  onIconClick,
  showSelect,
  disabled,
  onChange,
  editable = true,
  onEndEdit,
  style,
  data,
}: Props) {
  const [edit, setEdit] = useState(disabled);
  const onEdit = () => {
    setEdit(!edit);
  };

  const renderIcon = () => {
    return (
      <Image
        style={styles.arrowDownIcon}
        source={require('../../assets/images/arrow-down.png')}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <AutoComplete
          data={data}
          menuStyle={{backgroundColor: 'white'}}
          refs={refs}
          label={label}
          placeholder={placeholder}
          icon={icon}
          onIconClick={onIconClick}
          value={value}
          disabled={edit || false}
          onChange={onChange}
          onEndEdit={e => {
            if (onEndEdit) {
              onEndEdit(e);
            }
          }}
          inputStyle={style}
          edit={edit}
        />
        {showSelect ? (
          <SelectDropdown
            data={['EA', 'BX/10', 'CS/100', 'PL/100']}
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index);
            }}
            disabled={!editable}
            defaultValueByIndex={0}
            renderDropdownIcon={renderIcon}
            buttonStyle={styles.select}
            buttonTextAfterSelection={(selectedItem) => selectedItem}
            rowTextForSelection={(item) => item}
          />
        ) : null}
      </View>
    </View>
  );
}
