import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  screenContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    padding: 8
  },
  cardContainer: {
    height: 150,
    borderRadius: 5,
    flex: 1,
    backgroundColor: 'white',
    margin: 1
  },
  cardLabel: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  cardImage: {
    flex: 2,
    height: 80,
    width: 80,
    alignSelf: 'center'
  },
  card: {
    height: '100%',
    padding: 5,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 6
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 12,
    backgroundColor: 'white'
  }
});
