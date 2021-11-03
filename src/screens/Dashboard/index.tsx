import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Header from '../../components/Header';
import styles from './styles';
// import Header from '../../components/Header';
import {connect} from 'react-redux';
// import Icon, {Name} from '../../Icon';
import {DispatchProps, Props, State} from './Types';

import {RootState} from '../../redux/reducers';

class Dashboard extends React.Component<Props, State> {
    render() {
        return (
            <View style={styles.screenContainer}>
                <TouchableOpacity
                    style={styles.countContainer}
                    onPress={() => {
                        this.props.navigation.navigate('Products');
                    }}>
                    <View style={styles.countLabelAndIconContainer}>
                        {/*<Icon name={Name.Boxes} size={14} />*/}
                        <Text style={styles.countLabel}>Products</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.countContainer}
                    onPress={() => {
                        this.props.navigation.navigate('Orders');
                    }}>
                    <View style={styles.countLabelAndIconContainer}>
                        {/*<Icon name={Name.Boxes} size={14} />*/}
                        <Text style={styles.countLabel}>Picking</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.countContainer}
                    onPress={() => {
                        this.props.navigation.navigate('InboundOrderList');
                    }}>
                    <View style={styles.countLabelAndIconContainer}>
                        <Text style={styles.countLabel}>Receiving</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.countContainer}
                    onPress={() => {
                        this.props.navigation.navigate('InternalTransfer');
                    }}>
                    <View style={styles.countLabelAndIconContainer}>
                        <Text style={styles.countLabel}>Stock Transfer</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.countContainer}
                    onPress={() => {
                        this.props.navigation.navigate('PutawayList');
                    }}>
                    <View style={styles.countLabelAndIconContainer}>
                        <Text style={styles.countLabel}>Putaways</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.countContainer}
                    onPress={() => {
                        this.props.navigation.navigate('Scan');
                    }}>
                    <View style={styles.countLabelAndIconContainer}>
                        <Text style={styles.countLabel}>Scan</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.countContainer}
                    onPress={() => {
                        this.props.navigation.navigate('CreateLpn');
                    }}>
                    <View style={styles.countLabelAndIconContainer}>
                        <Text style={styles.countLabel}>Create LPN</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.countContainer}
                    onPress={() => {
                        this.props.navigation.navigate('CreateLpn');
                    }}>
                    <View style={styles.countLabelAndIconContainer}>
                        <Text style={styles.countLabel}>Internal Transfer</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.countContainer}
                    onPress={() => {
                        this.props.navigation.navigate('PutawayCandidates');
                    }}>
                    <View style={styles.countLabelAndIconContainer}>
                        <Text style={styles.countLabel}>Putaway Candidates</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.countContainer}
                    onPress={() => {
                        this.props.navigation.navigate('Packing');
                    }}>
                    <View style={styles.countLabelAndIconContainer}>
                        <Text style={styles.countLabel}>Packing</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const mapStateToProps = (state: RootState) => (
    {
        //no-op
    }
);

const mapDispatchToProps: DispatchProps =
    {
        //no-op
    }
;

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
