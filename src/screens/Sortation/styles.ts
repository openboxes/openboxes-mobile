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
  chipActive: {
    borderWidth: 2,
    borderColor: Theme.colors.primary
  },
  chipWarning: {
    height: 28,
    justifyContent: 'flex-start',
    borderRadius: 4,
    alignItems: 'center',
    backgroundColor: Theme.colors.warning
  },
  chipSuccess: {
    backgroundColor: Theme.colors.success,
    height: 28,
    justifyContent: 'flex-start',
    borderRadius: 4,
    alignItems: 'center'
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
  subheading: {
    fontSize: 16,
    color: Theme.colors.text,
    fontWeight: 'bold'
  },
  paragraphMuted: {
    fontSize: 14,
    color: Theme.colors.disabled,
    fontWeight: 'normal'
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
  rightSpace: { marginRight: Theme.spacing.small },
  cardAnnotation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  formContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    padding: Theme.spacing.large
  },
  card: {
    marginTop: Theme.spacing.small,
    marginBottom: Theme.spacing.small,
    borderRadius: Theme.roundness * 2,
    borderColor: Theme.colors.disabled,
    borderWidth: 0.5
  },
  cardContent: {
    paddingVertical: Theme.spacing.medium,
    paddingHorizontal: Theme.spacing.large
  },
  cardSelected: {
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.surface,
    borderWidth: 2
  },
  cardContainer: {
    paddingVertical: Theme.spacing.large
  },
  dialogOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.large
  },
  dialogContent: {
    backgroundColor: 'white',
    borderRadius: Theme.roundness * 2,
    padding: Theme.spacing.large,
    width: '100%',
    maxWidth: 400
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Theme.spacing.medium
  },
  dialogText: {
    fontSize: 16,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.medium
  },
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  dialogButton: {
    flex: 1
  },
  successBanner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  successText: {
    fontSize: 14,
    marginBottom: Theme.spacing.medium,
    textAlign: 'center'
  },
  successHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Theme.spacing.medium
  },
  link: {
    fontSize: 14,
    color: Theme.colors.primary,
    textDecorationLine: 'underline'
  }
});
