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
// store
const store = configureStore({
  reducer: {
    auth: persistedAuthReducer, //auth user
    users: usersReducer, // for all users data
    blogs: blogReducer, // blog related users
  },
});

export const persistor = persistStore(store);
export default store;
