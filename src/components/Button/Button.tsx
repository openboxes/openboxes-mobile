import React from 'react';
import { Button as PaperButton } from 'react-native-paper';

import Theme from '../../utils/Theme';
import styles from './styles';
import { Props } from './types';

const Button: React.FC<Props> = (props) => {
  const { style, color, onPress, disabled, mode = 'contained', title, size = '80%', variant = 'default', icon } = props;

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

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          buttonColor: Theme.colors.danger,
          textColor: undefined
        };
      case 'secondary':
        return {
          buttonColor: Theme.colors.secondaryBackground,
          textColor: Theme.colors.secondaryForeground
        };
      default:
        return {
          buttonColor: color,
          textColor: undefined
        };
    }
  };

  const { buttonColor, textColor } = getVariantStyles();

  return (
    <PaperButton
      compact
      mode={mode}
      style={[style, buttonSizeStyle(), styles.button, disabled && styles.disabled]}
      contentStyle={styles.buttonContent}
      labelStyle={[styles.label, textColor ? { color: textColor } : null]}
      disabled={disabled}
      color={buttonColor}
      icon={icon}
      onPress={onPress}
    >
      {title}
    </PaperButton>
  );
};

export default Button;
