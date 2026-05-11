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
    flex: 1,
    flexDirection: 'column'
  },
  contentContainer: {
    flexGrow: 1
  },

  screenRoot: {
    flex: 1
  },
  scrollContent: {
    flex: 1
  },
  footerContainer: {
    paddingHorizontal: Theme.spacing.large,
    paddingVertical: Theme.spacing.small,
    backgroundColor: Theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0'
  },

  productDetails: {
    backgroundColor: Theme.colors.surface,
    padding: Theme.spacing.large,
    flexDirection: 'column'
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  chipDefault: {
    height: 28,
    justifyContent: 'flex-start',
    borderRadius: 4,
    alignItems: 'center'
  },
  chipActive: {
    borderWidth: 2,
    borderColor: Theme.colors.primary
  },
  chipText: {
    fontSize: 12,
    color: Theme.colors.text
  },
  contentDivider: {
    marginVertical: 8
  },
  title: {
    fontSize: 18,
    color: Theme.colors.text,
    fontWeight: '600'
  },
  paragraph: {
    fontSize: 14,
    color: Theme.colors.text,
    fontWeight: 'normal'
  },
  paragraphMuted: {
    fontSize: 14,
    color: Theme.colors.disabled,
    fontWeight: 'normal'
  },
  bold: { fontWeight: 'bold' },
  caption: { fontSize: 12 },

  topSpace: { marginTop: Theme.spacing.small },
  bottomSpace: { marginBottom: Theme.spacing.small },
  filterInputSpacing: { marginTop: Theme.spacing.small },

  scannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Theme.spacing.small
  },
  scannerInput: {
    flex: 1
  },

  formContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: Theme.spacing.large,
    paddingTop: Theme.spacing.small,
    paddingBottom: Theme.spacing.medium
  },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.primary,
    paddingVertical: Theme.spacing.large,
    paddingHorizontal: Theme.spacing.large,
    marginTop: Theme.spacing.medium,
    marginHorizontal: Theme.spacing.large,
    alignItems: 'center'
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  tableHeaderProduct: { flex: 2 },
  tableHeaderBin: { flex: 2, textAlign: 'left' },
  tableHeaderQty: { flex: 1, textAlign: 'right' },
  candidateRow: {
    backgroundColor: '#FFFFFF',
    paddingVertical: Theme.spacing.medium,
    paddingHorizontal: Theme.spacing.large,
    marginHorizontal: Theme.spacing.large,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  candidateRowMain: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  candidateColProduct: { flex: 2, paddingRight: Theme.spacing.small },
  candidateColBin: { flex: 2, paddingRight: Theme.spacing.small },
  candidateColQty: { flex: 1, alignItems: 'flex-end' },
  candidateProduct: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Theme.colors.primary
  },
  candidateProductName: {
    fontSize: 12,
    color: Theme.colors.disabled,
    marginTop: 2
  },
  candidateBin: {
    fontSize: 14,
    color: Theme.colors.text
  },
  candidateLot: {
    fontSize: 12,
    color: Theme.colors.disabled,
    marginTop: 2
  },
  candidateQty: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.text
  },
  skeletonLineWide: {
    height: 14,
    width: '70%',
    borderRadius: 4,
    marginBottom: 4
  },
  skeletonLineNarrow: {
    height: 10,
    width: '45%',
    borderRadius: 4
  },
  skeletonLineQty: {
    height: 16,
    width: 40,
    borderRadius: 4
  },
  emptyTableContent: {
    paddingVertical: Theme.spacing.large * 2,
    marginHorizontal: Theme.spacing.large,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    fontSize: 14,
    color: Theme.colors.text,
    textAlign: 'center'
  },

  refBand: {
    backgroundColor: '#E8EDF2',
    padding: Theme.spacing.medium,
    borderRadius: 4,
    marginBottom: Theme.spacing.medium,
    alignItems: 'center'
  },
  refLabel: {
    fontSize: 12,
    color: Theme.colors.text,
    marginBottom: 2
  },
  refValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.primary
  },
  errorText: {
    fontSize: 14,
    color: Theme.colors.danger,
    marginTop: Theme.spacing.small,
    textAlign: 'left'
  }
});
