import {PickListVm} from "./PickListVm";
import {Props, State} from "./types";

export function pickListVMMapper(props: Props, state: State): PickListVm {
  return <PickListVm>{
    header: props.order?.name,
    picklistItems: props.pickListItem ? props.pickListItem : null,
    order: props.order
  }
}

