import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  screenContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 20
  },
  welcomeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20
  },
  inputsContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 20
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'column'
  }
});

export default styles;
