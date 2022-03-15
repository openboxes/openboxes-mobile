import {StyleSheet} from 'react-native';
import {colors, ratio} from "../../constants";
import Theme from "../../utils/Theme";

export default StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  arrowDownIcon:{
    height: 15,
    width:15,
  },
  select:{
    width: "100%",
    borderWidth: 2,
    height: 40,
    alignSelf: 'center',
    borderColor:'grey',
    backgroundColor:'white',
    borderRadius:5,
    marginTop:10,
  },
  from: {
    flex: 1,
    marginTop: 10,
  },
  bottom: {
    width: '100%',
    alignItems: "center",
    justifyContent: "center",
    height: ratio.height * 100,
    marginBottom: 10,
  },
  itemView: {
    marginTop: 5,
  },
  rowItem: {
    flexDirection: 'row',
    borderColor: Theme.colors.background,
    marginTop: 1,
    padding: 2,
    marginStart: 4,
    width: '100%',
    alignItems: "center"
  },
  columnItem: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    width: '50%',
  },
  label: {
    fontSize: 12,
    color: Theme.colors.placeholder,
  },
  value: {
    fontSize: 16,
    color: Theme.colors.text,
    width: "90%"
  },
  inputSpinner: {
    flex: 1,
    alignItems: 'center'
  },
  datePickerContainer: {
    marginVertical: 5,
  },
  datePicker: {
    width: '100%',
    flex: 1,
    marginTop: 10,
    height: 40,
  },
  datePickerCustomStyle: {
    dateIcon: {
      display: 'none'
    },
    placeholderText: {
      marginLeft: 10,
      fontSize: 16,
      color: Theme.colors.placeholder,
    },
    dateText: {
      marginLeft: 10,
      fontSize: 16,
    },
    dateInput: {
      alignItems: 'flex-start',
      justifyContent: 'center',
      textAlign: 'left',
      borderColor:'grey',
      borderWidth: 1,
      borderRadius:5,
    }
  },
  imageIcon :{
    position:'absolute',
    end:10,
    width:30,
    height:30,
    bottom:5,
    padding:10,
    justifyContent:'center',
    alignItems:"center",
    zIndex:100
  },
  lotStatusSelectStyle: {
    width: "100%",
    borderWidth: 1,
    height: 42,
    alignSelf: 'center',
    borderColor:'#909090',
    borderRadius:5,
    marginTop:10,
  },
  lotStatusSelectTextStyle: {
    textAlign: 'left', 
    fontSize: 15,
    color:'#808080',
  }
});
