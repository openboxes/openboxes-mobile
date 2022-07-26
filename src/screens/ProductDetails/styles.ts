import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  itemView: {
    marginStart: 10,
    marginEnd: 10,
    marginTop: 5,
    marginBottom: 10
  },
  rowItem: {
    flexDirection: 'row',
    borderColor: Theme.colors.background,
    marginTop: 1,
    padding: 2,
    marginStart: 4,
    width: '100%',
    alignItems: 'center'
  },
  name: {
    fontSize: 17,
    color: Theme.colors.text,
    fontWeight: 'bold'
  },
  boxHeading: {
    fontSize: 15,
    color: Theme.colors.text,
    fontWeight: 'bold',
    marginTop: 8
  },
  entry: {
    display: 'flex',
    flexDirection: 'row',
    borderColor: Theme.colors.background,
    borderBottomWidth: 1,
    marginTop: 8,
    padding: 8,
    justifyContent: 'space-between'
  },
  entryText: {
    fontSize: 15,
    color: Theme.colors.placeholder
  }
});
