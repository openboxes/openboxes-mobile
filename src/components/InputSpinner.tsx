import React from 'react';
import {InputSpinner as Spinner} from "react-native-input-spinner";
import {StyleSheet, Text, View} from "react-native";
import {colors} from "../constants";

const InputSpinner = ({title,value,max,setValue}: any) => {
    return (<>
            <View style={styles.textView}><Text>{title}</Text></View>
            <View style={styles.container}>
                <Spinner
                    max={max}
                    min={0}
                    color={colors.headerColor}
                    value={value}
                    onChange={(num:any)=>{
                        setValue(num);
                    }}
                />
            </View>
        </>
    )
};
export default InputSpinner;
const styles = StyleSheet.create({
    container: {
        width: "40%",
        marginTop: "5%",
        marginStart:"3%"
    },
    textView: {
        marginTop: "10%",
        marginStart:5
    }
})
