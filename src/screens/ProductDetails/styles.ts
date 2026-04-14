import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  screenContainer: {
    flex: 1
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.large
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  contentDivider: {
    marginVertical: 8
  },
  title: {
    fontSize: 18,
    color: Theme.colors.text,
    fontWeight: '600'
  },
  subtitle: {
    marginTop: -4
  },
  sectionTitle: {
    fontSize: 16,
    color: Theme.colors.text,
    fontWeight: 'normal'
  },
  chipDefault: {
    height: 28,
    justifyContent: 'flex-start',
    borderRadius: 4,
    alignItems: 'center'
  },
  chipText: {
    fontSize: 12,
    color: Theme.colors.text
  },
  actionButtons: {
    flexDirection: 'column',
    marginTop: Theme.spacing.large
  },
  fieldGap: {
    marginTop: Theme.spacing.medium
  },
  detailsSection: {
    paddingHorizontal: Theme.spacing.small
  },
  sectionCard: {
    marginTop: Theme.spacing.small
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    padding: Theme.spacing.small
  },
  itemView: {
    marginTop: Theme.spacing.small
  },
  cardContainer: {
    backgroundColor: Theme.colors.background,
    borderRadius: 8
  },
  additionalInfoRow: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  printButton: {
    marginVertical: Theme.spacing.small
  },
  subheading: {
    fontWeight: 'bold',
    fontSize: 16
  },
  bottomSeparator: {
    marginBottom: Theme.spacing.small
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    padding: Theme.spacing.large,
    borderRadius: Theme.roundness * 2
  }
});
