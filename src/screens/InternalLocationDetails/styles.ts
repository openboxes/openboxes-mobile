import {StyleSheet} from 'react-native';
import Theme from '../../utils/Theme';

export default StyleSheet.create({
    screenContainer: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
    },
    countLabelAndIconContainer: {
        display: 'flex',
        flexDirection: 'row',
        flex: 0,
        alignItems: 'center',
    },
    countLabel: {
        fontWeight: 'bold',
        fontSize: 16,
        marginStart: 4,
    },

    rowItem: {
        flexDirection: 'row',
        borderColor: Theme.colors.background,
        marginTop: 1,
        padding: 2,
        marginStart: 4,
        width: '100%',
        alignItems:"center"
    },
    columnItem: {
        display: 'flex',
        flexDirection: 'column',
        flex: 0,
        width: '50%',
    },
    label: {
        fontSize: 12,
        color: Theme.colors.placeholder,
    },
    value: {
        fontSize: 16,
        color: Theme.colors.text,
        width:"90%"
    },
});
