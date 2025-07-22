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

//State Slices
import authReducer from "./slices/authSlice";

//API Slices
import { adminAuthApi } from "./services/adminApi";
import { cloudinaryApi } from "./services/cloudinaryApi";
import { contactApi } from "./services/contactApi";
import { photoApi } from "./services/photoApi";

// Create IndexedDB storage for redux-persist
const idbStorage = createIdbStorage("politician-site-db");

// Configure persist options for our root reducer
const persistConfig = {
  key: "root",
  version: 1,
  storage: idbStorage,
  whitelist: ["auth"], // Only persist auth state to avoid persisting API cache
};

const rootReducer = combineReducers({
  auth: authReducer,
  [adminAuthApi.reducerPath]: adminAuthApi.reducer,
  [cloudinaryApi.reducerPath]: cloudinaryApi.reducer,
  [contactApi.reducerPath]: contactApi.reducer,
  [photoApi.reducerPath]: photoApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Redux Persist middleware needs these actions to be ignored
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      adminAuthApi.middleware,
      cloudinaryApi.middleware,
      contactApi.middleware,
      photoApi.middleware
    ),
});

// Create persistor for use with PersistGate
export const persistor = persistStore(store);

// Setup listeners for automatic refetching
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
