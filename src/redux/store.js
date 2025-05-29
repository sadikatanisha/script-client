import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { apiSlice } from "./apiSlice.js";
import cartReducer from "./cartSlice.js";
import { persistReducer, persistStore } from "redux-persist";

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", apiSlice.reducerPath, "cart"],
};

// Combine reducers
const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  cart: cartReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);

export default store;
