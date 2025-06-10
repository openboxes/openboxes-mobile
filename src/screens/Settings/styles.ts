import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Theme.spacing.small
  },
  card: {
    margin: Theme.spacing.small,
    elevation: Theme.spacing.small / 2
  },
  paragraph: {
    marginBottom: Theme.spacing.large
  },
  input: {
    marginBottom: Theme.spacing.large
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.small
  },
  settingTextContainer: {
    flex: 1,
    marginRight: Theme.spacing.large
  }
});

export default styles;
