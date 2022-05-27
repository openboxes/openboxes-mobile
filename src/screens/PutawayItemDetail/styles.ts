import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  contentContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    padding: 8
  },
  from: {
    flex: 1
  },
  name: {
    fontSize: 17,
    color: Theme.colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4
  },
  emptyRow: {
    flexDirection: 'row',
    borderColor: Theme.colors.onBackground,
    width: '100%',
    height: 20
  },
  topRow: {
    flexDirection: 'row',
    borderColor: Theme.colors.onBackground,
    width: '100%',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderTopColor: 'black',
    borderBottomWidth: 0,
    borderBottomColor: 'black',
    borderRightWidth: 0,
    borderRightColor: 'black',
    textAlign: 'center'
  },
  row: {
    flexDirection: 'row',
    borderColor: Theme.colors.onBackground,
    width: '100%',
    borderLeftWidth: 0,
    borderLeftColor: 'black',
    borderBottomWidth: 0,
    borderBottomColor: 'black',
    borderRightWidth: 0,
    borderRightColor: 'black'
  },
  col30: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4,
    width: '30%',
    borderRightWidth: 0,
    borderRightColor: 'black'
  },
  col40: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4,
    width: '40%',
    borderRightWidth: 0,
    borderRightColor: 'black',
    justifyContent: 'center' //Centered horizontally
  },
  col50: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4,
    width: '50%',
    borderRightWidth: 1,
    borderRightColor: 'black'
  },
  col60: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4,
    width: '60%'
  },
  col70: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4,
    width: '70%'
  },
  col100: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4,
    width: '100%'
  },
  width100: {
    width: '100%'
  },
  label: {
    fontSize: 12,
    color: Theme.colors.placeholder,
    width: '50%'
  },
  title: {
    fontSize: 16,
    color: Theme.colors.text,
    fontWeight: 'bold'
  },
  value: {
    fontSize: 16,
    color: Theme.colors.text
  },
  info: {
    fontSize: 12,
    color: '#000000'
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
    marginStart: 4,
    width: '100%',
    alignItems: 'center'
  },
  columnItem: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    width: '50%'
  },
  buttonContainer: {
    marginTop: 4,
    marginBottom: 8
  }
});
