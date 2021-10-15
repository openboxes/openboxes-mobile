import {StyleSheet} from "react-native";

export default StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(99, 107, 99, 0.8)'
    },
    modalView: {
        width: '80%',
        minHeight: '45%',
        backgroundColor: "white",
        borderRadius: 10,
        paddingVertical: 20,
        paddingHorizontal: 40,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5

    },
    image: {
        width: 200,
        height: 150,
        resizeMode: "stretch"
    },
    form: {
        flex:1,
        width: '100%',
        justifyContent: "space-around"
    },
    buttonClose: {
        backgroundColor: "#2196F3",
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 10,
        top:10,
        elevation: 5

    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    inputLabel: {
        borderWidth:2,
        height: 40,
        width: '100%',
        padding: 5
    },
    select: {
        width: '100%',
        borderWidth: 2,
        height: 40
    },
    arrowDownIcon:{
      height: 15,
      width:15,
    }
});
