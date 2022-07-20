import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  title: {
    flex: 9
  },
  radioButton: {
    flex: 1
  },
  titleText: (disabled: any) => ({
    fontSize: 16,
    fontWeight: 'bold',
    color: disabled ? 'grey' : 'black'
  })
});
