import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

import Theme from '../utils/Theme';

const COLLAPSED_LINES = 3;

export function ScanErrorText({ message }: { message: string | null }) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(false);
  }, [message]);

  if (!message) {
    return null;
  }

  return (
    <Text
      style={styles.text}
      numberOfLines={isExpanded ? undefined : COLLAPSED_LINES}
      onPress={() => setIsExpanded((expanded) => !expanded)}
    >
      {message}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: Theme.colors.danger,
    marginTop: Theme.spacing.small
  }
});
