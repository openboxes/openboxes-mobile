import Person from '../picklist/Person';
import { ContainerType } from './ContainerType';
import { ContainerStatus } from './ContainerStatus';
import { ContainerShipmentItem } from './ContainerShipmentItem';

export interface Container{
    id: string,
    name: string,
    shipmentNumber: string,
    containerNumber: string,
    containerType: ContainerType,
    containerStatus: ContainerStatus,
    recipient: Person,
    sortOrder: number,
    shipmentItems: ContainerShipmentItem[]
}

export interface ContainerResponse{
    data: Container
}
