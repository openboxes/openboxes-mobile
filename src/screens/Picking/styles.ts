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

  optionsCard: {
    borderWidth: 1,
    borderColor: '#E4E7EC',
    borderRadius: Theme.roundness * 2,
    overflow: 'hidden',
    marginHorizontal: Theme.spacing.medium,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#101828',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.medium,
    paddingHorizontal: Theme.spacing.small,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF0F3',
    borderLeftWidth: 3,
    borderLeftColor: 'transparent'
  },
  optionRowLast: {
    borderBottomWidth: 0
  },
  optionRowSelected: {
    backgroundColor: '#E8F0FE',
    borderLeftColor: Theme.colors.primary
  },
  optionRowContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: Theme.spacing.small
  },
  optionTitle: {
    fontSize: 15,
    letterSpacing: 0.1,
    color: Theme.colors.text,
    marginVertical: 0,
    lineHeight: 20
  },
  optionSubtitle: {
    fontSize: 13,
    color: Theme.colors.disabled,
    marginVertical: 0,
    lineHeight: 16
  },
  countWrapper: {
    alignItems: 'center',
    paddingRight: Theme.spacing.small / 2
  },
  countValue: {
    fontSize: 15,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
    color: Theme.colors.primary,
    marginVertical: 0,
    lineHeight: 18
  },
  countValueEmpty: {
    fontWeight: 'normal',
    color: Theme.colors.secondaryForeground
  },
  countCaption: {
    fontSize: 11,
    color: Theme.colors.disabled,
    marginVertical: 0,
    lineHeight: 13
  },

  whiteInput: {
    backgroundColor: 'white'
  },
  ctaContent: {
    height: 48
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
  scannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Theme.spacing.medium
  },
  scannerInput: {
    flex: 1
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
