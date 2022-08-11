import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  arrowDownIcon: {
    height: 15,
    width: 15
  },
  datePickerContainer: {
    marginVertical: 5
  },
  datePicker: {
    width: '100%',
    flex: 1,
    marginTop: 10,
    height: 40
  },
  datePickerCustomStyle: {
    dateIcon: {
      display: 'none'
    },
    placeholderText: {
      marginLeft: 10,
      fontSize: 16,
      color: Theme.colors.placeholder
    },
    dateText: {
      marginLeft: 10,
      fontSize: 16
    },
    dateInput: {
      alignItems: 'flex-start',
      justifyContent: 'center',
      textAlign: 'left',
      borderColor: 'grey',
      borderWidth: 1,
      borderRadius: 5
    }
  },
  imageIcon: {
    position: 'absolute',
    end: 10,
    width: 30,
    height: 30,
    bottom: 5,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100
  },
  lotStatusSelectStyle: {
    width: '100%',
    borderWidth: 1,
    height: 42,
    alignSelf: 'center',
    borderColor: '#909090',
    borderRadius: 5,
    marginTop: 10
  },
  lotStatusSelectTextStyle: {
    textAlign: 'left',
    fontSize: 15,
    color: '#808080'
  }
});
