import React, { createContext, useContext } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Chip, Divider, Caption as PaperCaption, Title as PaperTitle, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { HYPHEN } from '../../constants';
import Product from '../../data/product/Product';
import styles from './styles';

export type ProductDetailsItem = {
  icon?: string;
  label: string;
  value: string | number | null;
  secondaryValue?: string | null;
  onPress?: () => void;
  accessibilityLabel?: string;
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
  return (
    <>
      <PaperTitle style={styles.title}>{product.productCode}</PaperTitle>
      <PaperCaption style={styles.caption}>{product.name}</PaperCaption>
    </>
  );
}

function Caption({ title, subtitle }: { title?: string; subtitle?: string }) {
  return title ? (
    <View style={styles.descriptionContainer}>
      <PaperCaption style={styles.caption}>
        {title} {subtitle ? `(${subtitle})` : ''}
      </PaperCaption>
    </View>
  ) : null;
}

function List({ items }: { items: ProductDetailsItem[] }) {
  return (
    <View>
      {items.map((item) => (
        <Item key={item.label} {...item} />
      ))}
    </View>
  );
}

function Item({ icon, label, value, secondaryValue, onPress, accessibilityLabel }: ProductDetailsItem) {
  const content = (
    <View>
      <Chip
        icon={icon}
        style={[styles.chipDefault, styles.marginTopSmall]}
        textStyle={onPress ? styles.pressableChipText : undefined}
      >
        <Text style={styles.chipText}>
          {label}: <Text style={[styles.chipText, styles.fontBold]}>{value ?? HYPHEN}</Text>
          {secondaryValue ? (
            <Text style={[styles.chipText, styles.secondaryValue]}>{`, ${secondaryValue}`}</Text>
          ) : null}
        </Text>
      </Chip>
      {onPress ? <Icon name="chevron-right" size={20} style={styles.itemChevron} /> : null}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
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
  Caption,
  List,
  Item,
  Separator
};
