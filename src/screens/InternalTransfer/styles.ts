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
  from:{
    flex: 1
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
