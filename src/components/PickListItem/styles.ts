import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  status: {
    marginRight: 20,
    color: Theme.colors.text
  },
  cardTitle: {
    backgroundColor: Theme.colors.background
  },
  cardTitleString: {
    padding: 0,
    fontSize: 16,
    marginRight: 10
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: 0
  },
  value: {
    fontSize: 12,
    color: Theme.colors.text
  },
  infoButton: {
    marginRight: 2,
    width: 12,
    height: 12
  },
  inputSpinner: {
    flex: 1,
    alignItems: 'center'
  },
  dataTable: {
    marginTop: 10
  }
});
