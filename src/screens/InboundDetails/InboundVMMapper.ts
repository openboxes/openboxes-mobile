import _ from 'lodash';
import {InboundDetailOwnProps, Props} from "./types";
import {InboundVM, SectionData} from "./InboundVM";
import InboundContainer from "../../data/inbound/InboundContainer";

function InboundVMMapper(props: InboundDetailOwnProps): InboundVM {
    return <InboundVM>{
        header: "Inbound Order Details",
        shipmentId: props.inboundDetail?.shipmentId ?? "",
        sectionData: getSectionData(props.inboundDetail?.containers) ?? []
    }
}

function getSectionData(containers: InboundContainer[] | undefined): SectionData[] {
    let sectionData: SectionData[] = [];
    if (containers)
        for (const container of containers) {
            const data = {
                title: container["container.name"] ?? "Unpacked Items",
                data: container.shipmentItems ?? []
            }
            sectionData.push(data);
        }
    return sectionData
}

export function containerParamMapper(paramContainers: any[]) {
    if(_.isEmpty(paramContainers)) {
        return [];
    }
    return paramContainers.map((container) => ({
        'container.id': _.get(container, 'id'),
        'container.name': _.get(container, 'name'),
        'container.type': _.get(container, 'type'),
        'container.status': _.get(container, 'status'),
        shipmentItems: _.get(container, 'shipmentItems').map((item: any) => ({
            quantityShipped: _.get(item, 'quantity'),
            quantityReceived: _.get(item, 'quantityReceived'),
            quantityRemaining: _.get(item, 'quantityRemaining'),
            'recipient.id': _.get(item, 'recipient.id'),
            'recipient.name': _.get(item, 'recipient.name'),
            'product.id': _.get(item, 'inventoryItem.product.id'),
            'product.name': _.get(item, 'inventoryItem.product.name'),
            'product.productCode': _.get(item, 'inventoryItem.product.productCode'),
        }))
    }))

}



export default InboundVMMapper
