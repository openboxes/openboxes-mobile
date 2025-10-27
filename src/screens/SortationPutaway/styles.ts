import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: Theme.spacing.large,
    justifyContent: 'flex-start'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column'
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
  caption: { fontSize: 12 },
  bold: { fontWeight: 'bold' },
  paragraph: {
    fontSize: 14,
    color: Theme.colors.text,
    fontWeight: 'normal'
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
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  dialogNewLocationHeader: {
    marginBottom: Theme.spacing.large,
    marginTop: Theme.spacing.small,
    fontWeight: 'bold',
    fontSize: 16
  },
  dialogCurrentLocationLabel: {
    fontWeight: 'bold',
    fontSize: 16
  },
  dialogCurrentLocationWrapper: {
    marginBottom: 16,
    fontWeight: 'bold'
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
  dialogSuggestButton: {
    marginBottom: Theme.spacing.large,
    marginTop: Theme.spacing.medium
  },
  dialogActionButton: {
    marginLeft: Theme.spacing.small
  }
});
