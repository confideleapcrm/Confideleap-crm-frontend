// src/App.tsx
import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import AppRoutes from "./routes/index";
import { getMe, verifySession } from "./services/authService";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth, setAuth } from "./store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { RootState } from "./store/store";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  // const sessionToken = localStorage.getItem("sessionToken");

  const { isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  /* ---------------------------------------------
     SESSION VERIFY
  ---------------------------------------------- */
  // useEffect(() => {
  //   const initSession = async () => {
  //     const sessionToken = localStorage.getItem("sessionToken");

  //     // ❌ No session token → logout
  //     if (!sessionToken) {
  //       dispatch(clearAuth());
  //       setLoading(false);
  //       navigate("/login");
  //       return;
  //     }

  //     try {
  //       // ✅ Ask backend to refresh access token
  //       const data = await verifySession();

  //       dispatch(
  //         setAuth({
  //           userInfo: data.userInfo,
  //           accessToken: data.accessToken,
  //           sessionToken,
  //         })
  //       );

  //       // optional global ref
  //       try {
  //         (window as any).currentUserId = data.userInfo?.id;
  //       } catch {}
  //     } catch (err) {
  //       // Session expired or invalid
  //       dispatch(clearAuth());
  //       navigate("/login");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   initSession();
  // }, [dispatch, navigate]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // 1. Try to get current user
        const meRes = await getMe();
        dispatch(setAuth({ userInfo: meRes.user }));
      } catch {
        try {
          // 2. If access token expired → refresh via session
          const refreshRes = await verifySession();

          dispatch(
            setAuth({
              userInfo: refreshRes.user,
            })
          );
        } catch {
          // 3. If refresh fails → logout
          dispatch(clearAuth());
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
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
        {isAuthenticated && <Sidebar />}
        <div className="flex-1">
          <AppRoutes />
        </div>
      </div>
    </>
  );
}

export default App;
