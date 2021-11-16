import {StyleSheet} from 'react-native';
import Theme from '../../utils/Theme';
import {ratio} from '../../constants';

export default StyleSheet.create({
  contentContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    padding: 8,
  },
  label: {
    fontSize: 12,
    color: Theme.colors.placeholder,
    width: '60%',
  },
  value: {
    fontSize: 16,
    color: Theme.colors.text,
  },
  textInput: {
    fontSize: 16,
    color: Theme.colors.text,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#e7edd8',
  },
  rowItem: {
    flexDirection: 'row',
    borderColor: Theme.colors.background,
    marginTop: 1,
    padding: 2,
    marginStart: 4,
    width: '100%',
    alignItems: 'center',
  },
  columnItem: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    width: '50%',
  },
  arrowDownIcon: {
    height: 15,
    width: 15,
  },
  select: {
    width: '100%',
    borderWidth: 2,
    height: 40,
    borderColor: 'grey',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingStart: 10,
    marginTop: 10,
  },
  inputField: {
    width: '82%',
    borderWidth: 2,
    height: 40,
    borderColor: 'grey',
    backgroundColor: 'white',
    borderRadius: 5,
    marginTop: 10,
  },
  bottom: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: ratio.height * 100,
  },
});
