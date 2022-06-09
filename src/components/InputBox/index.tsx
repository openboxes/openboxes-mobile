import React, { useState } from 'react';
import styles from './styles';
import { Image, View } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { Props } from './types';
import AutoComplete from '../AutoComplete/AutoComplete';

const InputBox = ({
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
  data
}: Props) => {
  const [edit, setEdit] = useState(disabled);
  const onEdit = () => {
    setEdit(!edit);
  };

  const renderIcon = () => {
    return <Image style={styles.arrowDownIcon} source={require('../../assets/images/arrow-down.png')} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <AutoComplete
          data={data}
          edit={edit}
          refs={refs}
          label={label}
          placeholder={placeholder}
          icon={icon}
          menuStyle={{ backgroundColor: 'white' }}
          value={value}
          disabled={edit || false}
          inputStyle={style}
          onEndEdit={(e) => {
            if (onEndEdit) {
              onEndEdit(e);
            }
          }}
          onChange={onChange}
          onIconClick={onIconClick}
        />
        {showSelect ? (
          <SelectDropdown
            data={['EA', 'BX/10', 'CS/100', 'PL/100']}
            disabled={!editable}
            defaultValueByIndex={0}
            renderDropdownIcon={renderIcon}
            buttonStyle={styles.select}
            buttonTextAfterSelection={(selectedItem) => selectedItem}
            rowTextForSelection={(item) => item}
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index);
            }}
          />
        ) : null}
      </View>
    </View>
  );
};

export default InputBox;
