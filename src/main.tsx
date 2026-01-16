// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { getMe, verifySession } from "./services/authService.ts";
import { clearAuth, setAuth } from "./store/slices/authSlice.ts";

// read persisted user id at bootstrap so services can use it synchronously
try {
  const me = await getMe();
  store.dispatch(setAuth({ userInfo: me.user }));
  (window as any).currentUserId = me.user.id;
} catch {
  try {
    const refreshed = await verifySession();
    store.dispatch(setAuth({ userInfo: refreshed.user }));
    (window as any).currentUserId = refreshed.user.id;
  } catch {
    store.dispatch(clearAuth());
    (window as any).currentUserId = null;
  }
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
