import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';
import { ratio, device } from '../../constants';

export default StyleSheet.create({
  screenContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: 0
  },
  contentContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    padding: 0
  },
  listItemContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: 0,
    padding: 0,
    justifyContent: 'center'
  },
  name: {
    fontSize: 17,
    color: Theme.colors.text,
    fontWeight: 'bold'
  },
  boxHeading: {
    fontSize: 15,
    color: Theme.colors.text,
    fontWeight: 'bold',
    marginTop: 8
  },
  box: {
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
    padding: 8
  },
  topRow: {
    flexDirection: 'row',
    width: '100%',
    textAlign: 'center'
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
  },
  col30: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4,
    width: '30%'
  },
  col40: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4,
    width: '40%',
    borderRightWidth: 1
  },
  textAlign: {
    textAlign: 'right'
  },
  tinyLogo: {
    width: '100%',
    height: '20%'
  },
  logo: {
    width: 66,
    height: 58
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4,
    width: '50%'
  },
  list: {
    width: '100%'
  },
  listItemNameContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4,
    width: '50%'
  },
  listItemCategoryContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4,
    marginTop: 4
  },
  listItemCategoryLabel: {
    fontSize: 12,
    color: Theme.colors.placeholder
  },
  listItemCategory: {
    fontSize: 12,
    color: Theme.colors.text
  },
  col25: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4,
    width: '25%'
  },
  col33: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4,
    width: '33%'
  },
  col50: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4,
    width: '50%'
  },
  label: {
    fontSize: 11,
    color: Theme.colors.placeholder,
    width: '60%'
  },
  value: {
    fontSize: 12,
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
  bottom: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: ratio.height * 100
  },
  swiperView: {
    justifyContent: 'center'
  },
  inputSpinner: {
    flex: 1,
    alignItems: 'center'
  },
  infoButton: {
    marginRight: 2,
    width: 12,
    height: 12,
  },
  shortageLabel: {
    marginTop: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
});
