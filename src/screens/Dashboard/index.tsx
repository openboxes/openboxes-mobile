import React from 'react';
import {FlatList, Image, ListRenderItemInfo, Text, TouchableOpacity, View} from 'react-native';
import styles from './styles';
import {connect} from 'react-redux';
import {DispatchProps, Props, State} from './Types';
import {RootState} from '../../redux/reducers';
import {Card} from "react-native-paper";
import dashboardData from "./dashboardData";



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
                    data={dashboardData}
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
