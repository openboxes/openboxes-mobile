import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: -(10 / 2),
    marginHorizontal: -(10 / 2)
  },
  directionRow: {
    flexDirection: 'row'
  },
  directionColumn: {
    flexDirection: 'column'
  },
  gap: {
    marginVertical: 10 / 2,
    marginHorizontal: 10 / 2
  }
});
