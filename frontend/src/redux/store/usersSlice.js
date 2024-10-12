import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  loading: false,
  error: null,
};
// this is the slice for manage all users data
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    fetchUsersStart: (state) => {
      state.loading = true;
    },
    fetchUsersSuccess: (state, action) => {
      state.users = action.payload;
      state.loading = false;
    },
    fetchUsersFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { fetchUsersStart, fetchUsersSuccess, fetchUsersFailure } =
  usersSlice.actions;

export default usersSlice.reducer;
