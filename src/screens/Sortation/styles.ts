import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: Theme.spacing.large
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  actionRequiredPill: {
    marginLeft: Theme.spacing.small,
    alignSelf: 'center'
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
  titleBadge: {
    marginLeft: Theme.spacing.small,
    alignSelf: 'center'
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
    backgroundColor: Theme.colors.warningBackground
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
    fontWeight: 'bold'
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
  methodSelector: {
    marginTop: 4
  },
  methodHintRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: Theme.spacing.small
  },
  methodHintIcon: {
    marginRight: 6,
    marginTop: 2
  },
  methodHint: {
    flex: 1,
    fontSize: 12,
    color: Theme.colors.secondaryForeground
  },
  scannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Theme.spacing.small
  },
  scannerInput: {
    flex: 1
  },
  topSpace: { marginTop: Theme.spacing.small },
  bottomSpace: { marginBottom: Theme.spacing.small },
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
    borderWidth: 0.5,
    overflow: 'hidden'
  },
  cardContent: {
    paddingVertical: Theme.spacing.medium,
    paddingHorizontal: Theme.spacing.large
  },
  dispositionBand: {
    alignSelf: 'stretch',
    paddingVertical: Theme.spacing.small,
    paddingHorizontal: Theme.spacing.large,
    borderRadius: 0
  },
  dispositionBandText: {
    fontWeight: 'bold',
    letterSpacing: 0.5
  },
  cardSelected: {
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.surface,
    borderWidth: 2
  },
  cardContainer: {
    paddingVertical: Theme.spacing.large
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
  },
  findProductLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.small
  },
  findProductLink: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    marginRight: 2
  }
});
