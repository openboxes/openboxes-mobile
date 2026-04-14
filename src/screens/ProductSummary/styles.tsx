import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    zIndex: -1
  },
  subheading: {
    fontWeight: 'bold',
    color: Theme.colors.text
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  chipDefault: {
    height: 24,
    justifyContent: 'center',
    borderRadius: 4,
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: Theme.colors.background
  },
  contentDivider: {
    marginVertical: 8
  },
  additionalInfoRow: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  chipText: {
    fontSize: 12,
    color: Theme.colors.text
  },
  skeletonContainer: {
    padding: Theme.spacing.large
  }
});
