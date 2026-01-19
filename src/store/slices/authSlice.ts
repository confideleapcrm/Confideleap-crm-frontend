// src/store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserInfo {
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
  accessToken: string | null;
  sessionToken: string | null;
}

const initialState: AuthState = {
  userInfo: null,
  accessToken: null,
  sessionToken: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // setAuth(state, action: PayloadAction<{ userInfo: UserInfo; accessToken: string; sessionToken: string }>) {
    //   state.userInfo = action.payload.userInfo;
    //   state.accessToken = action.payload.accessToken;
    //   state.sessionToken = action.payload.sessionToken;
    //   try {
    //     localStorage.setItem('accessToken', action.payload.accessToken);
    //     localStorage.setItem('sessionToken', action.payload.sessionToken);
    //     localStorage.setItem('currentUserId', String(action.payload.userInfo?.id || ''));
    //   } catch (e) {
    //     // ignore localStorage errors
    //   }
    // }
    setAuth(
      state,
      action: PayloadAction<{
        userInfo: UserInfo;
        accessToken?: string;
        sessionToken: string;
      }>
    ) {
      state.userInfo = action.payload.userInfo;

      // Store access token ONLY in memory (not persistent)
      if (action.payload.accessToken) {
        state.accessToken = action.payload.accessToken;
      }

      // Persist ONLY session token
      state.sessionToken = action.payload.sessionToken;
      try {
        localStorage.setItem("sessionToken", action.payload.sessionToken);
        localStorage.setItem("currentUserId", String(action.payload.userInfo?.id || ""));
      } catch (e) {
        // ignore storage errors
      }
    },
    clearAuth(state) {
      state.userInfo = null;
      state.accessToken = null;
      state.sessionToken = null;
      try {
        // remove only auth-related keys (do not clear everything)
        localStorage.removeItem('accessToken');
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('currentUserId');
        // clear in-memory reference if present
        try { (window as any).currentUserId = null; } catch { }
      } catch (e) {
        // ignore
      }
    },
    getAuth: (state) => state
  }
});

export const { setAuth, clearAuth, getAuth } = authSlice.actions;
export default authSlice.reducer;

