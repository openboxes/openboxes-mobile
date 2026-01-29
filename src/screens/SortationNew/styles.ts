import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  contentDivider: {
    marginVertical: 8
  },
  topSpace: { marginTop: Theme.spacing.small },
  formRow: {
    padding: Theme.spacing.large,
    backgroundColor: 'transparent'
  },
  highlightedRow: {
    backgroundColor: Theme.colors.highlightBackground,
    borderTopColor: Theme.colors.highlight,
    borderTopWidth: 1,
    borderBottomColor: Theme.colors.highlight,
    borderBottomWidth: 1
  },
  highlightedInput: {
    backgroundColor: Theme.colors.highlightBackground
  },
  errorRow: {
    backgroundColor: '#FFF2F2',
    borderTopColor: Theme.colors.danger,
    borderTopWidth: 1,
    borderBottomColor: Theme.colors.danger,
    borderBottomWidth: 1
  },
  errorInput: {
    backgroundColor: '#FFF2F2'
  },
  errorText: {
    color: Theme.colors.danger,
    fontSize: 14,
    marginTop: 2,
    fontWeight: '700',
    paddingHorizontal: 0
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: Theme.spacing.large
  },
  buttonLeft: {
    flex: 1,
    marginRight: 4
  },
  buttonRight: {
    flex: 1,
    marginLeft: 4
  },
  summaryContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  summaryContent: {
    padding: Theme.spacing.large,
    flex: 1
  },
  summaryLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: Theme.spacing.medium
  },
  summaryValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4
  },
  summaryValue: {
    fontSize: 28,
    color: '#555',
    fontWeight: 'bold',
    marginLeft: 12
  },
  sortedTag: {
    backgroundColor: Theme.colors.success,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 12
  },
  summaryFooter: {
    padding: Theme.spacing.large,
    backgroundColor: '#fff'
  }
});
