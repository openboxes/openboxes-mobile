import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: Theme.colors.background
  },
  wrapperWithPadding: {
    padding: Theme.spacing.medium
  },
  typeListContent: {
    paddingBottom: Theme.spacing.medium
  },
  formWrapper: {
    paddingHorizontal: Theme.spacing.medium
  },

  cardWrapper: {
    flex: 1,
    paddingHorizontal: Theme.spacing.medium,
    marginBottom: Theme.spacing.small / 2
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.small,
    borderRadius: Theme.roundness,
    backgroundColor: Theme.colors.surface,
    elevation: 2
  },
  selectedCard: {
    borderColor: Theme.colors.primary,
    borderWidth: 2
  },
  contentWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.text
  },
  priorityBadge: {
    marginLeft: Theme.spacing.small,
    backgroundColor: Theme.colors.primary,
    alignSelf: 'center',
    paddingHorizontal: Theme.spacing.medium,
    fontSize: 14
  },

  title: {
    fontSize: 18,
    color: Theme.colors.text,
    fontWeight: 'bold'
  },
  subheading: {
    fontSize: 16,
    color: Theme.colors.text,
    fontWeight: 'bold'
  },
  caption: { fontSize: 12 },
  paragraph: {
    fontSize: 14,
    color: Theme.colors.text,
    fontWeight: 'normal'
  },
  fontBold: {
    fontWeight: 'bold'
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  divider: {
    marginVertical: Theme.spacing.small
  },
  marginTop: {
    marginTop: Theme.spacing.medium
  },
  marginBottom: {
    marginBottom: Theme.spacing.medium
  },
  marginTopSmall: {
    marginTop: Theme.spacing.small
  },
  marginRight: {
    marginRight: Theme.spacing.small
  },

  flex1: {
    flex: 1
  },
  fullWidth: {
    width: '100%'
  },
  itemCard: {
    padding: Theme.spacing.large,
    backgroundColor: 'white',
    marginBottom: Theme.spacing.small,
    borderRadius: Theme.roundness,
    elevation: 2
  },

  productDetails: {
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.large,
    display: 'flex',
    flexDirection: 'column'
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
  },
  modalScrollableContent: {
    maxHeight: 360
  },
  modalCellInput: {
    width: 60,
    height: 35,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    textAlign: 'center',
    padding: 0,
    backgroundColor: '#fff'
  },
  modalActionButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Theme.spacing.large
  },
  modalLeftMargin: {
    marginLeft: Theme.spacing.small
  },
  modalSectionHeader: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 4
  },
  modalSectionHeaderSpacing: {
    marginTop: 8
  },
  modalSectionHeaderTextPrimary: {
    fontWeight: 'bold',
    color: Theme.colors.primary
  },
  modalSectionHeaderTextDefault: {
    fontWeight: 'bold',
    color: Theme.colors.text
  },
  modalEmptyText: {
    textAlign: 'center',
    marginTop: 20
  },
  modalRowNoBorder: {
    borderBottomWidth: 0
  },
  modalCellBinLocation: {
    justifyContent: 'flex-start'
  },
  modalQuantityText: {
    fontWeight: 'bold'
  },
  modalQuantityTextDanger: {
    fontWeight: 'bold',
    color: Theme.colors.danger
  }
});
