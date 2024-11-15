import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  isAuthenticated: boolean;
  user: null | { name: string; email: string };
}

const initialState: UserState = {
  isAuthenticated: Boolean(localStorage.getItem("authToken")),
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ name: string; email: string }>) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout(state) {
      // not implemented
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("authToken");
    },
    setAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
  },
});

export const { login, logout, setAuthenticated } = userSlice.actions;
export default userSlice.reducer;
