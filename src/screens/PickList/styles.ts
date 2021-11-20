import {StyleSheet} from 'react-native';
import Theme from '../../utils/Theme';
import {ratio} from '../../constants';
import { device } from '../../constants'; 

export default StyleSheet.create({
  screenContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent:  'center',
    flex: 1,
  },
  inputContainer: {
    borderWidth:1,
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: 10,
  },
  from: {
    flex: 1,
    marginBottom: 40,
  },
  contentContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    padding: 8,
  },
  listItemContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: 4,
    padding: 4,
    justifyContent: 'center',
  },
  name: {
    fontSize: 17,
    color: Theme.colors.text,
    fontWeight: 'bold',
  },
  boxHeading: {
    fontSize: 15,
    color: Theme.colors.text,
    fontWeight: 'bold',
    marginTop: 8,
  },
  box: {
    //borderColor: Theme.colors.onBackground,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
    padding: 8,
  },
  topRow: {
    flexDirection: 'row',
    // borderColor: Theme.colors.onBackground,
    // borderBottomWidth: 1,
    // marginTop: 1,
    // padding: 2,
    width: '100%',
    // borderLeftWidth: 1,
    // borderTopWidth: 1,
    // borderTopColor: "black",
    // borderBottomWidth: 1,
    // borderBottomColor: "black",
    // borderRightWidth: 1,
    // borderRightColor: "black",
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    //borderColor: Theme.colors.onBackground,
    // borderBottomWidth: 1,
    // marginTop: 1,
    // padding: 2,
    width: '100%',
    // borderLeftWidth: 1,
    // borderLeftColor: "black",
    // borderBottomWidth: 1,
    // borderBottomColor: "black",
    // borderRightWidth: 1,
    // borderRightColor: "black"
  },
  col30: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4,
    width: '30%',
    // borderRightWidth: 1,
    // borderRightColor: "black"
  },
  col40: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4,
    width: '40%',
    borderRightWidth: 1,
    // borderRightColor: "black",
    // justifyContent: 'center', //Centered horizontally
    // alignItems: 'center', //Centered vertically
  },
  textAlign: {
    textAlign: 'right',
  },
  tinyLogo: {
    width: '100%',
    height: '20%',
  },
  logo: {
    width: 66,
    height: 58,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4,
    width: '50%',
    // borderRightWidth: 1,
    // borderRightColor: "black"
  },
  list: {
    width: '100%',
  },
  listItemNameContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4,
    width: '50%',
  },
  listItemCategoryContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4,
    marginTop: 4,
  },
  listItemCategoryLabel: {
    fontSize: 12,
    color: Theme.colors.placeholder,
  },
  listItemCategory: {
    fontSize: 16,
    color: Theme.colors.text,
  },
  col50: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    marginStart: 4,
    width: '50%',
  },
  label: {
    fontSize: 12,
    color: Theme.colors.placeholder,
    width: '60%',
  },
  value: {
    fontSize: 16,
    color: Theme.colors.text,
    // justifyContent: 'center'
    // width: "70%"
  },
  info: {
    fontSize: 12,
    color: '#000000',
    // justifyContent: 'center'
    // width: "70%"
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
  bottom: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: ratio.height * 100,
  },
  swiperView: {
    height: device.windowHeight - 100,
    justifyContent: 'center'
  }
});
