import React from 'react';
import {FlatList, ListRenderItemInfo, Text, TouchableOpacity, View} from 'react-native';
import styles from './styles';
import {connect} from 'react-redux';
// import Icon, {Name} from '../../components/Icon'
import {DispatchProps, Props, State} from './Types';

import {RootState} from '../../redux/reducers';

const Dashboard_Data = [
    {
        screenName: "Products",
        navigationScreenName: "Products"
    },
    {
        screenName: "Picking",
        navigationScreenName: "Orders"
    },
    {
        screenName: "Receiving",
        navigationScreenName: "InboundOrderList"
    },
    {
        screenName: "Stock Transfer",
        navigationScreenName: "InternalTransfer"
    },
    {
        screenName: "Put Away",
        navigationScreenName: "PutawayList"
    },
    {
        screenName: "Scan",
        navigationScreenName: "Scan"
    },
    {
        screenName: " Create LPN",
        navigationScreenName: "CreateLpn"
    },
    {
        screenName: "Put Away Candidates",
        navigationScreenName: "PutawayCandidates"
    },
    {
        screenName: "Product Summary",
        navigationScreenName: "Product Summary"
    },
    {
        screenName: "Ready to be Packed",
        navigationScreenName: "OutboundStockList"
    }
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
                <View style={styles.countLabelAndIconContainer}>
                    {/*<Icon name={Name.ShoppingCart} size={14}/>*/}
                    <Text style={styles.countLabel}>{item.screenName}</Text>
                </View>
            </TouchableOpacity>)
    }

    render() {
        return (
            <View style={styles.screenContainer}>
                <FlatList
                    data={Dashboard_Data}
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
