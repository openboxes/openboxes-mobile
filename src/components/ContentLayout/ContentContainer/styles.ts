import { StyleSheet } from 'react-native';

const containerMargin = 10;

export default StyleSheet.create({
  container: {
    margin: containerMargin,
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  scrollContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1
  }
});
