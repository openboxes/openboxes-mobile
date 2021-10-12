import {StyleSheet} from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  contentContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    padding: 8,
  },
  name: {
    fontSize: 17,
    color: Theme.colors.text,
    fontWeight: 'bold',
  },
  boxHeading: {
    fontSize: 15,
    color: Theme.colors.text,
    fontWeight: 'bold',
    marginTop: 8,
  },
  box: {
    borderColor: Theme.colors.background,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
    padding: 8,
  },
  descriptionLabel: {
    fontSize: 20,
    color: Theme.colors.text,
    fontWeight: 'bold',
    marginTop: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: Theme.colors.text,
    borderColor: Theme.colors.background,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
    padding: 8,
  },
  detailsLabel: {
    fontSize: 20,
    color: Theme.colors.text,
    fontWeight: 'bold',
    marginTop: 8,
  },
  detailsContainer: {
    padding: 8,
    borderColor: Theme.colors.background,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
  },
  detailsItemContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: 0,
  },
  detailsItemName: {
    fontSize: 16,
    color: Theme.colors.text,
    fontWeight: 'bold',
  },
  detailsItemValue: {
    fontSize: 16,
    color: Theme.colors.text,
    marginStart: 8,
  },
  container: {
    flexWrap: 'wrap',
    alignItems: 'flex-start', // if you want to fill rows left to right
    borderColor: Theme.colors.background,
    borderWidth: 1,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    borderColor: Theme.colors.background,
    borderBottomWidth: 1,
    marginTop: 8,
    padding: 8,
    width: '100%',
  },
  label: {
    width: '50%', // is 50% of container width
  },
  value: {
    width: '50%', // is 50% of container width
    textAlign: 'right',
  },
  textAlign: {
    textAlign: 'right',
  },
  tinyLogo: {
    width: '100%',
    height: '20%',
  },
  logo: {
    width: 66,
    height: 58,
  },
});
