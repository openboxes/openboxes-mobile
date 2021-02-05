import {createAction} from "@reduxjs/toolkit";

export const loginAction = createAction("Login");
export const showProgressDialogAction = createAction("ShowProgressDialog");
export const hideProgressDialogAction = createAction("HideProgressDialog");
export const logoutAction = createAction("Logout");
