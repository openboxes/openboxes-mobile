import { StyleSheet } from 'react-native';
import { device } from '../../constants';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    marginVertical: 5
  },
  autoCompleteContainer: {
    borderWidth: 2,
    borderRadius: 4,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderColor: 'grey',
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  autoCompleteInputContainer: {
    borderWidth: 1
  },
  clearButton: {
    width: 25,
    height: 25,
    margin: 5
  },
  container: {
    backgroundColor: 'white'
  },
  option: {
    color: 'black'
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'grey',
    width: device.windowWidth - 32,
    height: 55,
    padding: 10,
    marginBottom: Theme.spacing.small,
    borderRadius: Theme.roundness
  },
  imageIcon: {
    position: 'absolute',
    end: Theme.spacing.medium,
    width: 30,
    height: 30,
    bottom: 20,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100
  }
});
