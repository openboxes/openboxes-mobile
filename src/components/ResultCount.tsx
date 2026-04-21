import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Caption } from 'react-native-paper';

interface Props {
  count: number;
  noun?: string;
  visible?: boolean;
}

export default function ResultCount({ count, noun = 'results', visible = true }: Props) {
  if (!visible) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Caption>
        {count} {noun}
      </Caption>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 6
  }
});
