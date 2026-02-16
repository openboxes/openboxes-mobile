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
  paragraphSmall: {
    marginBottom: Theme.spacing.small,
    fontSize: 12,
    color: Theme.colors.backdrop
  },
  input: {
    marginBottom: Theme.spacing.large
  },
  link: {
    color: Theme.colors.primary,
    textDecorationLine: 'underline',
    fontSize: 14
  }
});

export default styles;
