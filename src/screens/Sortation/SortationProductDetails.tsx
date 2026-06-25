import React from 'react';
import { View } from 'react-native';
import { Caption, Chip, Divider, Paragraph, Text, Title } from 'react-native-paper';

import ArrowRight from '../../assets/images/arrow_right.svg';
import { SegmentedControl, SegmentedOption } from '../../components/SegmentedControl';
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

type PutawayMethod = 'SORTED' | 'DIRECT';

const PUTAWAY_METHOD_HINTS: Record<PutawayMethod, string> = {
  SORTED: 'Sort to a temporary putaway container — scan a container next.',
  DIRECT: 'Put the item away directly to its storage location now.'
};

const PUTAWAY_METHOD_OPTIONS: SegmentedOption<PutawayMethod>[] = [
  { value: 'SORTED', label: 'Sorted', icon: 'package-variant-closed' },
  { value: 'DIRECT', label: 'Direct', icon: 'map-marker-radius' }
];

function PutawayMethodSelector({
  value,
  onChange
}: {
  value: PutawayMethod;
  onChange: (method: PutawayMethod) => void;
}) {
  return (
    <View>
      <Paragraph style={[styles.paragraph, styles.bold]}>Putaway Method</Paragraph>

      <SegmentedControl
        style={styles.methodSelector}
        options={PUTAWAY_METHOD_OPTIONS}
        value={value}
        onChange={onChange}
      />

      <View style={styles.methodHintRow}>
        <ArrowRight width={16} height={16} fill={Theme.colors.secondaryForeground} style={styles.methodHintIcon} />
        <Text style={styles.methodHint}>{PUTAWAY_METHOD_HINTS[value]}</Text>
      </View>
    </View>
  );
}

export default function SortationProductDetails({
  product,
  task,
  detailsChips,
  showDirectPutawayRequired = false,
  directPutawayRequired = false,
  onToggleDirectPutaway
}: SortationProductDetailsProps) {
  const { productCode, name } = product;
  const { shipmentNumber } = task ?? {};

  return (
    <View style={styles.productDetails}>
      <View style={styles.headerRow}>
        <Chip icon="barcode" style={styles.chipDefault} textStyle={styles.chipText}>
          <Text style={[styles.bold, styles.chipText]}>{task?.identifier ?? EMPTY_FALLBACK}</Text>
        </Chip>
        <Chip style={styles.chipDefault} textStyle={styles.chipText}>
          {`${task?.status ?? EMPTY_FALLBACK}`}
        </Chip>
      </View>

      <Divider style={styles.contentDivider} />

      <Title style={styles.title}>{productCode}</Title>
      <Caption style={styles.caption}>{name}</Caption>

      {product.description ? <Paragraph style={[styles.paragraphMuted]}>{product.description}</Paragraph> : null}

      <Chip icon="receipt" style={[styles.chipDefault, styles.topSpace]} textStyle={styles.chipText}>
        ASN: <Text style={[styles.bold, styles.chipText]}>{shipmentNumber ?? EMPTY_FALLBACK}</Text>
      </Chip>

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
          <PutawayMethodSelector
            value={directPutawayRequired ? 'DIRECT' : 'SORTED'}
            onChange={(method) => onToggleDirectPutaway?.(method === 'DIRECT')}
          />
        </>
      )}
    </View>
  );
}
