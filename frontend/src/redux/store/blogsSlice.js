import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  blogs: [],
  loading: false,
  error: null,
};
// this is the silice for blog realted datas
const blogsSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    fetchBlogsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBlogsSuccess: (state, action) => {
      state.blogs = action.payload;
      state.loading = false;
    },
    fetchBlogsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchBlogsStart, fetchBlogsSuccess, fetchBlogsFailure } =
  blogsSlice.actions;

export default blogsSlice.reducer;
