import {PickListVm} from "./PickListVm";
import {Props, State} from "./types";

export function pickListVMMapper(props: any): PickListVm {
  return <PickListVm>{
    header: props.order?.name,
    picklistItems: props.pickListItem ? props.pickListItem : null,
    order: props.order,
    selectedPinkItemIndex: props.selectedPinkItemIndex ? props.selectedPinkItemIndex : null,
  }
}

