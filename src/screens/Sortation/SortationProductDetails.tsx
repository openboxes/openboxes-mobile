import React from 'react';
import { View } from 'react-native';
import { Caption, Chip, Divider, Paragraph, Switch, Text, Title } from 'react-native-paper';

import { EMPTY_CHAR } from '../../constants';
import { DetailChip, SortationProduct } from '../../types/sortation';
import Theme from '../../utils/Theme';
import styles from './styles';

export type SortationProductDetailsProps = {
  product: SortationProduct;
  detailsChips: DetailChip[];
  showDirectPutawayRequired?: boolean;
  directPutawayRequired?: boolean;
  onToggleDirectPutaway?: (value: boolean) => void;
};

export default function SortationProductDetails({
  product,
  detailsChips,
  showDirectPutawayRequired = false,
  directPutawayRequired = false,
  onToggleDirectPutaway
}: SortationProductDetailsProps) {
  const { productCode, name, description } = product;

  return (
    <View style={styles.productDetails}>
      <View style={styles.headerRow}>
        <Chip icon="barcode" style={styles.chipDefault} textStyle={styles.chipText}>
          {productCode}
        </Chip>
      </View>

      <Divider style={styles.contentDivider} />

      <Title style={styles.title}>{name}</Title>
      <Caption style={styles.caption}>{description}</Caption>

      {detailsChips.map(({ icon, value, label }) => (
        <Chip key={label} icon={icon} style={[styles.chipDefault, styles.topSpace]}>
          <Text style={styles.chipText}>
            {label}: <Text style={[styles.bold, styles.chipText]}>{value ?? EMPTY_CHAR}</Text>
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
