import { RouteProp, useRoute } from '@react-navigation/native';
import * as React from 'react';
import { Alert, FlatList, View } from 'react-native';
import { Button, Caption, Chip, Divider, Subheading, Text, Title } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { HYPHEN } from '../../constants';
import { dropPickTaskAction } from '../../redux/actions/picking';
import { PickTask } from '../../types/picking';
import styles from './styles';
import { navigate } from '../../NavigationService';

type PickingStagingDropRouteProp = RouteProp<{ PickingStagingDrop: { tasks: PickTask[] } }, 'PickingStagingDrop'>;

export default function PickingStagingDropScreen() {
  const { params } = useRoute<PickingStagingDropRouteProp>();
  const { tasks } = params;
  const dispatch = useDispatch();

  const outboundContainer = tasks?.[0]?.outboundContainer;
  const stagingLocation = tasks?.[0]?.stagingLocation;

  function handleDropToStaging() {
    if (!stagingLocation) {
      Alert.alert('Staging Location Missing', 'Current task does not have a staging location assigned.');
      return;
    }

    if (!outboundContainer) {
      Alert.alert('Outbound Container Missing', 'Current task does not have an outbound container assigned.');
      return;
    }

    dispatch(
      dropPickTaskAction(outboundContainer.id, stagingLocation.id, ({ errorMessage }) => {
        if (errorMessage) {
          Alert.alert('Transfer Failed', errorMessage);
          return;
        }

        Alert.alert('Transfer Successful', 'Picked items have been moved to the staging location.', [
          {
            text: 'OK',
            onPress: () => {
              navigate('PickingMoveToStaging');
            }
          }
        ]);
      })
    );
  }

  return (
    <View>
      <View style={styles.productDetails}>
        <Title style={styles.title}> {outboundContainer?.name} </Title>

        <View>
          {[
            { icon: 'pin', label: 'Outbound Container', value: outboundContainer?.locationNumber },
            { icon: 'truck', label: 'Staging Location', value: stagingLocation?.name }
          ].map((item) => (
            <Chip icon={item.icon} style={[styles.chipDefault, styles.marginTopSmall]} key={item.icon}>
              <Text style={styles.chipText}>
                {item.label}: <Text style={[styles.chipText, styles.fontBold]}>{item.value ?? HYPHEN}</Text>
              </Text>
            </Chip>
          ))}
        </View>
      </View>
      <Divider />
      <View style={styles.wrapperWithPadding}>
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <Subheading style={styles.fontBold}>{item.product.name}</Subheading>
              <Caption>Product Code: {item.product.productCode ?? HYPHEN}</Caption>

              <Chip
                icon="calendar"
                style={[styles.chipDefault, styles.marginTopSmall, styles.flex1, styles.marginRight]}
              >
                <Text style={styles.chipText}>
                  Date Picked: <Text style={[styles.chipText, styles.fontBold]}>{item.datePicked?.split('T')[0]}</Text>
                </Text>
              </Chip>
              <Chip
                icon="package"
                style={[styles.chipDefault, styles.marginTopSmall, styles.flex1, styles.marginRight]}
              >
                <Text style={styles.chipText}>
                  Quantity Picked:{' '}
                  <Text style={[styles.chipText, styles.fontBold]}>{item.quantityPicked ?? HYPHEN}</Text>
                </Text>
              </Chip>
            </View>
          )}
        />

        <Button mode="contained" style={[styles.marginTop, styles.fullWidth]} onPress={handleDropToStaging}>
          Move To Staging
        </Button>
      </View>
    </View>
  );
}
