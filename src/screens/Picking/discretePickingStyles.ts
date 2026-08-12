import { StyleSheet } from 'react-native';

import Theme from '../../utils/Theme';

export default StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Theme.colors.background
  },

  filterBar: {
    backgroundColor: 'white'
  },
  filterRow: {
    flexGrow: 0,
    flexShrink: 0
  },
  filterRowContent: {
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.medium,
    paddingVertical: Theme.spacing.small
  },
  filterChip: {
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginRight: Theme.spacing.small,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ced4da'
  },
  filterChipSelected: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary
  },
  filterChipText: {
    fontSize: 12,
    color: Theme.colors.secondaryForeground
  },
  filterChipTextSelected: {
    color: 'white'
  },
  filterSkeletonRow: {
    flexDirection: 'row',
    overflow: 'hidden'
  },
  showAssignedToggle: {
    paddingHorizontal: Theme.spacing.medium
  },
  filterChipSkeleton: {
    height: 32,
    borderRadius: 12,
    marginRight: Theme.spacing.small
  },

  listContent: {
    paddingBottom: Theme.spacing.large
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  // Shrinks so a long order number truncates instead of pushing the status chip off-card.
  orderNumberChip: {
    flexShrink: 1
  },
  orderNumberText: {
    fontSize: 14,
    color: Theme.colors.text
  },
  contentDivider: {
    marginVertical: 8
  },
  destination: {
    fontWeight: 'bold',
    color: Theme.colors.text
  },
  destinationType: {
    marginTop: -2,
    color: Theme.colors.secondaryForeground
  },
  additionalInfoRow: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  chipDefault: {
    height: 28,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: Theme.colors.background
  },
  chipText: {
    fontSize: 12,
    color: Theme.colors.text
  },
  fontBold: {
    fontWeight: 'bold'
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
  }
});
