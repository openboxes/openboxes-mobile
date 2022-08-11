import { StyleSheet } from 'react-native';

export const units = [0, 4, 8, 10, 16, 20, 24, 30];

export default StyleSheet.create({
  // Full
  ...units.reduce((acc, unit, index) => ({ ...acc, [`M${index}`]: { margin: unit } }), {}),
  // Margin left
  ...units.reduce((acc, unit, index) => ({ ...acc, [`ML${index}`]: { marginLeft: unit } }), {}),
  // Margin right
  ...units.reduce((acc, unit, index) => ({ ...acc, [`MR${index}`]: { marginRight: unit } }), {}),
  // Margin top
  ...units.reduce((acc, unit, index) => ({ ...acc, [`MT${index}`]: { marginTop: unit } }), {}),
  // Margin bottom
  ...units.reduce((acc, unit, index) => ({ ...acc, [`MB${index}`]: { marginBottom: unit } }), {})
});
