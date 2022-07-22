import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  screenContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    zIndex: -1
  },
  contentContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    padding: 8
  },
  lpnFilter: {
    marginHorizontal: 4,
    backgroundColor: 'white'
  },
  list: {
    width: '100%'
  }
});
