import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Unauthorized from "../components/UnAuthorized";
import { RootState } from "../store/store";

const PUBLIC_ROUTES = ["/login"];

const ProtectedRoutes: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const { isAuthenticated, userInfo, isLoading } = useSelector(
    (state: RootState) => state.auth,
  );

  const isPublic = PUBLIC_ROUTES.includes(currentPath);

  // ⏳ Block protected routes while loading
  if (isLoading && !isPublic) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  const allowedRoutes: string[] = (userInfo as any)?.allowed_routes ?? [];

  const isAllowed = allowedRoutes.some((route) =>
    currentPath.startsWith(route),
  );

  // 🔐 Not logged in
  if (!isAuthenticated && !isPublic) {
    return <Navigate to="/login" replace />;
  }

  // ⛔ Logged in but unauthorized
  if (isAuthenticated && !isPublic && !isAllowed) {
    return <Unauthorized />;
  }

  return children;
};

export default ProtectedRoutes;
