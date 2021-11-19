import React from 'react';
import {FlatList, Image, ListRenderItemInfo, Text, TouchableOpacity, View} from 'react-native';
import styles from './styles';
import {connect} from 'react-redux';
import {DispatchProps, Props, State} from './Types';

import {RootState} from '../../redux/reducers';
import {Card} from "react-native-paper";

const Dashboard_Data = [
    {
        screenName: "Picking",
        icon: require("../../assets/images/picking.png"),
        navigationScreenName: "Orders"
    },
    {
        screenName: "Packing",
        icon: require("../../assets/images/packing.png"),
        navigationScreenName: "OutboundStockList"
    },
    {
        screenName: "Loading",
        icon: require("../../assets/images/loading.png"),
        navigationScreenName: "PutawayCandidates"
    },
    {
        screenName: "Transfer",
        icon: require("../../assets/images/transfer.png"),
        navigationScreenName: "InternalTransfer"
    },
    {
        screenName: "Inventory",
        icon: require("../../assets/images/inventory.png"),
        navigationScreenName: "Product Summary"
    },
    {
        screenName: "Lookup",
        icon: require("../../assets/images/lookup.png"),
        navigationScreenName: "CreateLpn"
    },
    {
        screenName: "Receiving",
        icon: require("../../assets/images/receiving.png"),
        navigationScreenName: "InboundOrderList"
    },
    {
        screenName: "Put Away",
        icon: require("../../assets/images/putaway.png"),
        navigationScreenName: "PutawayList"
    },
    {
        screenName: "Scan",
        icon: require("../../assets/images/scan.jpg"),
        navigationScreenName: "Scan"
    },

    {
        screenName: "Product",
        icon: require("../../assets/images/product.png"),
        navigationScreenName: "Products"
    },
    {
        screenName: "Put Away Candidates",
        icon: require("../../assets/images/putaway.png"),
        navigationScreenName: "PutawayCandidates"
    },
]

class Dashboard extends React.Component<Props, State> {

    renderItem = (item: any, index: any) => {
        console.log(item)
        return (
            <TouchableOpacity
                key={index}
                style={styles.countContainer}
                onPress={() => {
                    this.props.navigation.navigate(item.navigationScreenName);
                }}>
                <Card style={styles.card}>
                    <Image style={styles.cardImage} source={item.icon}/>
                    <Text style={styles.countLabel}>{item.screenName}</Text>
                </Card>
            </TouchableOpacity>)
    }

    render() {
        return (
            <View style={styles.screenContainer}>
                <FlatList
                    data={Dashboard_Data}
                    horizontal={false}
                    numColumns={3}
                    renderItem={(item: ListRenderItemInfo<any>) => this.renderItem(item.item, item.index)}
                />
            </View>
        )
            ;
    }
}

const mapStateToProps = (state: RootState) => ({
    //no-op
});

const mapDispatchToProps: DispatchProps = {
    //no-op
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
