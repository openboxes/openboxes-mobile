import React from 'react';
import { Image, View, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import Swiper from 'react-native-swiper';
const Close = require('../../../assets/images/close.png');
import styles from './styles';

const IMAGE_DETAILD = [
    {
        id: 1,
        url: 'https://reactnative.dev/img/tiny_logo.png'
    },
    {
        id: 2,
        url: 'https://reactnative.dev/img/tiny_logo.png'
    },
    {
        id: 3,
        url: 'https://reactnative.dev/img/tiny_logo.png'
    }
];

function ProductImageSwiper({isModalVisible, onHideModal}: any) {
 
  return (
    <Modal isVisible={isModalVisible}>
         <View style={styles.mainView}>
            <TouchableOpacity onPress={() => onHideModal()} style={styles.closeView}>
                <Image
                    style={styles.closeImage}
                    source={Close}
                />
            </TouchableOpacity>
            <View style={styles.swiperView}>
                <Swiper 
                    style={styles.wrapper} 
                    showsButtons={true}
                >
                    {
                        IMAGE_DETAILD.map(({url}, index) => (
                            <View  key={index} style={styles.procuctView}>
                                <Image
                                    style={styles.image}
                                    source={{ uri: url}}
                                />
                            </View>
                        ))
                    }
                </Swiper>
            </View>
        </View>
    </Modal>
  );
}

export default ProductImageSwiper;