import React from 'react';
import { View } from 'react-native';
import { Chip, Divider, Text, Title } from 'react-native-paper';

import { ProductIcon } from '../../components/Icons';
import { EMPTY_FALLBACK } from '../../constants';
import { DetailChip } from '../../types/sortation';
import styles from './styles';

export type CreateTransferDetailsPanelProps = {
  productCode: string;
  productName: string;
  detailsChips: DetailChip[];
};

const renderProductIcon = () => <ProductIcon size={16} color="#000" />;

function CreateTransferDetailsPanel({ productCode, productName, detailsChips }: CreateTransferDetailsPanelProps) {
  return (
    <View style={styles.productDetails}>
      <View style={styles.headerRow}>
        <Chip icon={renderProductIcon} style={styles.chipDefault} textStyle={styles.chipText}>
          {productCode}
        </Chip>
      </View>

      <Divider style={styles.contentDivider} />

      <Title style={styles.title}>{productName}</Title>

      {detailsChips.map(({ icon, value, label, isActive }) => (
        <Chip key={label} icon={icon} style={[styles.chipDefault, styles.topSpace, isActive && styles.chipActive]}>
          <Text style={styles.chipText}>
            {label}: <Text style={[styles.bold, styles.chipText]}>{value ?? EMPTY_FALLBACK}</Text>
          </Text>
        </Chip>
      ))}
    </View>
  );
}

export default React.memo(CreateTransferDetailsPanel);
