import { StyleSheet } from 'react-native';
import { device, ratio } from '../../constants';

export default StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 107, 99, 0.8)'
  },
  modalView: {
    width: '80%',
    minHeight: device.windowHeight / 2.2,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  image: {
    width: ratio.width * 250,
    height: ratio.height * 150,
    resizeMode: 'stretch'
  },
  bottom: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: ratio.height * 100
  },
  form: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-around'
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 10,
    top: 10,
    elevation: 5
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  inputLabel: {
    height: 40,
    padding: 5,
    flex: 1
  },
  sizeBox: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  sizeItem: {
    flexDirection: 'row',
    borderWidth: 1,
    flex: 0.48
  },
  sizeLabel: {
    textAlignVertical: 'center',
    backgroundColor: 'gray',
    padding: 10,
    fontSize: 13
  },
  select: {
    width: '100%',
    borderWidth: 2,
    height: 40
  },
  arrowDownIcon: {
    height: 15,
    width: 15
  }
});
