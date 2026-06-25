import { StyleSheet } from 'react-native';

import Theme from '../../utils/Theme';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.secondaryBackground,
    borderRadius: 8,
    padding: 4
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 6
  },
  segmentSelected: {
    backgroundColor: '#FFFFFF'
  },
  segmentIcon: {
    marginRight: 6
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.disabled
  },
  segmentTextSelected: {
    color: Theme.colors.primary,
    fontWeight: 'bold'
  }
});
