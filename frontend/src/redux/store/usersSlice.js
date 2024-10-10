import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [], // Initial state for all users
  loading: false, // Loading state for fetching users
  error: null, // Error state in case of any issues
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    fetchUsersStart: (state) => {
      state.loading = true; // Set loading to true when starting to fetch users
    },
    fetchUsersSuccess: (state, action) => {
      state.users = action.payload; // Store the fetched users
      state.loading = false; // Turn off loading after fetching users
    },
    fetchUsersFailure: (state, action) => {
      state.error = action.payload; // Store the error message
      state.loading = false; // Turn off loading in case of error
    },
  },
});

export const { fetchUsersStart, fetchUsersSuccess, fetchUsersFailure } =
  usersSlice.actions;

export default usersSlice.reducer;
