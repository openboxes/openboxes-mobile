import {OutboundDetailOwnProps} from "./types";
import {OutboundVM, SectionData} from "./OutboundVM";

function OutboundVMMapper(props: OutboundDetailOwnProps): OutboundVM {
    return <OutboundVM>{
        header: "Outbound stock Details",
        sectionData: getSectionData(props.containers) ?? []
    }
}

function getSectionData(containers: any[] | undefined): SectionData[] {
    let sectionData: SectionData[] = [];
    if (containers)
        for (const container of containers) {
            const data = {
                title: container.name ?? "Unpacked Items",
                data: container.shipmentItems ?? []
            }
            sectionData.push(data);
        }
    return sectionData
}


export default OutboundVMMapper