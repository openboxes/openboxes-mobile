import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  itemView: {
    marginStart: 5,
    marginEnd: 5,
    marginTop: 5
  },
  headerTitle: {
    fontWeight: 'normal',
    fontSize: 14,
    flex: 1
  },
  headerContainer: {
    flexDirection: 'row',
    margin: 5,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  infoButton: {
    width: 25,
    height: 25,
    marginHorizontal: 10,
    alignItems: 'center'
  },
  scanSearch: {
    marginHorizontal: 8,
    backgroundColor: 'white'
  }
});
