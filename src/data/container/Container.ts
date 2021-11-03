import Person from "../picklist/Person";
import ShipmentItems from "../inbound/ShipmentItems";
import {ContainerType} from "./ContainerType";
import {ContainerShipmentItem} from "./ContainerShipmentItem";

export interface Container{
    "id": string,
    "name": string,
    "containerNumber": null,
    "containerType":ContainerType,
    "recipient": Person,
    "sortOrder": number,
    shipmentItems: ContainerShipmentItem[]
}

export interface ContainerResponse{
    data: Container
}
