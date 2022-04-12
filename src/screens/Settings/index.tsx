import React, {FC, useEffect, useState} from 'react';
import {View, TextInput, Text} from "react-native";
import {Props} from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {environment} from "../../utils/Environment";
import * as NavigationService from "../../NavigationService";
import ApiClient from "../../utils/ApiClient";
import Button from "../../components/Button";

const Settings: FC<Props> = ({}) => {
    const [value, setValue] = useState('');

    useEffect(() => {
        AsyncStorage.getItem('API_URL').then((url) => {
            setValue(url || environment.API_BASE_URL);
        });
    }, []);

    const handlePress = () => {
        ApiClient.setBaseUrl(value);
        AsyncStorage.setItem('API_URL', value).then(() => {
            NavigationService.navigate("Login");
        });
    };

    return (
        <View style={{flex: 1, padding: 10}}>
            <View style={{width: '100%', marginBottom: 50}}>
                <Text>URL</Text>
                <TextInput
                    style={{borderWidth: 1, paddingHorizontal: 10, marginTop: 5}}
                    value={value}
                    onChangeText={(text) => {
                        setValue(text);
                    }}
                />
            </View>
            <Button
                disabled={false}
                onPress={handlePress}
                title="Go"
            />
        </View>
    );
};

export default Settings;
