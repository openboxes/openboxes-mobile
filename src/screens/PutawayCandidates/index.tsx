import React, {Component} from 'react';
import {Props, State} from './types'
import {FlatList, Text, TouchableOpacity} from "react-native";
import Refresh from '../../components/Refresh'
import {RootState} from "../../redux/reducers";
import {DispatchProps} from "./types";
import styles from './styles'
import {hideScreenLoading, showScreenLoading} from "../../redux/actions/main";
import {connect} from "react-redux";
import {getCandidates} from "../../redux/actions/putaways";

class PutawayCandidates extends Component <Props> {

    componentWillMount() {
        this.getScreenData()
    }

    getScreenData =()=>{
        const {SelectedLocation} = this.props
        this.props.getCandidates(SelectedLocation.id)
    }

    renderItem = (item: any) => {
        return (
            <TouchableOpacity
                style={styles.itemBox}
                onPress={() => {
                    this.props.navigation.navigate('PutawayItem', {item})
                }}
            >
                <Text>{`Product Code - ${item['product.productCode']}`}</Text>
                <Text>{`Product Name - ${item['product.name']}`}</Text>
                <Text>{`Lot Number - ${item['inventoryItem.lotNumber']}`}</Text>
                <Text>{`Exp Data - ${item['inventoryItem.expirationDate']}`}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        const {candidates} = this.props
        return (
            <Refresh onRefresh={this.getScreenData}>
                <FlatList
                    data={candidates}
                    renderItem={({item}) => this.renderItem(item)}
                    keyExtractor={(item,index) => index}
                />
            </Refresh>

        )
    }
}


const mapStateToProps = (state: RootState) => ({
    candidates: state.putawayReducer.candidates,
    SelectedLocation: state.locationsReducer.SelectedLocation,
});

const mapDispatchToProps: DispatchProps = {
    getCandidates,
    showScreenLoading,
    hideScreenLoading,
};

export default connect(mapStateToProps, mapDispatchToProps)(PutawayCandidates);