import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';
import colors from './colors';

export default StyleSheet.create({
  h1: {
    fontSize: 30,
    color: 'black',
    fontWeight: '500'
  },
  h2: {
    fontSize: 25,
    color: 'black',
    fontWeight: '500'
  },
  h3: {
    fontSize: 20,
    color: 'black',
    fontWeight: '500'
  },
  h4: {
    fontSize: 15,
    color: 'black',
    fontWeight: '500'
  },
  p1: {
    fontSize: 11
  },
  p2: {
    fontSize: 15
  },
  p3: {
    fontSize: 20
  },
  p4: {
    fontSize: 25
  },
  bold: {
    fontWeight: 'bold'
  },
  colorPrimary: {
    color: Theme.colors.text
  },
  colorSecondary: {
    color: Theme.colors.placeholder
  },
  colorAccent: {
    color: colors.accent
  },
  label: {
    fontSize: 11,
    color: Theme.colors.placeholder
  },
  value: {
    fontSize: 12,
    color: Theme.colors.text
  }
});
