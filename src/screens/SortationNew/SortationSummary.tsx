import React from 'react';
import { ScrollView, View } from 'react-native';
import { Avatar, Button, Chip, Divider, Text } from 'react-native-paper';
import styles from './styles';

type SortationSummaryProps = {
  productBarcode: string;
  quantity: string;
  containerBarcode: string;
  storageLocationBarcode: string;
  onReset: () => void;
  onToDashboard: () => void;
};

type SummaryRowProps = {
  icon: string;
  label: string;
  value: string;
  showSortedTag?: boolean;
};

const SummaryRow = ({ icon, label, value, showSortedTag = false }: SummaryRowProps) => (
  <>
    <Text style={styles.summaryLabel}>{label}</Text>
    <View style={styles.summaryValueRow}>
      <Avatar.Icon size={32} icon={icon} />
      <Text style={styles.summaryValue}>{value}</Text>
      {showSortedTag && (
        <Chip mode="flat" icon="check" style={styles.sortedTag}>
          Sorted
        </Chip>
      )}
    </View>
  </>
);

const SortationSummary: React.FC<SortationSummaryProps> = ({
  productBarcode,
  quantity,
  containerBarcode,
  storageLocationBarcode,
  onReset,
  onToDashboard
}) => {
  return (
    <View style={styles.summaryContainer}>
      <ScrollView style={styles.summaryContent}>
        <SummaryRow showSortedTag label="Product" icon="package-variant" value={productBarcode} />
        <Divider style={styles.contentDivider} />

        <SummaryRow label="Quantity" icon="layers-outline" value={Number(quantity).toLocaleString()} />
        <Divider style={styles.contentDivider} />

        <SummaryRow label="Container" icon="package-variant-closed" value={containerBarcode} />
        <Divider style={styles.contentDivider} />

        <SummaryRow label="Storage Location" icon="map-marker-outline" value={storageLocationBarcode} />
      </ScrollView>

      <View style={styles.summaryFooter}>
        <Button mode="contained" onPress={onReset}>
          Begin a new sortation
        </Button>
        <Button mode="outlined" style={styles.topSpace} onPress={onToDashboard}>
          To Dashboard
        </Button>
      </View>
    </View>
  );
};

export default SortationSummary;
