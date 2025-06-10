import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  screenContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    marginTop: Theme.spacing.small
  },
  swipePromptContainer: {
    backgroundColor: Theme.colors.warning,
    padding: Theme.spacing.large,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  swipePromptText: {
    color: Theme.colors.warningText,
    marginLeft: Theme.spacing.medium,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center'
  }
});
