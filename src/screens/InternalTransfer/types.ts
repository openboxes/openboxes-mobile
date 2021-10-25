import Location from "../../data/location/Location";
import {Dictionary} from "lodash";

export interface OwnProps {
    navigation: any;
}

export interface StateProps {
    //no-op
}

export interface DispatchProps {
    getLocationsAction: (callback: (locations: any) => void) => void;
    setCurrentLocationAction: (
        location: Location,
        callback: (data: any) => void,
    ) => void;
    showScreenLoading: (message?: string) => void;
    hideScreenLoading: () => void;
}

export type Props = OwnProps & StateProps & DispatchProps;

export interface State {
    orgNameAndLocationsDictionary: Dictionary<Location[]>;
}
