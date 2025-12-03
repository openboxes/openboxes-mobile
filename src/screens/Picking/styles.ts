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
  modalDescription: {
    fontSize: 14,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.medium
  },

  /** Dialog & actions **/
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Theme.spacing.medium
  },
  dialogActionButton: {
    marginLeft: Theme.spacing.small
  },
  dialogSuggestButton: {
    marginVertical: Theme.spacing.medium
  },
  dropdownContainer: {
    width: '50%',
    alignSelf: 'flex-end'
  },
  flex1: {
    flex: 1
  },
  fullWidth: {
    width: '100%'
  },
  actionsWrapper: {
    padding: Theme.spacing.medium,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: 'white'
  },
  itemCard: {
    padding: Theme.spacing.large,
    backgroundColor: 'white',
    marginBottom: Theme.spacing.small,
    borderRadius: Theme.roundness,
    elevation: 2
  }
});
