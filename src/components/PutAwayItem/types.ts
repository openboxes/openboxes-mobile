import PutAwayItems from '../../data/putaway/PutAwayItems';

export interface OwnProps {
  item: PutAwayItems;
  // onItemTapped: () => void
}

export interface StateProps {}

export interface DispatchProps {}

export type Props = OwnProps & StateProps & DispatchProps;
