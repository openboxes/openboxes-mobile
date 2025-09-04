import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: Theme.spacing.large,
    justifyContent: 'flex-start'
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
  caption: { fontSize: 12 },
  bold: { fontWeight: 'bold' },
  paragraph: {
    fontSize: 14,
    color: Theme.colors.text,
    fontWeight: 'normal'
  },
  topSpace: { marginTop: Theme.spacing.small },
  bottomSpace: { marginBottom: Theme.spacing.small },
  formContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    padding: Theme.spacing.large
  },
  secondaryButton: {
    height: 35
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center', // Wyśrodkuj w pionie
    alignItems: 'center',     // Wyśrodkuj w poziomie
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Ciemne, półprzezroczyste tło
  },
  modalContent: {
    width: '90%', // Okienko zajmie 90% szerokości ekranu
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5, // Dodaje cień na Androidzie
    shadowColor: '#000', // Dodaje cień na iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
