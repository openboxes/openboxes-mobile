import React, {FC, useEffect, useState} from 'react'
import {View, TextInput, Text,Button} from "react-native";
import {Props} from './types'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {environment} from "../../utils/Environment";

const Settings: FC<Props> = ({}) => {
    const [value, setValue] = useState('')

    useEffect(() => {
        const setUrl = async () => {
            const API_URL = await AsyncStorage.getItem('API_URL') || environment.API_BASE_URL
            setValue(API_URL)
        }
        setUrl()
    }, [])


    return (
        <View style={{flex: 1, padding: 10}}>
            <View style={{width: '100%', marginBottom: 50}}>
                <Text>URL</Text>
                <TextInput value={value} style={{borderWidth: 1, paddingHorizontal: 10, marginTop: 5}}/>
            </View>
            <Button
                onPress={()=>{}}
                title="Go"
            />
        </View>
    )
}

export default Settings