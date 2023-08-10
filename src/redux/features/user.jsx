import { createSlice } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
export const userSlice = createSlice({
  name: "user",
  initialState: { value: {} },
  reducers: {
    login: (state, action) => {
      state.value = action.payload;
    },
    logout: (state) => {
      state.value = {};
      storage.removeItem("persist:store");
    },
    setToken: (state, action) => {
      state.value.token = action.payload.token;
      state.value.refreshtoken = action.payload.refreshtoken;
    },
    getToken: (state, action) => {
      return { token: state.value.token, refresh: state.value.refreshtoken };
    },
  },
});
export const { login, logout, setToken, getToken } = userSlice.actions;
export default userSlice.reducer;
