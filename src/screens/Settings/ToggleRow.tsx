import React, { memo } from 'react';
import { View } from 'react-native';
import { Caption, Paragraph, Switch } from 'react-native-paper';

import Theme from '../../utils/Theme';
import styles from './styles';

type ToggleRowProps = {
  title: string;
  description?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
};

export const ToggleRow = memo(function ToggleRow({ title, description, value, onValueChange }: ToggleRowProps) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingTextContainer}>
        <Paragraph>{title}</Paragraph>
        {description ? <Caption>{description}</Caption> : null}
      </View>
      <Switch value={value} color={Theme.colors.primary} onValueChange={onValueChange} />
    </View>
  );
});
