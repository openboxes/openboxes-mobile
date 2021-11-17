import Product from "../../data/product/Product";
import {printLabelAction} from "../../redux/actions/products";

export interface OwnProps {
    visible: boolean
    closeModal: ()=> void,
    product: any
    type:string
}

export interface StateProps {
    defaultBarcodeLabelUrl: any,
    printModalVisible: boolean
}

export interface DispatchProps {
    printLabelAction: (
        data: any,
        callback?: (data: any) => void,
    )=> void
}

export type Props = OwnProps & StateProps & DispatchProps;
