import { RouteProp, useRoute } from '@react-navigation/native';
import * as React from 'react';
import { Alert, FlatList, View } from 'react-native';
import { Button, Caption, Chip, Divider, Subheading, Text, Title } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import StagingLocationZoneMismatchModal from '../../components/StagingLocationZoneMismatchModal';
import { HYPHEN } from '../../constants';
import { dropPickTaskAction } from '../../redux/actions/picking';
import { PickTask } from '../../types/picking';
import Theme from '../../utils/Theme';
import styles from './styles';
import { navigate } from '../../NavigationService';

type PickingStagingDropRouteProp = RouteProp<{ PickingStagingDrop: { tasks: PickTask[] } }, 'PickingStagingDrop'>;

export default function PickingStagingDropScreen() {
  const { params } = useRoute<PickingStagingDropRouteProp>();
  const { tasks } = params;
  const dispatch = useDispatch();
  const [zoneMismatchMessage, setZoneMismatchMessage] = React.useState<string | undefined>(undefined);

  const outboundContainer = tasks?.[0]?.outboundContainer;
  const stagingLocation = tasks?.[0]?.stagingLocation;
  const requisitionNumbers = Array.from(
    new Set(
      tasks
        ?.map((task) => task.requisitionNumber)
        .filter((requisitionNumber): requisitionNumber is string => Boolean(requisitionNumber))
    )
  );

  function handleTransferResponse(response: { errorMessage?: string; allowOverride?: boolean }) {
    if (response.allowOverride) {
      setZoneMismatchMessage(response.errorMessage);
      return;
    }

    if (response.errorMessage) {
      Alert.alert('Transfer Failed', response.errorMessage);
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
  }

  function handleDropToStaging() {
    if (!stagingLocation) {
      Alert.alert('Staging Location Missing', 'Current task does not have a staging location assigned.');
      return;
    }

    if (!outboundContainer) {
      Alert.alert('Outbound Container Missing', 'Current task does not have an outbound container assigned.');
      return;
    }

    dispatch(dropPickTaskAction(outboundContainer.id, stagingLocation.id, handleTransferResponse));
  }

  // The suggested staging location (the only one this screen ever uses - there's no scanning
  // here) can fail the facility's zone check; this resubmits the same drop with the override
  // flag so the user can still stage there after acknowledging the mismatch.
  function handleStageAnyway() {
    setZoneMismatchMessage(undefined);

    if (!outboundContainer || !stagingLocation) {
      return;
    }

    dispatch(dropPickTaskAction(outboundContainer.id, stagingLocation.id, handleTransferResponse, true));
  }

  return (
    <View style={styles.mainWrapper}>
      <View style={styles.productDetails}>
        <Title style={styles.title}> {outboundContainer?.name} </Title>

        <View>
          <Chip icon="pin" style={[styles.chipDefault, styles.marginTopSmall]}>
            <Text style={styles.chipText}>
              Outbound Container:{' '}
              <Text style={[styles.chipText, styles.fontBold]}>{outboundContainer?.locationNumber ?? HYPHEN}</Text>
            </Text>
          </Chip>
          <Chip icon="truck" style={[styles.chipDefault, styles.marginTopSmall]}>
            <Text style={styles.chipText}>
              Staging Location:{' '}
              <Text style={[styles.chipText, styles.fontBold]}>{stagingLocation?.name ?? HYPHEN}</Text>
            </Text>
          </Chip>
          <View style={styles.requisitionsSection}>
            <Text style={styles.requisitionsLabel}>Order Numbers</Text>
            <View style={styles.requisitionTagList}>
              {(requisitionNumbers.length > 0 ? requisitionNumbers : [HYPHEN]).map((requisitionNumber) => (
                <View key={requisitionNumber} style={styles.requisitionTag}>
                  <MaterialCommunityIcons
                    name="clipboard-text"
                    size={14}
                    color={Theme.colors.secondaryForeground}
                    style={styles.requisitionTagIcon}
                  />
                  <Text style={styles.requisitionTagText}>{requisitionNumber}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
      <Divider />
      <View style={[styles.wrapperWithPadding, styles.flex1]}>
        <FlatList
          style={styles.flex1}
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <Subheading style={styles.fontBold}>{item.product.name}</Subheading>
              <Caption>Product Code: {item.product.productCode ?? HYPHEN}</Caption>

              <Chip
                icon="clipboard-text"
                style={[styles.chipDefault, styles.marginTopSmall, styles.flex1, styles.marginRight]}
              >
                <Text style={styles.chipText}>
                  Order Number:{' '}
                  <Text style={[styles.chipText, styles.fontBold]}>{item.requisitionNumber ?? HYPHEN}</Text>
                </Text>
              </Chip>
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

      <StagingLocationZoneMismatchModal
        visible={!!zoneMismatchMessage}
        message={zoneMismatchMessage}
        cancelLabel="Cancel"
        onScanAnother={() => setZoneMismatchMessage(undefined)}
        onStageAnyway={handleStageAnyway}
      />
    </View>
  );
}
