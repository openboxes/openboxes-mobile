import * as React from 'react';
import { Image, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Menu } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/actions/auth';

const OptionMenu = ({ route, navigation }: any) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const handleLogout = () => dispatch(logout());

  return (
    <View>
      {route.name !== 'Login' && route.name !== 'Settings' ? (
        <Menu
          visible={visible}
          anchor={
            <TouchableOpacity style={styles.touchable} onPress={openMenu}>
              <Image source={require('../assets/images/option.jpg')} style={styles.image} />
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
            style={styles.menuItem}
            title="Settings"
            onPress={() => {
              navigation.navigate('Settings');
              closeMenu();
            }}
          />
          <Menu.Item
            style={styles.menuItem}
            title="Change location"
            onPress={() => {
              navigation.navigate('Choose Location');
              closeMenu();
            }}
          />
          <Menu.Item
            style={styles.menuItem}
            title="App info / version"
            onPress={() => {
              navigation.navigate('AppInfo');
              closeMenu();
            }}
          />
          <Menu.Item style={styles.menuItem} title="Logout" onPress={handleLogout} />
        </Menu>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  touchable: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    resizeMode: 'center',
    width: 40,
    height: 40,
    zIndex: 123
  },
  menuItem: {
    width: '70%'
  }
});

export default OptionMenu;
