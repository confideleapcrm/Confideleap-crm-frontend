import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserInfo {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  jobTitle?: string | null;
  department?: string | null;
  avatarUrl?: string | null;
}

interface AuthState {
  userInfo: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  userInfo: null,
  isAuthenticated: false,
  isLoading: true, // useful for app bootstrap
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<{ userInfo: UserInfo }>) {
      state.userInfo = action.payload.userInfo;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    clearAuth(state) {
      state.userInfo = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setAuth, clearAuth, setLoading } = authSlice.actions;
export default authSlice.reducer;
