import { PicklistItem } from '../../data/picklist/PicklistItem';

export interface Props {
  item: PicklistItem;
  onPickItem: (data: PicklistItem) => void;
}
