// src/App.tsx
import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import AppRoutes from "./routes/index";
import { verifySession } from "./services/authService";
import { useDispatch } from "react-redux";
import { clearAuth, setAuth } from "./store/slices/authSlice";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const sessionToken = localStorage.getItem("sessionToken");

  /* ---------------------------------------------
     SESSION VERIFY
  ---------------------------------------------- */
  useEffect(() => {
    const initSession = async () => {
      const sessionToken = localStorage.getItem("sessionToken");

      // ❌ No session token → logout
      if (!sessionToken) {
        dispatch(clearAuth());
        setLoading(false);
        navigate("/login");
        return;
      }

      try {
        // ✅ Ask backend to refresh access token
        const data = await verifySession(sessionToken);

        dispatch(
          setAuth({
            userInfo: data.userInfo,
            accessToken: data.accessToken,
            sessionToken,
          })
        );

        // optional global ref
        try {
          (window as any).currentUserId = data.userInfo?.id;
        } catch {}
      } catch (err) {
        // Session expired or invalid
        dispatch(clearAuth());
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    initSession();
  }, [dispatch, navigate]);


  /* ----------------------------------------------------
     SAFE MINIMAL MODAL FIX — DOES NOT BREAK ANY UI
  ----------------------------------------------------- */
  useEffect(() => {
    const fixZ = () => {
      const modals = document.querySelectorAll('[role="dialog"], .modal');
      modals.forEach((modal: any) => {
        modal.style.zIndex = "99999";
        modal.style.pointerEvents = "auto";
      });

      const backdrops = document.querySelectorAll(
        ".modal-backdrop, .backdrop, .overlay"
      );
      backdrops.forEach((bd: any) => {
        bd.style.zIndex = "99990";
        bd.style.pointerEvents = "auto";
      });
    };

    fixZ();

    const observer = new MutationObserver(fixZ);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);


  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex">
        {sessionToken && <Sidebar />}
        <div className="flex-1">
          <AppRoutes />
        </div>
      </div>
    </>
  );
}

export default App;