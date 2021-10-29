import {StyleSheet} from 'react-native';
import {colors, ratio} from "../../constants";

export default StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    from: {
        flex: 1
    },
    bottom:{
        width: '100%',
        alignItems: "center",
        justifyContent: "center",
        height: ratio.height * 100,
    },
});