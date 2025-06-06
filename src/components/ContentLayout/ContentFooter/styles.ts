import { StyleSheet } from 'react-native';
import Theme from '../../../utils/Theme';

export default StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: Theme.colors.surface,
    paddingVertical: Theme.spacing.small,
    paddingHorizontal: Theme.spacing.medium
  },
  directionRow: {
    flexDirection: 'row'
  },
  directionColumn: {
    flexDirection: 'column'
  }
});

export const gapStyle = ({ gap }: { gap: number }) => {
  return StyleSheet.create({
    container: {
      marginVertical: -gap,
      marginHorizontal: -gap
    },
    gap: {
      marginVertical: gap,
      marginHorizontal: gap
    }
  });
};
