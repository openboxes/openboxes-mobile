import * as React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { Menu, Provider } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/actions/auth';
import styles from './styles';

const OptionMenu = ({ route, navigation }: any) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const handleLogout = () => dispatch(logout());
  return (
    <Provider>
      <View style={styles.menuContainer}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        {route.name !== 'Login' && route.name !== 'Settings' && (
          <Menu
            style={styles.menu}
            visible={visible}
            anchor={
              <TouchableOpacity onPress={openMenu}>
                <Image source={require('../../assets/images/option.jpg')} style={styles.dots} />
              </TouchableOpacity>
            }
            onDismiss={closeMenu}
          >
            <Menu.Item
              title="Dashboard"
              onPress={() => {
                navigation.navigate('Dashboard');
                closeMenu();
              }}
            />
            <Menu.Item
              title="User detail"
              onPress={() => {
                navigation.navigate('Placeholder');
                closeMenu();
              }}
            />
            <Menu.Item
              title="Settings"
              onPress={() => {
                navigation.navigate('Settings');
                closeMenu();
              }}
            />
            <Menu.Item
              title="Change location"
              onPress={() => {
                navigation.navigate('Drawer');
                closeMenu();
              }}
            />
            <Menu.Item
              title="App info / version"
              onPress={() => {
                navigation.navigate('AppInfo');
                closeMenu();
              }}
            />
            <Menu.Item title="Logout" onPress={handleLogout} />
          </Menu>
        )}
      </View>
    </Provider>
  );
};

export default OptionMenu;
