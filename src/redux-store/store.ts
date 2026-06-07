import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import createIdbStorage from "redux-persist-indexeddb-storage";

import authReducer from "./slices/authSlice";
import { apiSlice } from "./services/apiSlice";

// Side-effect imports: each injectEndpoints call runs at module import time.
// Required so endpoints are registered before any hook is called.
import "./services/adminApi";
import "./services/categoryApi";
import "./services/cloudinaryApi";
import "./services/contactApi";
import "./services/photoApi";
import "./services/pressApi";
import "./services/videoApi";
import "./services/visitorApi";
import "./services/editorApi";

const idbStorage = createIdbStorage("biswajit-db");

const persistConfig = {
  key: "root",
  version: 1,
  storage: idbStorage,
  whitelist: ["auth"],
  blacklist: [apiSlice.reducerPath],
};

const rootReducer = combineReducers({
  auth: authReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware as any),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
