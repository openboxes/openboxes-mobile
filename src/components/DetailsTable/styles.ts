import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  }
});

const columnStyle = (columnNumber: number, gap: number) => {
  const width = 100 / columnNumber - gap * columnNumber;
  return StyleSheet.create({
    column: {
      width: `${width}%`,
      marginBottom: 10,
    }
  });
};

export { columnStyle };
