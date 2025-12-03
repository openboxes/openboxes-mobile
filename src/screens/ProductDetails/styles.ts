import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  contentContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column'
  },
  title: {
    fontSize: 16,
    color: Theme.colors.text,
    fontWeight: 'normal'
  },
  itemView: {
    margin: Theme.spacing.small / 2
  },
  rowItem: {
    flexDirection: 'row',
    borderColor: Theme.colors.background,
    marginTop: 1,
    padding: 2,
    marginStart: 4,
    width: '100%',
    alignItems: 'center'
  },
  name: {
    fontSize: 17,
    color: Theme.colors.text,
    fontWeight: 'bold'
  },
  boxHeading: {
    fontSize: 15,
    color: Theme.colors.text,
    fontWeight: 'bold',
    marginTop: 8
  },
  box: {
    borderColor: Theme.colors.background,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
    padding: 8
  },
  descriptionLabel: {
    fontSize: 20,
    color: Theme.colors.text,
    fontWeight: 'bold',
    marginTop: 8
  },
  descriptionText: {
    fontSize: 16,
    color: Theme.colors.text,
    borderColor: Theme.colors.background,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
    padding: 8
  },
  detailsLabel: {
    fontSize: 20,
    color: Theme.colors.text,
    fontWeight: 'bold',
    marginTop: 8
  },
  detailsContainer: {
    padding: 8,
    borderColor: Theme.colors.background,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8
  },
  detailsItemContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: 0
  },
  detailsItemName: {
    fontSize: 16,
    color: Theme.colors.text,
    fontWeight: 'bold'
  },
  detailsItemValue: {
    fontSize: 16,
    color: Theme.colors.text,
    marginStart: 8
  },
  container: {
    flexWrap: 'wrap',
    alignItems: 'flex-start', // if you want to fill rows left to right
    borderColor: Theme.colors.background,
    borderWidth: 1,
    borderRadius: 8
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    padding: Theme.spacing.small
  },
  textAlign: {
    textAlign: 'right'
  },
  logo: {
    width: 66,
    height: 58
  },
  header: {
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.large,
    display: 'flex',
    flexDirection: 'column'
  },
  chipDefault: {
    height: 24,
    justifyContent: 'center',
    borderRadius: 4,
    alignItems: 'center',
    marginRight: 8
  },
  chipText: {
    fontSize: 12,
    color: Theme.colors.text
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  contentDivider: {
    marginVertical: 8
  },
  additionalInfoRow: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  detailsSection: {
    paddingHorizontal: Theme.spacing.small
  },
  sectionCard: {
    marginTop: Theme.spacing.small,
    '&:last-child': {
      marginBottom: Theme.spacing.small
    }
  },
  printButton: {
    marginVertical: Theme.spacing.small
  },
  cardContainer: { backgroundColor: Theme.colors.background },
  subheading: { fontWeight: 'bold', fontSize: 16 },
  actionButtons: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: Theme.spacing.large
  },
  topSeparator: {
    marginTop: Theme.spacing.small
  },
  bottomSeparator: {
    marginBottom: Theme.spacing.small
  },
  refreshMessage: {
    fontSize: 12,
    color: 'red',
    fontWeight: 'bold',
    marginTop: 2,
    textAlign: 'right'
  },
  caption: { fontSize: 12, color: Theme.colors.text },
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
