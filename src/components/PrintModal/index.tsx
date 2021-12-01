import React, {useEffect, useState} from 'react';
import {Image, Modal, Text, Pressable, View, TextInput} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import styles from './styles';
import {DispatchProps, Props} from './types';
import {printLabelAction} from '../../redux/actions/products';
import {connect} from 'react-redux';
import {RootState} from '../../redux/reducers';
import InputBox from '../InputBox';
import Button from '../../components/Button';

const arrowDown = require('../../assets/images/arrow-down.png');

// const arrowUp = require('../../assets/images/arrow-down.png')

function PrintModal(props: Props) {
    const [label, setLabel] = useState<any>("1")
    const handleClick = () => {
        const {printLabelAction, defaultBarcodeLabelUrl, product, type} = props;
        printLabelAction({
            productId: product.id,
            type: type,
            barcodeId: defaultBarcodeLabelUrl['id'],
        });
    };

    const onChangeLabel = (text: string) => {
        setLabel(text);
    };
    return (
        <Modal
            animationType="slide"
            transparent={props.printModalVisible}
            visible={props.visible}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Image
                        style={styles.image}
                        source={{uri: props?.defaultBarcodeLabelUrl?.url}}
                    />
                    <InputBox
                        value={label}
                        disabled={false}
                        editable={false}
                        onChange={onChangeLabel}
                        label={'Number of Labels'}
                    /><View style={styles.bottom}>
                        <Button
                            title={'Print Label'}
                            onPress={handleClick}/>
                    </View>
                    <Pressable style={styles.buttonClose} onPress={props.closeModal}>
                        <Text style={styles.textStyle}>X</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const mapStateToProps = (state: RootState) => ({
    printModalVisible: state.productsReducer.printModalVisible,
});

const mapDispatchToProps: DispatchProps = {
    printLabelAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(PrintModal);
