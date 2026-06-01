import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: Theme.spacing.large
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentWrapper: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column'
  },
  contentContainer: {
    flexGrow: 1
  },
  productDetails: {
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.large,
    display: 'flex',
    flexDirection: 'column'
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
  chipWarning: {
    height: 28,
    justifyContent: 'flex-start',
    borderRadius: 4,
    alignItems: 'center',
    backgroundColor: Theme.colors.warning
  },
  contentDivider: {
    marginVertical: 8
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
  subheadingDisabled: {
    color: Theme.colors.disabled
  },
  caption: { fontSize: 12 },
  bold: { fontWeight: 'bold' },
  paragraph: {
    fontSize: 14,
    color: Theme.colors.text,
    fontWeight: 'normal'
  },
  scannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Theme.spacing.small
  },
  scannerInput: {
    flex: 1
  },
  topSpace: { marginTop: Theme.spacing.small },
  bottomSpace: { marginBottom: Theme.spacing.small },
  formContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    padding: Theme.spacing.large
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
  dropdownContainer: {
    width: '50%',
    alignSelf: 'flex-end'
  },
  bottomActionContainer: {
    padding: Theme.spacing.small,
    borderTopColor: Theme.colors.disabled
  },
  cardAnnotation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  lostAndFoundBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Theme.colors.warning,
    padding: Theme.spacing.medium,
    borderRadius: 4,
    marginTop: Theme.spacing.small
  },
  lostAndFoundBannerText: {
    fontSize: 14,
    color: Theme.colors.warningText,
    flex: 1,
    marginLeft: Theme.spacing.medium
  },
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  dialogActionsRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dialogActionButton: {
    flex: 1
  },
  dialogActionSpacer: {
    width: Theme.spacing.small
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.large
  },
  chipDestination: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#ebebeb',
    borderRadius: 4,
    minHeight: 28
  },
  chipDestinationIcon: {
    marginRight: 6
  },
  chipDestinationLabel: {
    flex: 1
  },
  overrideLink: {
    fontSize: 14,
    fontWeight: '500',
    color: Theme.colors.primary,
    textDecorationLine: 'underline',
    paddingHorizontal: 4
  },
  locationList: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: Theme.roundness * 2,
    overflow: 'hidden',
    marginBottom: Theme.spacing.large
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.medium,
    paddingHorizontal: Theme.spacing.medium,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  locationRowLast: {
    borderBottomWidth: 0
  },
  locationRowSelected: {
    backgroundColor: '#E8F0FE'
  },
  locationRowContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: Theme.spacing.small
  },
  locationRowName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Theme.colors.text
  },
  locationRowSubtext: {
    fontSize: 13,
    color: Theme.colors.disabled,
    marginTop: 2
  },
  useNewLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.medium,
    paddingHorizontal: Theme.spacing.medium,
    backgroundColor: 'white'
  },
  destinationInputContainer: {
    marginBottom: Theme.spacing.large
  },
  modalSurface: {
    width: '90%',
    borderRadius: 8,
    padding: 16,
    elevation: 4,
    backgroundColor: 'white'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.colors.text,
    flexShrink: 1
  },
  modeCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: Theme.spacing.large,
    marginTop: Theme.spacing.large,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  modeCardLeft: {
    marginRight: Theme.spacing.large
  },
  modeCardAvatar: {
    backgroundColor: '#EEF2F7'
  },
  modeCardContent: {
    flex: 1
  },
  modeCardRight: {
    marginLeft: Theme.spacing.small
  },
  modeCardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Theme.colors.primary
  },
  modeCardDescription: {
    fontSize: 14,
    color: Theme.colors.text,
    marginTop: 4
  },
  taskRow: {
    backgroundColor: '#FFFFFF',
    padding: Theme.spacing.large,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  taskRowContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  taskRowProduct: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    flex: 1
  },
  taskRowLocation: {
    fontSize: 14,
    color: Theme.colors.text,
    flex: 1,
    textAlign: 'center'
  },
  taskRowQuantity: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.text,
    flex: 1,
    textAlign: 'right'
  },
  zoneSection: {
    marginTop: Theme.spacing.large
  },
  zoneHeader: {
    backgroundColor: '#E8EDF2',
    paddingVertical: Theme.spacing.medium,
    paddingHorizontal: Theme.spacing.large,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D0D0D0'
  },
  zoneHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.text
  },
  clearButton: {
    marginTop: Theme.spacing.medium
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.primary,
    paddingVertical: Theme.spacing.large,
    paddingHorizontal: Theme.spacing.large,
    alignItems: 'center'
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  tableHeaderProduct: {
    flex: 1
  },
  tableHeaderLocation: {
    flex: 1,
    textAlign: 'center'
  },
  tableHeaderQty: {
    flex: 1,
    textAlign: 'right'
  },
  zoneHeaderContent: {
    flexDirection: 'column'
  },
  zoneHeaderLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 2
  },
  zoneHeaderIcon: {
    color: '#666666'
  },
  emptyTableContent: {
    paddingVertical: Theme.spacing.large * 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    fontSize: 14,
    color: Theme.colors.text,
    textAlign: 'center'
  }
});
