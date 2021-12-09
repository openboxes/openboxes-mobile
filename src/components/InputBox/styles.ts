import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        height: 40,
        alignSelf:"center",
        alignItems: 'center' ,
        marginTop:20,
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
        flex: 1,
        marginTop:5,
        height: 40,
        borderColor:'grey',
    },
    select:{
        width: 80,
        borderWidth: 2,
        height: 40,
        alignSelf: 'center',
        borderColor:'grey',
        backgroundColor:'white',
        borderRadius:5,
        marginLeft: 10,
        marginRight:10,
        marginTop:10,
    },
    arrowDownIcon:{
        height: 15,
        width:15,
    },
    editIcon:{
        marginStart:10,
    }
});
