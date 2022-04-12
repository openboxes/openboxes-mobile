import {StyleSheet} from "react-native";
import Theme from "../../utils/Theme";
import {ratio} from "../../constants";

export default StyleSheet.create({
    contentContainer: {
        display: "flex",
        flex: 1,
        flexDirection: "column",
        padding: 8,
    },
    bottom: {
        width: '100%',
        alignItems: "center",
        justifyContent: "center",
        height: ratio.height * 100,
    },
    list: {
        width: '100%',
    },
    listItemContainer: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        borderRadius: Theme.roundness,
        borderColor: Theme.colors.backdrop,
        borderWidth: 1,
        margin: 4,
        padding: 4,
        justifyContent: 'center',
    },
    listItemNameContainer: {
        display: 'flex',
        flexDirection: 'column',
        flex: 0,
        marginStart: 4,
    },
    listItemNameLabel: {
        fontSize: 12,
        color: Theme.colors.placeholder,
    },
    listItemName: {
        fontSize: 16,
        color: Theme.colors.text,
    },
    listItemCategoryContainer: {
        display: 'flex',
        flexDirection: 'column',
        flex: 0,
        marginStart: 4,
        marginTop: 4,
    },
    listItemCategoryLabel: {
        fontSize: 12,
        color: Theme.colors.placeholder,
    },
    listItemCategory: {
        fontSize: 16,
        color: Theme.colors.text,
    },
    row: {
        flexDirection: 'row',
        borderColor: Theme.colors.background,
        // borderBottomWidth: 1,
        marginTop: 1,
        padding: 2,
        width: '100%',
    },
    col50: {
        display: 'flex',
        flexDirection: 'column',
        flex: 0,
        marginStart: 4,
        width: '50%',
    },
    label: {
        fontSize: 12,
        color: Theme.colors.placeholder,
    },
    value: {
        fontSize: 16,
        color: Theme.colors.text,
    },
    arrowDownIcon:{
        height: 15,
        width:15,
    },
    select:{
        width: "100%",
        borderWidth: 2,
        height: 40,
        alignSelf: 'center',
        borderColor:'grey',
        backgroundColor:'white',
        borderRadius:5,
        marginTop:10,
    },
});