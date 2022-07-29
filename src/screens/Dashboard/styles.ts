import { StyleSheet } from 'react-native';
import { colors } from '../../assets/styles';

export default StyleSheet.create({
  cardContainer: {
    height: 150,
    borderRadius: 5,
    flex: 1,
    backgroundColor: colors.accent,
    margin: 5
  },
  cardLabel: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 3,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  cardImage: {
    flex: 2,
    height: 100,
    width: 100,
    alignSelf: 'center'
  },
  card: {
    height: '100%',
    padding: 5,
    shadowColor: `${colors.white}21`,
    shadowOffset: {
      width: 0,
      height: 6
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 12,
    backgroundColor: colors.white
  }
});
