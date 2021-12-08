import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import Product from '../../data/product/Product';
import onBarcodeScanned from '../../hooks/onBarcodeScanned';

const Scan = () => {
  const barcodeData = onBarcodeScanned();
  const navigation = useNavigation();

  useEffect(() => {
    if (barcodeData?.results && barcodeData?.query) {
      onSuccess(barcodeData?.results, barcodeData?.query);
    }
  }, [barcodeData]);

  const onSuccess = (data: any, query: any) => {
    if (data.type === 'Product') {
      navigateToProduct(data);
    } else if (data.type === 'Location') {
      navigateToLocationDetails(query);
    } else if (data.type === 'Container') {
      navigateToLPNDetails(data.id, data?.shipment?.shipmentNumber ?? '');
    }
  };

  const navigateToProduct = (product: Product | undefined) => {
    if (product) {
      // @ts-ignore
      navigation.navigate('ProductDetails', {product});
    }
  };
  const navigateToLocationDetails = (id: string | undefined) => {
    if (id) {
      // @ts-ignore
      navigation.navigate('InternalLocationDetail', {id});
    }
  };
  const navigateToLPNDetails = (id: string | undefined, stockMovement: any) => {
    if (id) {
      // @ts-ignore
      navigation.navigate('LpnDetail', {
        id: id,
        shipmentNumber: stockMovement,
      });
    }
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.countLabelAndIconContainer}>
        {barcodeData && (
          <Text style={styles.countLabel}>
            {JSON.stringify(barcodeData?.query)}
          </Text>
        )}
      </View>
    </View>
  );
};

export default Scan;
