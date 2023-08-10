import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./features/user";
// import siteReducer from "./features/site";
// import editorReducer from "./features/editor";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { encryptTransform } from "redux-persist-transform-encrypt";
import thunk from "redux-thunk";

const persistConfig = {
  key: "store",
  storage,
  timeout: 500,
  transforms: [
    encryptTransform({
      secretKey: process.env.REACT_APP_KEY,
      onError: function (error) {
        // Handle the error.
      },
    }),
  ],
};

const reducer = combineReducers({
  user: userReducer,
//   site: siteReducer,
//   editor: editorReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: [thunk],
});

export const persistor = persistStore(store);
