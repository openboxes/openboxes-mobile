import React from 'react';
import { KeyboardTypeOptions, View } from 'react-native';
import { HelperText } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import { ScannerInput } from '../../components/ScannerInput';
import Theme from '../../utils/Theme';
import styles from './styles';

const highlightedTheme = {
  ...Theme,
  colors: {
    ...Theme.colors,
    primary: Theme.colors.highlight,
    outline: Theme.colors.highlight,
    onSurfaceVariant: Theme.colors.highlight,
    surface: Theme.colors.highlightBackground
  }
};

const errorTheme = {
  ...Theme,
  colors: {
    ...Theme.colors,
    primary: Theme.colors.danger,
    outline: Theme.colors.danger,
    onSurfaceVariant: Theme.colors.danger,
    surface: '#FFF2F2'
  }
};

type StepInputProps = {
  label: string;
  value: string;
  isActive: boolean;
  onChange: (v: string) => void;
  onSubmit: (v: string) => void;
  isEnabled?: boolean;
  theme?: any;
  icon: IconSource;
  error?: string | null;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
};

export const StepInput = ({
  label,
  value,
  isActive,
  onChange,
  onSubmit,
  isEnabled = true,
  icon = 'barcode',
  theme = {},
  error = null,
  placeholder,
  keyboardType
}: StepInputProps) => {
  const isError = isActive && !!error;
  const currentTheme = isError ? errorTheme : isActive ? highlightedTheme : theme;

  return (
    <View style={[styles.formRow, isActive && styles.highlightedRow, isError && styles.errorRow]}>
      <ScannerInput
        label={label}
        value={value}
        placeholder={placeholder}
        keyboardType={keyboardType}
        isEnabled={isActive && isEnabled}
        style={isError ? styles.errorInput : isActive ? styles.highlightedInput : {}}
        theme={currentTheme}
        leftIcon={isError ? 'alert-circle-outline' : icon}
        onChange={onChange}
        onSubmit={onSubmit}
      />
      {isError && (
        <HelperText type="error" visible={isError} style={styles.errorText}>
          {error}
        </HelperText>
      )}
    </View>
  );
};
