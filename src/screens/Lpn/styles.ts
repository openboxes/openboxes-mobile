import {StyleSheet} from 'react-native';
import {colors, ratio} from "../../constants";

export default StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
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
  arrowDownIcon:{
    height: 15,
    width:15,
  },
  from:{
    flex: 1
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 40,
    alignSelf:"center",
    alignItems: 'center' ,
    marginTop:20,
  },
  input: {
    flex: 1,
    marginTop:5,
    height: 40,
    marginRight: 10,
    borderColor:'grey',
  },
  bottom:{
    width: '100%',
    alignItems: "center",
    justifyContent: "center",
    height: ratio.height * 100,
  },
  button: {
    width: '80%',
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:colors.headerColor,
    borderRadius:5,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 10,
  }
});
