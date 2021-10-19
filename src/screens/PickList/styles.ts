import {StyleSheet} from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  contentContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    padding: 8,
  },
  name: {
    fontSize: 17,
    color: Theme.colors.text,
    fontWeight: "bold",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    flex: 0,
    marginStart: 4,

  },
  emptyRow: {
    flexDirection: 'row',
    borderColor: Theme.colors.onBackground,
    // borderBottomWidth: 1,
    // marginTop: 1,
    // padding: 2,
    width: '100%',
    height: 20,
  },
  topRow: {
    flexDirection: 'row',
    borderColor: Theme.colors.onBackground,
    // borderBottomWidth: 1,
    // marginTop: 1,
    // padding: 2,
    width: '100%',
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderTopColor: "black",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    borderRightWidth: 1,
    borderRightColor: "black",
    textAlign: "center"

  },
  row: {
    flexDirection: 'row',
    borderColor: Theme.colors.onBackground,
    // borderBottomWidth: 1,
    // marginTop: 1,
    // padding: 2,
    width: '100%',
    borderLeftWidth: 1,
    borderLeftColor: "black",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    borderRightWidth: 1,
    borderRightColor: "black"
  },
  col30: {
    display: "flex",
    flexDirection: "column",
    flex: 0,
    marginStart: 4,
    width: "30%",
    borderRightWidth: 1,
    borderRightColor: "black"

  },
  col40: {
    display: "flex",
    flexDirection: "column",
    flex: 0,
    marginStart: 4,
    width: "40%",
    borderRightWidth: 1,
    borderRightColor: "black",
    justifyContent: 'center', //Centered horizontally
    // alignItems: 'center', //Centered vertically

  },
  col50: {
    display: "flex",
    flexDirection: "column",
    flex: 0,
    marginStart: 4,
    width: "50%",
    borderRightWidth: 1,
    borderRightColor: "black"

  },
  col60: {
    display: "flex",
    flexDirection: "column",
    flex: 0,
    marginStart: 4,
    width: "60%",
    // borderRightWidth:1,
    // borderRightColor:"black"

  },
  col70: {
    display: "flex",
    flexDirection: "column",
    flex: 0,
    marginStart: 4,
    width: "70%"

  },
  col100: {
    display: "flex",
    flexDirection: "column",
    flex: 0,
    marginStart: 4,
    width: "100%"
  },
  width100:{
    width: "100%"
  },
  label: {
    fontSize: 12,
    color: Theme.colors.placeholder,
    width: "30%"

  },
  value: {
    fontSize: 16,
    color: Theme.colors.text,
    // justifyContent: 'center'
    // width: "70%"
  },
  info: {
    fontSize: 12,
    color: "#000000",
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
});
