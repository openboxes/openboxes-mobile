import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  rootWrapper: {
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.large,
    display: 'flex',
    flexDirection: 'column'
  },
  wrapperWithPadding: {
    padding: Theme.spacing.medium
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
  marginTop: {
    marginTop: Theme.spacing.medium
  },
  marginTopSmall: {
    marginTop: Theme.spacing.small
  },
  marginBottom: {
    marginBottom: Theme.spacing.medium
  },
  divider: {
    marginVertical: Theme.spacing.small
  },
  flex1: {
    flex: 1
  },
  screenContainer: {
    flex: 1,
    backgroundColor: Theme.colors.background
  },
  listContent: {
    paddingBottom: Theme.spacing.large
  },
  sequentialToggle: {
    paddingHorizontal: Theme.spacing.medium
  },
  orderNumberChip: {
    flexShrink: 1
  },
  statusChip: {
    marginRight: 0
  },
  statusChipReady: {
    backgroundColor: Theme.colors.successBackground
  },
  statusChipTextReady: {
    color: Theme.colors.successForeground
  },
  statusChipInProgress: {
    backgroundColor: Theme.colors.infoBackground
  },
  statusChipTextInProgress: {
    color: Theme.colors.infoForeground
  },
  orderNumberText: {
    fontSize: 14,
    color: Theme.colors.text
  },
  additionalInfoRow: {
    flexDirection: 'row',
    marginTop: Theme.spacing.small,
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  scannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Theme.spacing.medium
  },
  scannerInput: {
    flex: 1
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Theme.spacing.small
  }
});
