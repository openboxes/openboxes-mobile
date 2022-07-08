import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center'
  },
  directionRow: {
    flexDirection: 'row'
  },
  directionColumn: {
    flexDirection: 'column'
  }
});

export const gapStyle = ({ gap }: { gap: number }) => {
  return StyleSheet.create({
    container: {
      marginVertical: -gap,
      marginHorizontal: -gap
    },
    gap: {
      marginVertical: gap,
      marginHorizontal: gap
    }
  });
};
