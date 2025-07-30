import React, { memo } from 'react';
import { Card, IconButton } from 'react-native-paper';

import Theme from '../../utils/Theme';
import styles from './styles';

type ToggleCardProps = {
  title: string;
  subtitle?: string;
  onReset?: () => void;
  children: React.ReactNode;
  lastChild?: boolean;
};

export const ToggleCard = memo(function ToggleCard({
  title,
  subtitle,
  onReset,
  children,
  lastChild = false
}: ToggleCardProps) {
  const cardStyles = [styles.card, lastChild && styles.lastChild];

  return (
    <Card style={cardStyles}>
      <Card.Title
        title={title}
        subtitle={subtitle}
        right={
          onReset
            ? () => (
                <IconButton
                  icon="refresh"
                  color={Theme.colors.primary}
                  size={24}
                  style={styles.resetButton}
                  accessibilityLabel="Reset to default"
                  onPress={onReset}
                />
              )
            : undefined
        }
      />
      <Card.Content>{children}</Card.Content>
    </Card>
  );
});
