import React from 'react';

export interface OwnProps {
    onRefresh: () => void
    children: React.ReactChild
}

export interface StateProps {
    refreshing: boolean
}

export interface DispatchProps {
    refreshScreenAction: ()=>void
}

export type Props = OwnProps & StateProps & DispatchProps;

export interface State {

}
