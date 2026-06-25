import React from 'react';
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Theme from '../../utils/Theme';
import styles from './styles';

export type BadgeVariant = 'success' | 'info' | 'warning';

export type BadgeSize = 'small' | 'medium';

const VARIANT_COLORS: Record<BadgeVariant, { foreground: string; background: string }> = {
  success: { foreground: Theme.colors.successForeground, background: Theme.colors.successBackground },
  info: { foreground: Theme.colors.infoForeground, background: Theme.colors.infoBackground },
  warning: { foreground: Theme.colors.warningForeground, background: Theme.colors.warningBackground }
};

const ICON_SIZE: Record<BadgeSize, number> = { small: 14, medium: 16 };

type BadgeProps = {
  variant: BadgeVariant;
  label: string;
  icon?: string;
  size?: BadgeSize;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

export function Badge({ variant, label, icon, size = 'medium', style, labelStyle }: BadgeProps) {
  const { foreground, background } = VARIANT_COLORS[variant];
  const small = size === 'small';

  return (
    <View style={[styles.badge, small && styles.badgeSmall, { backgroundColor: background }, style]}>
      {icon ? (
        <MaterialCommunityIcons
          name={icon}
          size={ICON_SIZE[size]}
          color={foreground}
          style={[styles.badgeIcon, small && styles.badgeIconSmall]}
        />
      ) : null}
      <Text style={[styles.badgeLabel, small && styles.badgeLabelSmall, { color: foreground }, labelStyle]}>
        {label}
      </Text>
    </View>
  );
}
