import React from 'react';

import IconContainer from '../assets/images/icon_container.svg';
import IconLocation from '../assets/images/icon_location.svg';
import IconProducts from '../assets/images/icon_products.svg';
import IconQuantity from '../assets/images/icon_quantity.svg';

export function ContainerIcon({ color = '#20345c', size = 32 }: { color?: string; size?: number }) {
  return <IconContainer width={size} height={size} fill={color} />;
}

export function LocationIcon({ color = '#20345c', size = 32 }: { color?: string; size?: number }) {
  return <IconLocation width={size} height={size} fill={color} />;
}

export function ProductIcon({ color = '#20345c', size = 32 }: { color?: string; size?: number }) {
  return <IconProducts width={size} height={size} fill={color} />;
}

export function QuantityIcon({ color = '#20345c', size = 32 }: { color?: string; size?: number }) {
  return <IconQuantity width={size} height={size} fill={color} />;
}
