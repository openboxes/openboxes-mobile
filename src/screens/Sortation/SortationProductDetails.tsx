import React from 'react';
import { View } from 'react-native';
import { Caption, Chip, Divider, Paragraph, Title } from 'react-native-paper';

import { HYPHEN } from '../../constants';
import Product from '../../data/product/Product';
import styles from './styles';

export type DetailChip = {
  icon: string;
  label: string;
  value: string;
};

export type SortationProductDetailsProps = {
  product: Product;
  detailsChips: DetailChip[];
  showDirectPutawayRequired?: boolean;
  directPutawayRequired?: boolean;
};

export default function SortationProductDetails({
  product,
  detailsChips,
  showDirectPutawayRequired = false,
  directPutawayRequired
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
        <Chip key={label} icon={icon} style={[styles.chipDefault, styles.topSpace]} textStyle={styles.chipText}>
          {`${label}: ${value ?? HYPHEN}`}
        </Chip>
      ))}

      {showDirectPutawayRequired && (
        <>
          <Divider style={styles.contentDivider} />
          <View style={styles.cardAnnotation}>
            <Paragraph style={styles.paragraph}>Direct Putaway Required</Paragraph>
            <Chip
              icon={directPutawayRequired === true ? 'check' : 'close'}
              style={styles.chipDefault}
              textStyle={styles.chipText}
            >
              {directPutawayRequired === true ? 'Yes' : 'No'}
            </Chip>
          </View>
        </>
      )}
    </View>
  );
}
