import { StyleSheet } from 'react-native';

import Theme from '../../utils/Theme';

export default StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.large,
    backgroundColor: 'rgba(20, 31, 52, 0.55)'
  },
  dialog: {
    width: '100%',
    maxWidth: 420,
    overflow: 'hidden',
    borderRadius: Theme.roundness * 3,
    backgroundColor: Theme.colors.surface,
    elevation: 8
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.large
  },
  headerText: {
    flex: 1,
    paddingRight: Theme.spacing.medium
  },
  eyebrow: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: 'bold',
    letterSpacing: 0.8,
    color: Theme.colors.disabled
  },
  title: {
    marginTop: 2,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 'bold',
    color: Theme.colors.text
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: Theme.colors.secondaryBackground
  },
  closeIcon: {
    color: Theme.colors.secondaryForeground
  },
  addressSection: {
    flexDirection: 'row',
    padding: Theme.spacing.large
  },
  addressIcon: {
    marginRight: Theme.spacing.medium,
    color: Theme.colors.primary
  },
  addressText: {
    flex: 1
  },
  addressLine: {
    fontSize: 15,
    lineHeight: 21,
    color: Theme.colors.text
  },
  description: {
    marginTop: Theme.spacing.small,
    fontSize: 13,
    lineHeight: 18,
    color: Theme.colors.secondaryForeground
  },
  missingAddress: {
    marginTop: Theme.spacing.small,
    fontSize: 13,
    lineHeight: 18,
    fontStyle: 'italic',
    color: Theme.colors.disabled
  }
});
