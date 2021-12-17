import {StyleSheet} from 'react-native';
import {device} from '../../constants';

export default StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
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
  clearButton: {
    width: 25,
    height: 25,
    margin: 5,
  },
  container: {
    backgroundColor: 'white',
  },
  option: {
    color: 'black',
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'grey',
    padding: 10,
    height: 40,
    width: device.windowWidth - 40,
    borderRadius: 4,
  },
});
