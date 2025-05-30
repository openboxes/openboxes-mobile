import { StyleSheet } from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16
  },
  dividerHorizontal: {
    marginVertical: 8
  },
  dividerVertical: {
    width: 1,
    marginHorizontal: 8,
    height: '50%'
  },
  chipWarning: {
    height: 24,
    justifyContent: 'center',
    borderRadius: Theme.roundness,
    alignItems: 'center',
    backgroundColor: Theme.colors.warning
  },
  chipWarningText: {
    fontSize: 12,
    color: Theme.colors.text
  },
  chipDefault: {
    height: 24,
    justifyContent: 'center',
    borderRadius: Theme.roundness,
    alignItems: 'center',
    marginRight: Theme.spacing.small
  },
  chipDefaultText: {
    fontSize: 12,
    color: Theme.colors.text
  },
  inboundDetailsContainer: {
    padding: 16,
    backgroundColor: '#fff'
  },
  arrowDownIcon: {
    height: 12,
    width: 12,
    marginRight: Theme.spacing.medium
  },
  select: {
    width: '100%',
    borderWidth: 2,
    height: 40,
    alignSelf: 'center',
    borderColor: 'grey',
    backgroundColor: 'white',
    borderRadius: Theme.roundness,
    marginTop: 10
  },
  from: {
    flex: 1
  },
  bottom: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.small,
    paddingHorizontal: Theme.spacing.medium,
    backgroundColor: '#fff'
  },
  itemView: {
    marginTop: 5
  },
  rowItem: {
    flexDirection: 'row',
    borderColor: Theme.colors.background,
    marginTop: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  columnItem: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0
  },
  label: {
    fontSize: 11,
    color: Theme.colors.placeholder
  },
  value: {
    fontSize: 12,
    color: Theme.colors.text
  },
  datePickerContainer: {
    marginVertical: 5
  },
  datePicker: {
    width: '100%',
    flex: 1,
    height: 55,
    justifyContent: 'center',
    marginBottom: Theme.spacing.small
  },
  datePickerCustomStyle: {
    dateTouchBody: {
      width: '100%',
      height: '100%'
    },
    dateIcon: {
      display: 'none'
    },
    placeholderText: {
      marginLeft: 10,
      fontSize: 16,
      color: Theme.colors.placeholder
    },
    dateText: {
      marginLeft: 10,
      fontSize: 16
    },
    dateInput: {
      height: '100%',
      alignItems: 'flex-start',
      justifyContent: 'center',
      textAlign: 'left',
      borderColor: 'grey',
      borderWidth: 1,
      borderRadius: Theme.roundness
    }
  },
  imageIcon: {
    position: 'absolute',
    end: Theme.spacing.medium,
    width: 30,
    height: 30,
    bottom: 20,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100
  },
  lotStatusSelectStyle: {
    width: '100%',
    borderWidth: 1,
    height: 55,
    alignSelf: 'center',
    borderColor: Theme.colors.backdrop,
    borderRadius: Theme.roundness,
    marginBottom: Theme.spacing.small
  },
  lotStatusSelectTextStyle: {
    textAlign: 'left',
    fontSize: 15,
    color: '#808080'
  },
  lastChild: {
    marginRight: 0
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  dividedValues: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  additionalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
