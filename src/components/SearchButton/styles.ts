import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  button: {
    width: 48,
    height: 58,
    marginLeft: Theme.spacing.small,
    alignSelf: 'flex-end',
    backgroundColor: Theme.colors.primary,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: Theme.spacing.large
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: Theme.spacing.large,
    maxHeight: '80%'
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.small
  },
  title: {
    fontSize: 20,
    color: Theme.colors.text
  },
  closeButton: {
    width: 28,
    height: 28,
    backgroundColor: Theme.colors.secondaryBackground,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  hintText: {
    fontSize: 13,
    color: Theme.colors.secondaryForeground,
    marginTop: Theme.spacing.medium,
    marginBottom: Theme.spacing.small
  },
  resultCount: {
    fontSize: 13,
    color: Theme.colors.secondaryForeground,
    marginTop: Theme.spacing.small,
    marginBottom: Theme.spacing.small
  },
  emptyText: {
    fontSize: 13,
    color: Theme.colors.secondaryForeground,
    marginTop: Theme.spacing.medium,
    marginBottom: Theme.spacing.small
  },
  skeletonContainer: {
    marginTop: Theme.spacing.medium
  },
  skeletonRow: {
    backgroundColor: '#F0F1F3',
    borderRadius: 8,
    padding: 14,
    marginBottom: Theme.spacing.small
  },
  skeletonLabel: {
    width: '40%',
    height: 14,
    borderRadius: 4,
    backgroundColor: '#DFE1E5'
  },
  skeletonSubtitle: {
    width: '70%',
    height: 12,
    borderRadius: 4,
    backgroundColor: '#DFE1E5',
    marginTop: 8
  },
  resultsList: {
    maxHeight: 300
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: Theme.spacing.small
  },
  resultAccent: {
    width: 3,
    height: '100%',
    minHeight: 32,
    backgroundColor: Theme.colors.primary,
    borderRadius: 2
  },
  resultContent: {
    flex: 1,
    marginLeft: 12
  },
  resultLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Theme.colors.primary
  },
  resultSubtitle: {
    fontSize: 13,
    color: Theme.colors.secondaryForeground,
    marginTop: 2
  }
});
