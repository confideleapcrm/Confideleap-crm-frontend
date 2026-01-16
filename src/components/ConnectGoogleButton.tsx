// src/components/ConnectGoogleButton.tsx
import React from "react";

interface Props {
  userId?: string | null;
  className?: string;
  children?: React.ReactNode;
}

// const ConnectGoogleButton: React.FC<Props> = ({ userId = null, className = "", children }) => {
//   const handleConnect = () => {
//     // prefer window.currentUserId (set in App.tsx / main.tsx) then prop then localStorage
//     const uid =
//       (window as any).currentUserId || userId || localStorage.getItem("currentUserId") || null;

//     // Use relative URL so Vite proxy or httpClient base will route to backend.
//     const url = uid ? `/api/googleAuth/connect?userId=${encodeURIComponent(uid)}` : `/api/googleAuth/connect`;

//     // Open connect in a new tab/window (OAuth expects navigations)
//     window.open(url, "_blank", "noopener,noreferrer");
//   };

const ConnectGoogleButton: React.FC<Props> = ({ className = "", children }) => {
  const handleConnect = () => {
    // Just hit the backend OAuth route – backend identifies user from session cookie
    window.open("/api/auth/google", "_self");
  };

  return (
    <button
      type="button"
      onClick={handleConnect}
      className={`px-3 py-2 rounded border bg-white text-sm ${className}`}
      title="Connect Google account"
    >
      {children || "Connect Google"}
    </button>
  );
};

export default ConnectGoogleButton;
