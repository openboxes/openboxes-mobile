import {StyleSheet} from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  screenContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  cardContainer: {
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    backgroundColor:'white',
    margin: 5,
  },
  cardLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 3,
    textAlign: 'center',
  },
  cardImage: {
    height: 100,
    width: 100,
    alignSelf: 'center',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 5,
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 12,
    backgroundColor: 'white',
    flexBasis: '42%',
  },
});
