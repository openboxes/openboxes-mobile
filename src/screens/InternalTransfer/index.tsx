import React, {useEffect, useRef, useState} from 'react';
import {connect, useDispatch} from 'react-redux';
import styles from './styles';
import Location from '../../data/location/Location';
import _, {Dictionary} from 'lodash';
import {ScrollView, View, TouchableOpacity, Text, TextInput, Image} from 'react-native';
import Header from '../../components/Header';
import {List} from 'react-native-paper';
import {Props, State, DispatchProps} from  './types'
import showPopup from '../../components/Popup';
import InputBox from '../../components/InputBox';
import {showScreenLoading, hideScreenLoading} from '../../redux/actions/main';
import useEventListener from "../../hooks/useEventListener";
import {useNavigation} from "@react-navigation/native";
import {searchProductGloballyAction} from "../../redux/actions/products";
import Button from "../../components/Button";


const InternalTransfer=()=> {
  const barcodeData = useEventListener();
  const productCode = useRef();
  const binLocation = useRef();
  const dispatch = useDispatch();
  const [state,setState] = useState<any>({
    productCode :"",
    binLocation:"",
    from:"",
    quantity:"",
    error: null,
    searchProductCode: null,
  })


  useEffect(() => {
    console.log("SCAN barcodeData Return", barcodeData);
    if (barcodeData && Object.keys(barcodeData).length !== 0) {
      onBarCodeScanned(barcodeData.data)
    }
  },[barcodeData])


  const onBarCodeScanned = (query: string) => {
    // handleBarcodeScan(barcodeNo);
      if (!query) {
        showPopup({
          message: 'Search query is empty',
          positiveButton: {text: 'Ok'},
        });
        return;
      }
    console.log("query", query.includes("LOG-XXX"))
    if(query.includes("LOG-XXX")) {
      console.log("query", query)
      const actionCallback = (data: any) => {
        if (data?.error) {
          showPopup({
            title: data.error.message
                ? `Failed to load search results with value = "${query}"`
                : null,
            message:
                data.error.message ??
                `Failed to load search results with value = "${query}"`,
            positiveButton: {
              text: 'Retry',
              callback: () => {
                dispatch(searchProductGloballyAction(query, actionCallback));
              },
            },
            negativeButtonText: 'Cancel',
          });
        } else {
          console.log("data", data)
          if (data.length == 0) {
            setState({
              ...state,
              searchProductCode: {
                query: query,
                results: null,
              },
              error: `No search results found for product name "${query}"`,
            });
          } else {
            setState({
              ...state,
              searchProductCode: {
                query: query,
                results: data,
              },
              error: null,
            });
            if (data && Object.keys(data).length !== 0) {
              console.log("data2", data)
              state.productCode = data.data[0].productCode;
              setState({...state})
            }
          }
          hideScreenLoading();
        }
      };
      dispatch(searchProductGloballyAction(query, actionCallback));
    }
  };

  const onChangeProduct = (text: string) => {
    setState({...state,productCode:text})
  }


    return (
      <View style={styles.container}>
        <View style={styles.from}>
          <InputBox
              refs={productCode}
              value={state.productCode}
              disabled={true}
              onChange={onChangeProduct}
              label={'Product Code'}/>
          <InputBox
              label={'From'}
              disabled={true}
              value={state.from}
          />
          <InputBox
              refs={binLocation}
              value={state.binLocation}
              disabled={true}
              label={'To'}/>
          <InputBox
              label={'Quantity to transfer'}
              value={state.quantity}
              disabled={true}
              showSelect={true}/>
        </View>
          <View style={styles.bottom}>
            <Button
                title="TRANSFER"
                // onPress={onPress}
                style={{
                  marginTop: 8,
                }}
            />
          </View>
      </View>
    );
}


export default InternalTransfer;
