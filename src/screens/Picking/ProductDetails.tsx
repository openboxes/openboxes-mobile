import React, { createContext, useContext } from 'react';
import { View } from 'react-native';
import { Chip, Divider, Text, Title as PaperTitle } from 'react-native-paper';

import { HYPHEN } from '../../constants';
import Product from '../../data/product/Product';
import styles from './styles';

export type ProductDetailsItem = {
  icon?: string;
  label: string;
  value: string | number | null;
};

type ProductContextType = {
  product: Product;
  status?: string;
};

const ProductContext = createContext<ProductContextType | null>(null);

type ProductProviderProps = {
  product: Product;
  status?: string;
  children: React.ReactNode;
};

export function Provider({ product, status, children }: ProductProviderProps) {
  return <ProductContext.Provider value={{ product, status }}>{children}</ProductContext.Provider>;
}

export function useProduct() {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return ctx;
}

function Root({ children }: { children: React.ReactNode }) {
  return <View style={styles.productDetails}>{children}</View>;
}

function Header({ children }: { children: React.ReactNode }) {
  return <View style={styles.headerRow}>{children}</View>;
}

function Badge({ icon, label, children }: { icon?: string; label?: string; children: React.ReactNode }) {
  return (
    <Chip icon={icon} style={styles.chipDefault}>
      <Text style={styles.chipText}>
        {label ? (
          <>
            {label}: <Text style={[styles.chipText, styles.fontBold]}>{children}</Text>
          </>
        ) : (
          <>{children}</>
        )}
      </Text>
    </Chip>
  );
}

function Title() {
  const { product } = useProduct();
  return <PaperTitle style={styles.title}>{product.name}</PaperTitle>;
}

function List({ items }: { items: ProductDetailsItem[] }) {
  return (
    <View>
      {items.map((item) => (
        <Item key={item.label} icon={item.icon} label={item.label} value={item.value} />
      ))}
    </View>
  );
}

function Item({ icon, label, value }: ProductDetailsItem) {
  return (
    <Chip icon={icon} style={[styles.chipDefault, styles.marginTopSmall]}>
      <Text style={styles.chipText}>
        {label}: <Text style={[styles.chipText, styles.fontBold]}>{value ?? HYPHEN}</Text>
      </Text>
    </Chip>
  );
}

function Separator() {
  return <Divider style={styles.divider} />;
}

export const ProductDetails = {
  Provider,
  Root,
  Header,
  Badge,
  Title,
  List,
  Item,
  Separator
};
