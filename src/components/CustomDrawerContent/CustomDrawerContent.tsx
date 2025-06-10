import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import React from 'react';
import { View } from 'react-native';
import { Button, Caption, Paragraph } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import * as NavigationService from '../../NavigationService';
import { logout } from '../../redux/actions/auth';
import { RootState } from '../../redux/reducers';
import Theme from '../../utils/Theme';
import Icon from '../Icon';
import { styles } from './styles';

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const dispatch = useDispatch();
  const loggedUser = useSelector((state: RootState) => state.mainReducer.session?.user);

  const handleLogout = () => dispatch(logout());

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.fillOut}>
      <View style={styles.userInfoSection}>
        <View style={styles.avatar}>
          <Icon name={2} size={36} color={Theme.colors.primary} />
        </View>
        <View>
          <Paragraph style={styles.textBold}> {loggedUser?.name} </Paragraph>
          <Caption> {loggedUser?.email} </Caption>
        </View>
      </View>

      <View style={styles.sidebarRoutes}>
        <DrawerItemList {...props} />
      </View>

      <View style={styles.logoutSection}>
        <Button
          icon="cog"
          mode="outlined"
          onPress={() => {
            NavigationService.navigate('Settings');
          }}
        >
          Settings
        </Button>
        <Button
          icon="logout"
          mode="contained"
          color={Theme.colors.primary}
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          Logout
        </Button>
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
