import {StyleSheet} from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    flex: 1,
    marginVertical: 5,
  },
  itemContainer: {
    flex: 1,
    marginTop: 5,
    height: 25,
    borderColor: 'grey',
  },
  autoCompleteContainer: {
    borderWidth: 2,
    borderRadius: 4,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderColor: 'grey',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  autoCompleteInputContainer: {
    borderWidth: 1,
  },
  textInput: {
    fontSize: 15,
    color: Theme.colors.text,
    width: '100%',
    textTransform: 'capitalize',
    textAlign: 'left',
  },
  clearButton: {
    width: 25,
    height: 25,
    margin: 5,
  },
});
