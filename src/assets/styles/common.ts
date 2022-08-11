import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  containerFlexColumn: {
    display: 'flex',
    flexDirection: 'column'
  },
  containerFlexRow: {
    display: 'flex',
    flexDirection: 'row'
  },
  containerCenter: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  listItemContainer: {
    margin: 8,
    padding: 5,
    justifyContent: 'center',
    elevation: 8
  },
  flex1: {
    flex: 1
  },
  scanSearch: {
    marginHorizontal: 8,
    backgroundColor: 'white'
  },
  zIndexMinus1: {
    zIndex: -1
  }
});
