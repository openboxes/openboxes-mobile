import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    zIndex: -1
  },
  itemView: {
    marginStart: 10,
    marginEnd: 10,
    marginTop: 5
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  label: {
    fontSize: 12,
    color: Theme.colors.placeholder
  },
  value: {
    fontSize: 14,
    color: Theme.colors.text
  },
  bottom: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: Theme.colors.surface,
    paddingVertical: Theme.spacing.small,
    paddingHorizontal: Theme.spacing.large
  },
  detailsContainer: {
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.large
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  chipDefault: {
    height: 28,
    justifyContent: 'center',
    borderRadius: Theme.spacing.small,
    alignItems: 'center',
    marginRight: Theme.spacing.small,
    backgroundColor: Theme.colors.background
  },
  chipText: {
    fontSize: 12,
    color: Theme.colors.text
  },
  additionalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  caption: { fontSize: 12, color: Theme.colors.text },
  subheading: { fontWeight: 'bold', fontSize: 16 },
  dividerHorizontal: {
    marginVertical: 8
  }
});
