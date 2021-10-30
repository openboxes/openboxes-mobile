import InboundContainer from "./InboundContainer";

export default interface InboundDetails {
    receiptId: string | null,
    receiptStatus: string,
    shipmentId: string,
    "shipment.name": string,
    "shipment.shipmentNumber": string,
    shipmentStatus: string,
    "origin.id": string,
    "origin.name": string,
    "destination.id": string,
    "destination.name": string,
    dateShipped: string,
    dateDelivered: string,
    containers: InboundContainer[]
    requisition: string,
    description: string,
    recipient: Recipient,
}

interface Recipient {
    id: string,
    name: string,
    firstName: string,
    lastName: string,
    email: string,
    username: string
}