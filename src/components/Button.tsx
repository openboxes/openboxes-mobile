import React from 'react';
import {View, ViewProps} from 'react-native';
import {Button as PaperButton} from 'react-native-paper';

export interface Props extends ViewProps {
  title: string;
  onPress?: () => void;
}

export default function Button(props: Props) {
  return (
    <View
      style={{
        ...(props.style as {}),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
      }}>
      <PaperButton
        onPress={props.onPress}
        mode="contained"
        style={{
          padding: 4,
        }}
        compact={true}>
        {props.title}
      </PaperButton>
    </View>
  );
}
