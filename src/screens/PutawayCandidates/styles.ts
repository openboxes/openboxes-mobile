import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  container: {
    flex: 1
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  chipWarning: {
    height: 24,
    justifyContent: 'center',
    borderRadius: 4,
    alignItems: 'center',
    backgroundColor: Theme.colors.warning,
    marginHorizontal: 2
  },
  chipWarningText: {
    fontSize: 12,
    color: Theme.colors.text
  },
  contentDivider: {
    marginVertical: 8
  },
  destinationSubheading: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Theme.colors.text
  },
  additionalInfoRow: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  chipDefault: {
    height: 24,
    justifyContent: 'center',
    borderRadius: 4,
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: Theme.colors.background
  },
  chipDefaultText: {
    fontSize: 12,
    color: Theme.colors.text
  },
  caption: {
    fontSize: 12
  },
  refreshButton: {
    marginTop: Theme.spacing.large
  },
});
