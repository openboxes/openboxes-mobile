import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {RadioButton} from 'react-native-paper';

const Radio = ({title, check}: any) => {
    const [checked, setChecked] = useState(check);

    return (
        <View style={styles.container}>
            <View style={styles.radioButton}>
                <RadioButton
                    color={'grey'}
                    value="false"
                    status={checked ? 'checked' : 'unchecked'}
                    onPress={() => setChecked(!checked)}
                />
            </View>
            <View style={styles.title}>
                <Text>{title}</Text>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: 'center'
    },
    title: {
        flex: 9
    },
    radioButton: {
        flex: 1
    }
});
export default Radio;
