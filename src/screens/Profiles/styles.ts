import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Theme.spacing.small
  },
  card: {
    margin: Theme.spacing.small,
    elevation: Theme.spacing.small / 2
  },
  addIcon: {
    marginRight: Theme.spacing.small
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  profileRowLast: {
    borderBottomWidth: 0
  },
  profileRowActive: {
    backgroundColor: '#f0f4f9'
  },
  activeIndicator: {
    width: 3,
    alignSelf: 'stretch',
    backgroundColor: Theme.colors.primary,
    borderRadius: 2,
    marginRight: Theme.spacing.medium
  },
  inactiveIndicator: {
    width: 3,
    marginRight: Theme.spacing.medium
  },
  profileTextContainer: {
    flex: 1
  },
  profileLabel: {
    fontWeight: '600'
  },
  profileActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: Theme.spacing.small
  },
  profileActionButton: {
    margin: 0
  },
  // Dialog styles (matching AlternativeLocationSelector pattern)
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    padding: Theme.spacing.large,
    borderRadius: 8
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: Theme.colors.text,
    marginBottom: 2
  },
  modalDescription: {
    fontSize: 14,
    marginBottom: Theme.spacing.large
  },
  input: {
    marginBottom: Theme.spacing.medium,
    backgroundColor: 'white'
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fdecea',
    borderRadius: 4,
    padding: Theme.spacing.medium,
    marginBottom: Theme.spacing.medium
  },
  errorIcon: {
    marginRight: Theme.spacing.small
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 13,
    flex: 1
  },
  dialogActions: {
    flexDirection: 'row',
    marginTop: Theme.spacing.large
  },
  dialogButtonLeft: {
    flex: 1,
    marginRight: Theme.spacing.small
  },
  dialogButtonRight: {
    flex: 1,
    marginLeft: Theme.spacing.small
  }
});

export default styles;
