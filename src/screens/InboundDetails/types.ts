import InboundDetails from '../../data/inbound/InboundDetails';
import { InboundVM } from './InboundVM';

type InboundDetailProps = {
  data: any;
  shipmentId: any;
  shipmentData: any;
};

export interface InboundDetailOwnProps {
  inboundDetail: InboundDetails | null;
  inboundData: InboundVM | null;
}

export interface OwnProps {
  navigation: any;
  route: any;
}

export interface StateProps {
  //no-op
}

export type Props = InboundDetailOwnProps & StateProps & OwnProps;
export default InboundDetailProps;
