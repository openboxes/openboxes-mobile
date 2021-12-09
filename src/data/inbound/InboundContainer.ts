import ShipmentItems from "./ShipmentItems";

export default interface InboundContainer {
    "container.id": string,
    "container.name": string,
    "parentContainer.id": string | null,
    "parentContainer.name": string | null,
    "container.type": string,
    shipmentItems: ShipmentItems[]
}