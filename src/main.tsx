// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { Provider } from 'react-redux';
import { store } from './store/store';

// read persisted user id at bootstrap so services can use it synchronously
try {
  (window as any).investorPhoneLookup = (window as any).investorPhoneLookup || {};
  (window as any).investorEmailLookup = (window as any).investorEmailLookup || {};
  const persisted = localStorage.getItem("currentUserId");
  if (persisted) {
    (window as any).currentUserId = persisted;
  } else {
    // DEV-only fallback — remove/replace for production
    (window as any).currentUserId = (window as any).currentUserId || null;
  }
} catch (e) {
  // ignore storage read errors
  (window as any).currentUserId = (window as any).currentUserId || null;
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
