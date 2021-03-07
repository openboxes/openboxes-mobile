import {createAction} from "@reduxjs/toolkit";

export const loginAction = createAction("Login");
export const showFullScreenLoadingIndicatorAction = createAction("ShowFullScreenLoadingIndicator");
export const hideFullScreenLoadingIndicatorAction = createAction("HideFullScreenLoadingIndicator");
export const logoutAction = createAction("Logout");
