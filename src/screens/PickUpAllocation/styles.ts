import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: Theme.spacing.large
  },
  titleText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: Theme.spacing.small - 2
  },
  subtitleText: {
    color: '#555'
  },
  sectionDivider: {
    marginTop: Theme.spacing.small - 2
  },
  itemSeparator: {
    height: Theme.spacing.small - 2
  },

  cardTouchable: {
    borderRadius: Theme.roundness
  },
  card: {
    borderRadius: Theme.roundness,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.small - 2
  },
  cardDivider: {
    marginVertical: Theme.spacing.small / 2
  },
  chip: {
    height: 24,
    justifyContent: 'flex-start',
    borderRadius: Theme.roundness,
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.small
  },
  chipText: {
    fontSize: 12
  },

  accordion: {
    backgroundColor: '#fff',
    borderRadius: Theme.roundness,
    marginBottom: Theme.spacing.small,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  accordionTitle: {
    fontWeight: '600'
  },
  accordionDescription: {
    color: '#666'
  },
  accordionContent: {
    paddingHorizontal: Theme.spacing.medium,
    paddingBottom: Theme.spacing.medium
  },
  productDescription: {
    marginBottom: Theme.spacing.small
  },

  buttonRow: {
    justifyContent: 'space-between'
  },
  button: {
    flex: 1,
    marginBottom: Theme.spacing.small / 2,
    flexGrow: 1
  },
  buttonText: {
    fontSize: 12,
    lineHeight: 16
  },
  paddingZero: {
    paddingLeft: 0,
    paddingRight: 0
  },

  partialInputContainer: {
    paddingVertical: Theme.spacing.small / 2
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.small
  },
  inputLabel: {
    fontSize: 14,
    flexShrink: 0,
    marginRight: Theme.spacing.small,
    width: 180
  },
  inputWrapper: {
    flex: 1
  },
  input: {
    justifyContent: 'center'
  },
  confirmButton: {
    alignSelf: 'stretch'
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
  scrollableContent: {
    maxHeight: 360
  },
  cellInput: {
    width: 70,
    height: 25
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Theme.spacing.large
  },
  leftMargin: {
    marginLeft: Theme.spacing.small
  }
});
