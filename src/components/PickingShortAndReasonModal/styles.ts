import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
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
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Theme.spacing.medium
  }
});
