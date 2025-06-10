import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export const styles = StyleSheet.create({
  userInfoSection: {
    padding: 16,
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc'
  },
  avatar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  fillOut: {
    flex: 1
  },
  sidebarRoutes: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 16
  },
  textBold: {
    fontWeight: 'bold'
  },
  logoutSection: {
    padding: Theme.spacing.large,
    borderTopColor: '#ccc'
  },
  logoutButton: {
    marginTop: Theme.spacing.small
  }
});
