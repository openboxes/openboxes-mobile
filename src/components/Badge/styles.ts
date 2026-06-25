import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12
  },
  badgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 2
  },
  badgeIcon: {
    marginRight: 6
  },
  badgeIconSmall: {
    marginRight: 4
  },
  badgeLabel: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  badgeLabelSmall: {
    fontSize: 11
  }
});
