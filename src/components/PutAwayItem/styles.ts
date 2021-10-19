import {StyleSheet} from "react-native";
import {colors, device, ratio} from "../../constants";
import Theme from "../../utils/Theme";

export default StyleSheet.create({
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
    row: {
        flexDirection: 'row',
        borderColor: Theme.colors.background,
        borderBottomWidth: 1,
        marginTop: 8,
        padding: 8,
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
        width: '50%', // is 50% of container width
    },
    value: {
        width: '50%', // is 50% of container width
        textAlign: 'right',
    },
});
