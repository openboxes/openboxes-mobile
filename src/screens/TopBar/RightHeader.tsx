import React from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import OptionMenu from '../../components/OptionMenu';
import { RootState } from '../../redux/reducers';
import styles from './styles';

interface HeaderRightProps {
  route: any;
  navigation: any;
}

const HeaderRight = ({ route, navigation }: HeaderRightProps) => {
  const currentLocation = useSelector((state: RootState) => state.mainReducer.currentLocation);
  const loggedIn = useSelector((state: RootState) => state.mainReducer.loggedIn);
  const screensToHideMenu = ["Dashboard", "Choose Location"];

  return (
    <View style={styles.container}>
      {currentLocation && (
        <Text style={styles.locationText} numberOfLines={1} ellipsizeMode="tail">
          {currentLocation.name}
        </Text>
      )}
      {loggedIn && !screensToHideMenu.includes(route.name) && (
        <OptionMenu route={route} navigation={navigation} />
      )}
    </View>
  );
};

export default HeaderRight;