import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  contentHeader: {
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.large
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  identifierContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  value: {
    fontSize: 12,
    color: Theme.colors.text
  },
  chipWarning: {
    height: 24,
    justifyContent: 'center',
    borderRadius: 4,
    alignItems: 'center',
    backgroundColor: Theme.colors.warning
  },
  chipWarningText: {
    fontSize: 12,
    color: Theme.colors.text
  },
  contentDivider: {
    marginVertical: 8
  },
  destinationSubheading: {
    fontWeight: 'bold'
  },
  additionalInfoRow: {
    flexDirection: 'row',
    marginTop: 8
  },
  chipDefault: {
    height: 24,
    justifyContent: 'center',
    borderRadius: 4,
    alignItems: 'center',
    marginRight: 8
  },
  chipDefaultText: {
    fontSize: 12,
    color: Theme.colors.text
  }
});
