import React from 'react';
import { Button as PaperButton } from 'react-native-paper';

import styles from './styles';
import { Props } from './types';

const Button: React.FC<Props> = (props) => {
  const { style, color, onPress, disabled, mode = 'contained', title, size = '80%' } = props;
  const buttonSizeStyle = () => {
    switch (size) {
      case '50%':
        return styles.size50;
      case '80%':
        return styles.size80;
      case '90%':
        return styles.size90;
      case '100%':
        return styles.size100;
      default:
        return null;
    }
  };
  return (
    <PaperButton
      compact
      mode={mode}
      style={[style, buttonSizeStyle(), styles.button, disabled && styles.disabled]}
      contentStyle={styles.buttonContent}
      labelStyle={styles.label}
      disabled={disabled}
      color={color}
      onPress={onPress}
    >
      {title}
    </PaperButton>
  );
};

export default Button;
