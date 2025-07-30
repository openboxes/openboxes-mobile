/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Animated, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

import IconDrag from '../../assets/images/icon_drag.svg';

export type DraggableRowProps = {
  children: React.ReactNode;
  drag: () => void;
  isActive: boolean;
  style?: ViewStyle;
};

export function DraggableRow({ children, drag, isActive, style }: DraggableRowProps) {
  return (
    <Animated.View style={[styles.container, style, { opacity: isActive ? 0.75 : 1 }]}>
      <View style={styles.row}>
        <TouchableOpacity delayLongPress={0} style={styles.handle} onLongPress={drag}>
          <IconDrag width={24} height={24} />
        </TouchableOpacity>

        <View style={styles.content}>{children}</View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginVertical: 4,
    elevation: 2
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  handle: { padding: 8 },
  content: { flex: 1, padding: 4 }
});
