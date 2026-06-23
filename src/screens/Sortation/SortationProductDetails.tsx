import React from 'react';
import { View } from 'react-native';
import { Caption, Chip, Divider, Paragraph, Switch, Text, Title } from 'react-native-paper';

import { EMPTY_FALLBACK } from '../../constants';
import { DetailChip, SortationProduct, SortationTask } from '../../types/sortation';
import Theme from '../../utils/Theme';
import styles from './styles';

export type SortationProductDetailsProps = {
  product: SortationProduct;
  detailsChips: DetailChip[];
  showDirectPutawayRequired?: boolean;
  directPutawayRequired?: boolean;
  task?: SortationTask;
  onToggleDirectPutaway?: (value: boolean) => void;
};

export default function SortationProductDetails({
  product,
  task,
  detailsChips,
  showDirectPutawayRequired = false,
  directPutawayRequired = false,
  onToggleDirectPutaway
}: SortationProductDetailsProps) {
  const { productCode, name } = product;
  const { backorderReference, shipmentNumber } = task ?? {};

  return (
    <View style={styles.productDetails}>
      <View style={styles.headerRow}>
        <Chip icon="truck-delivery" style={styles.chipDefault} textStyle={styles.chipText}>
          ASN: <Text style={[styles.bold, styles.chipText]}>{shipmentNumber ?? EMPTY_FALLBACK}</Text>
        </Chip>
        <Chip icon="clipboard-text-outline" style={styles.chipDefault} textStyle={styles.chipText}>
          PO: <Text style={[styles.bold, styles.chipText]}>{backorderReference ?? EMPTY_FALLBACK}</Text>
        </Chip>
      </View>

      <Divider style={styles.contentDivider} />

      <Title style={styles.title}>{name}</Title>
      <Caption style={styles.caption}>{productCode}</Caption>

      {product.description ? <Paragraph style={[styles.paragraphMuted]}>{product.description}</Paragraph> : null}

      {detailsChips.map(({ icon, value, label, isActive }) => (
        <Chip key={label} icon={icon} style={[styles.chipDefault, styles.topSpace, isActive && styles.chipActive]}>
          <Text style={styles.chipText}>
            {label}: <Text style={[styles.bold, styles.chipText]}>{value ?? EMPTY_FALLBACK}</Text>
          </Text>
        </Chip>
      ))}

      {showDirectPutawayRequired && (
        <>
          <Divider style={styles.contentDivider} />
          <View style={styles.cardAnnotation}>
            <Paragraph style={[styles.paragraph, styles.bold]}>Direct Putaway Required</Paragraph>
            <Switch
              disabled={!onToggleDirectPutaway}
              color={Theme.colors.primary}
              value={directPutawayRequired}
              onValueChange={(val) => onToggleDirectPutaway?.(val)}
            />
          </View>
        </>
      )}
    </View>
  );
}
