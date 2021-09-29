import Person from "./Person";
import Requisition from "./Requisition";
import Item from "./Item";

export default interface PickList{
  id: string,
  name: string,
  description: string,
  picker: Person,
  datePicked: Date,
  requisition: Requisition
  picklistItems: Item[]
}
