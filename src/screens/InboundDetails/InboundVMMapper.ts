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
                title: container["container.name"] ?? "",
                data: container.shipmentItems ?? []
            }
            sectionData.push(data);
        }
    return sectionData
}



export default InboundVMMapper