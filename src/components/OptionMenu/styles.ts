import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  menuContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
    marginRight: 5
  },
  logo: {
    resizeMode: 'contain',
    height: 30,
    width: 30,
    marginHorizontal: 5
  },
  dots: {
    resizeMode: 'contain',
    height: 40,
    width: 40,
    marginHorizontal: 5,
    zIndex: 123
  },
  menu: {
    width: 160,
    top: 50,
    left: -90
  }
});
