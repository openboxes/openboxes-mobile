import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  mainContainer: {
    marginVertical: 5
  },
  container: {
    backgroundColor: 'white'
  },
  inputContainer: {
    position: 'relative'
  },
  option: {
    color: 'black'
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'grey',
    paddingVertical: Theme.spacing.medium,
    paddingLeft: Theme.spacing.medium,
    paddingRight: 40,
    minHeight: 55,
    borderRadius: Theme.roundness,
    marginBottom: Theme.spacing.small,
    color: 'black',
    textAlignVertical: 'top'
  },
  imageIconContainer: {
    position: 'absolute',
    top: '50%',
    right: Theme.spacing.small,
    transform: [{ translateY: -18 }],
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  imageIcon: {
    width: 30,
    height: 30
  }
});
