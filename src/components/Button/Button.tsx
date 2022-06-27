import React from 'react';
import { Button as PaperButton } from 'react-native-paper';
import { Props } from './types';
import styles from './styles';

const Button: React.FC<Props> = (props) => {
  const { style, onPress, disabled, title, size = '80%' } = props;
  const buttonSizeStyle = () => {
    switch (size) {
      case '50%':
        return styles.size50;
      case '80%':
        return styles.size80;
      default:
        return null;
    }
  };
  return (
    <PaperButton
      compact
      mode="contained"
      style={[style, buttonSizeStyle(), styles.button, disabled && styles.disabled]}
      labelStyle={styles.label}
      disabled={disabled}
      onPress={onPress}
    >
      {title}
    </PaperButton>
  );
};

export default Button;
