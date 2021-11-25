import {StyleSheet} from "react-native";

export default StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        flex: 1,
        paddingBottom: 30
    },
    row: {
        borderWidth: 2,
        marginVertical: 5,
        padding: 5
    },
    arrowDownIcon: {
        height: 15,
        width: 15,
    },
    select: {
        width: '100%',
        borderWidth: 0,
        height: 40
    },
    quantityBox: {
        flexDirection: 'row',
        alignItems: "center"
    },
    quantityInput: {
        borderWidth: 1,
        height: 30,
        width: 60,
        marginRight: 10,
        paddingVertical: 2,
        paddingHorizontal: 8
    },
    quantityText: {
        fontSize: 23
    }
})
