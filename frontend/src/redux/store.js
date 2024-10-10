import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./store/authSlice";
import usersReducer from "./store/usersSlice";
import blogReducer from "./store/blogsSlice";

const persistConfig = {
  key: "root",
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    users: usersReducer,
    blogs: blogReducer, // Add blog reducer
  },
});

export const persistor = persistStore(store);
export default store;
