import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
        marginBottom: 15
    },
    row: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center'
    },
    box: {
        flexDirection: 'row',
        flex: 1,
        borderWidth: 2,
        alignItems: 'center',
        paddingHorizontal: 5,
        marginRight: 10
    },
    input: {
        flex: 1
    },
    select:{
        width: 80,
        borderWidth: 2,
        height: 40,
        marginLeft: 10
    },
    arrowDownIcon:{
        height: 15,
        width:15,
    }
});
