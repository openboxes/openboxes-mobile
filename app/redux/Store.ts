import {configureStore} from "@reduxjs/toolkit";
import RootReducer from "./Reducer";

const store = configureStore({
  reducer: RootReducer
})

export default store;
export type AppDispatch = typeof store.dispatch;
