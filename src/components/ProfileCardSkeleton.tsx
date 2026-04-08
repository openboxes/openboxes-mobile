import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function ProfileCardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.inner}>
          <View style={[styles.block, styles.title]} />
          <View style={styles.row}>
            <View style={[styles.block, styles.icon]} />
            <View style={styles.inner}>
              <View style={[styles.block, styles.label]} />
              <View style={[styles.block, styles.url]} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f5f6f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 20
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  inner: {
    flex: 1
  },
  block: {
    backgroundColor: '#e0e0e0',
    borderRadius: 4
  },
  title: {
    width: 90,
    height: 10,
    marginBottom: 8
  },
  icon: {
    width: 22,
    height: 22,
    marginRight: 12
  },
  label: {
    width: 120,
    height: 14,
    marginBottom: 6
  },
  url: {
    width: 180,
    height: 10
  }
});
