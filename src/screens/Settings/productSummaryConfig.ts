export type ProductSummaryItem = {
  key: string;
  title: string;
  description: string;
  defaultVisible?: boolean;
};

// This configuration defines the product summary items that can be toggled in the settings.
const productSummaryConfig: ProductSummaryItem[] = [
  {
    key: 'lotNumber',
    title: 'Lot Number',
    description: 'Lot number in a product summary'
  },
  {
    key: 'expirationDate',
    title: 'Expiration Date',
    description: 'Show expiration date in product summary'
  },
  {
    key: 'locationType',
    title: 'Location Type',
    description: 'Show location type in product summary'
  }
];

export function getProductSummaryConfig(): ProductSummaryItem[] {
  return productSummaryConfig;
}
