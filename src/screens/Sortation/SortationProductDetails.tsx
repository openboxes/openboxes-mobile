import React from 'react';
import { View } from 'react-native';
import { Chip, Divider, Paragraph, Switch, Text, Title } from 'react-native-paper';

import { ProductIcon } from '../../components/Icons';
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
  detailsChips,
  showDirectPutawayRequired = false,
  directPutawayRequired = false,
  onToggleDirectPutaway
}: SortationProductDetailsProps) {
  const { productCode, name } = product;

  return (
    <View style={styles.productDetails}>
      <View style={styles.headerRow}>
        <Chip
          icon={() => <ProductIcon size={16} color="#000" />}
          style={styles.chipDefault}
          textStyle={styles.chipText}
        >
          {productCode}
        </Chip>
      </View>

      <Divider style={styles.contentDivider} />

      <Title style={styles.title}>{name}</Title>

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
