import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';
import { ratio } from '../../constants';

export default StyleSheet.create({
  contentContainer: {
    padding: 16,
    flex: 0
  },
  label: {
    fontSize: 12,
    color: Theme.colors.placeholder,
    alignSelf:'flex-start'
  },
  value: {
    fontSize: 16,
    color: Theme.colors.text
  },
  textInput: {
    fontSize: 16,
    color: Theme.colors.text,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#e7edd8'
  },
  rowItem: {
    flexDirection: 'row',
    borderColor: Theme.colors.background,
    marginTop: 1,
    padding: 2,
    width: '100%',
    alignItems: 'center'
  },
  columnItem: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    width: '50%'
  },
  arrowDownIcon: {
    height: 15,
    width: 15
  },
  select: {
    width: '100%',
    borderWidth: 2,
    height: 40,
    borderColor: 'grey',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingStart: 10,
    marginTop: 10
  },
  containerField: {
    padding:10
  },
  bottom: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: ratio.height * 100,
    bottom: 10
  },
  textContainer: {
    flexDirection: 'column',
    borderColor: Theme.colors.background,
    marginTop: 1,
    padding: 2,
    width: '100%',
    alignItems: 'center'
  },
  alignCenterContent: {
    alignItems: 'center'
  }
});
