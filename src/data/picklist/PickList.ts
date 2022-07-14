import Person from './Person';
import Requisition from './Requisition';
import { PicklistItem } from './PicklistItem';

interface PickList {
  id: string;
  name: string;
  description: string;
  picker: Person;
  datePicked: Date;
  requisition: Requisition;
  picklistItems: PicklistItem[];
}

export default PickList;
