import * as React from 'react';
import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Theme from '../../utils/Theme';
import { countLabel } from './moveToStagingLib';
import styles from './moveToStagingStyles';

type PillTone = 'neutral' | 'warning' | 'outline' | 'success' | 'info';

export function SectionLabel({
  children,
  highlighted,
  actions
}: {
  children: string;
  highlighted?: boolean;
  actions?: { label: string; onPress: () => void }[];
}) {
  return (
    <View style={styles.sectionLabelRow}>
      <Text style={[styles.sectionLabel, highlighted && styles.sectionLabelHighlighted]}>{children.toUpperCase()}</Text>
      <View style={styles.sectionActionRow}>
        {(actions ?? []).map((item) => (
          <TouchableOpacity key={item.label} accessibilityRole="button" onPress={item.onPress}>
            <Text style={styles.sectionAction}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export function StatusPill({ label, tone = 'neutral', icon }: { label: string; tone?: PillTone; icon?: string }) {
  const toneStyles = {
    neutral: [styles.pillNeutral, undefined, Theme.colors.secondaryForeground],
    warning: [styles.pillWarning, styles.pillTextWarning, Theme.colors.warningForeground],
    success: [styles.pillSuccess, styles.pillTextSuccess, Theme.colors.successForeground],
    info: [styles.pillInfo, styles.pillTextInfo, Theme.colors.infoForeground],
    outline: [styles.pillOutline, styles.pillTextOutline, Theme.colors.secondaryForeground]
  } as const;
  const [toneStyle, textStyle, iconColor] = toneStyles[tone];

  return (
    <View style={[styles.pill, toneStyle]}>
      {icon ? <MaterialCommunityIcons name={icon} size={13} color={iconColor} style={styles.pillIcon} /> : null}
      <Text style={[styles.pillText, textStyle]}>{label}</Text>
    </View>
  );
}

/** Rows are separated by hairlines rather than spacing, so a card reads as one object. */
export function PanelCard({
  title,
  titleVariant = 'title',
  icon,
  right,
  subtitle,
  accent,
  style,
  children
}: {
  title?: string;
  titleVariant?: 'title' | 'label';
  icon?: string;
  right?: React.ReactNode;
  subtitle?: string;
  accent?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}) {
  const rows = React.Children.toArray(children).filter(Boolean);

  return (
    <View style={[styles.card, accent && styles.cardAccent, style]}>
      {title ? (
        <View style={[styles.cardHeader, accent && styles.cardHeaderAccent]}>
          {icon ? (
            <MaterialCommunityIcons
              name={icon}
              size={16}
              color={accent ? Theme.colors.warningForeground : Theme.colors.primary}
              style={styles.cardHeaderIcon}
            />
          ) : null}
          <Text style={titleVariant === 'label' ? styles.cardHeaderLabel : styles.cardHeaderTitle} numberOfLines={1}>
            {titleVariant === 'label' ? title.toUpperCase() : title}
          </Text>
          {right}
        </View>
      ) : null}
      {subtitle ? <Text style={[styles.cardSubtitle, accent && styles.cardSubtitleAccent]}>{subtitle}</Text> : null}
      {rows.map((row, index) => (
        <View key={index}>
          {(index > 0 || Boolean(title) || Boolean(subtitle)) && <View style={styles.hairline} />}
          {row}
        </View>
      ))}
    </View>
  );
}

export function ListRow({
  title,
  meta,
  subtitle,
  pills,
  trailingAction,
  chevron,
  muted,
  selected,
  leading,
  onPress,
  disabled
}: {
  title: string;
  meta?: string;
  subtitle?: string;
  pills?: React.ReactNode;
  trailingAction?: string;
  chevron?: boolean;
  muted?: boolean;
  selected?: boolean;
  leading?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
}) {
  const body = (
    <View style={[styles.row, muted && styles.rowMuted, selected && styles.rowSelected]}>
      {leading}
      <View style={styles.rowBody}>
        <View style={styles.rowTitleLine}>
          <Text style={[styles.rowTitle, muted && styles.rowTitleMuted]}>{title}</Text>
          {meta ? <Text style={styles.rowMeta}>· {meta}</Text> : null}
        </View>
        {subtitle ? (
          <Text style={styles.rowSubtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
        {pills ? <View style={styles.pillRow}>{pills}</View> : null}
      </View>
      {trailingAction ? <Text style={styles.rowTrailingAction}>{trailingAction}</Text> : null}
      {chevron ? (
        <MaterialCommunityIcons name="chevron-right" size={22} color={Theme.colors.secondaryForeground} />
      ) : null}
    </View>
  );

  if (!onPress) {
    return body;
  }

  return (
    <TouchableOpacity disabled={disabled} accessibilityRole="button" onPress={onPress}>
      {body}
    </TouchableOpacity>
  );
}

export function LabelValueRow({
  label,
  value,
  expanded,
  onToggle
}: {
  label: string;
  value: string;
  expanded?: boolean;
  onToggle?: () => void;
}) {
  const content = (
    <>
      <Text style={styles.labelValueLabel}>{label}</Text>
      <Text style={[styles.labelValueValue, styles.labelValueFill]} numberOfLines={2}>
        {value}
      </Text>
      {onToggle ? (
        <MaterialCommunityIcons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={22}
          color={Theme.colors.primary}
          style={styles.labelValueChevron}
        />
      ) : null}
    </>
  );
  if (!onToggle) {
    return <View style={styles.labelValueRow}>{content}</View>;
  }
  return (
    <TouchableOpacity
      style={styles.labelValueRow}
      accessibilityRole="button"
      accessibilityState={{ expanded }}
      onPress={onToggle}
    >
      {content}
    </TouchableOpacity>
  );
}

export function ActionButton({
  label,
  onPress,
  variant = 'primary',
  disabled,
  style
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const shape = disabled ? styles.buttonDisabled : variant === 'ghost' ? styles.buttonGhost : styles.buttonPrimary;
  const labelStyle = disabled
    ? styles.buttonLabelDisabled
    : variant === 'ghost'
    ? styles.buttonLabelGhost
    : styles.buttonLabelPrimary;

  return (
    <TouchableOpacity
      style={[styles.button, shape, style]}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled) }}
      onPress={onPress}
    >
      <Text style={[styles.buttonLabel, labelStyle]}>{label.toUpperCase()}</Text>
    </TouchableOpacity>
  );
}

/** Thin bar plus a right-aligned status, the way the order cards read progress in the mocks. */
export function ProgressRow({ done, total }: { done: number; total: number }) {
  const isComplete = total > 0 && done >= total;
  const ratio = total > 0 ? Math.min(done / total, 1) : 0;

  return (
    <View style={styles.progressRow}>
      <View style={styles.progressTrack}>
        <View
          style={[styles.progressFill, isComplete && styles.progressFillDone, { width: `${Math.round(ratio * 100)}%` }]}
        />
      </View>
      <Text style={[styles.progressLabel, isComplete && styles.progressLabelDone]} numberOfLines={1}>
        {isComplete ? `Fully picked · ${countLabel(total, 'line')}` : `${done} of ${total} lines picked`}
      </Text>
    </View>
  );
}
