import { StyleSheet } from 'react-native';

import Theme from '../../utils/Theme';

export default StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9'
  },
  chipRow: {
    paddingHorizontal: Theme.spacing.medium,
    paddingVertical: Theme.spacing.small
  },
  chipRowContent: {
    alignItems: 'center',
    paddingRight: Theme.spacing.medium
  },
  queueChip: {
    marginRight: Theme.spacing.small,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1
  },
  queueChipSelected: {
    backgroundColor: Theme.colors.primary
  },
  queueChipText: {
    fontSize: 12,
    color: Theme.colors.primary
  },
  queueChipTextSelected: {
    color: '#fff'
  },
  listContent: {
    paddingHorizontal: Theme.spacing.medium,
    paddingBottom: Theme.spacing.large
  },
  itemSeparator: {
    height: Theme.spacing.small - 2
  },

  cardTouchable: {
    borderRadius: Theme.roundness
  },
  card: {
    borderRadius: Theme.roundness,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.small - 2
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    flexShrink: 1,
    marginRight: Theme.spacing.small
  },
  cardDivider: {
    marginVertical: Theme.spacing.small / 2
  },
  destination: {
    fontSize: 14,
    color: '#333',
    marginTop: Theme.spacing.small / 2
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: Theme.spacing.small
  },
  metaChip: {
    height: 24,
    justifyContent: 'center',
    borderRadius: Theme.roundness,
    marginRight: Theme.spacing.small,
    marginTop: Theme.spacing.small / 2,
    backgroundColor: Theme.colors.secondaryBackground
  },
  metaChipText: {
    fontSize: 12
  }
});
