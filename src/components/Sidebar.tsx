// src/components/Sidebar.tsx
import React from "react";
import { TrendingUp, User } from "lucide-react";
import { configObject } from "../utils/helper";
import { NavLink, useNavigate } from "react-router-dom";
import { clearAuth } from "../store/slices/authSlice";
import { RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutHandler } from "../services/authService";

const Sidebar: React.FC<{}> = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  const logout = async () => {
    try {
      // Call backend to clear cookies + invalidate session
      await logoutHandler();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      dispatch(clearAuth());

      // Clear any leftover client storage (defensive)
      // try {
      //   localStorage.removeItem("currentUserId");
      // } catch {}

      try {
        (window as any).currentUserId = null;
      } catch {}

      // Redirect to login
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
      <div className="px-6 py-6">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="ml-3 text-xl font-semibold text-gray-900">
            InvestorCRM
          </span>
        </div>
      </div>

      <nav className="px-4 pb-4 space-y-1">
        {configObject.navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              to={item.path}
              key={item.name}
              onClick={() => {}}
              className={({ isActive }) => {
                const baseClasses =
                  "w-full group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200";
                const activeClasses =
                  "bg-blue-50 text-blue-700 border-r-2 border-blue-600";
                const inactiveClasses =
                  "text-gray-600 hover:bg-gray-50 hover:text-gray-900";

                return `${baseClasses} ${
                  isActive ? activeClasses : inactiveClasses
                }`;
              }}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`
          flex-shrink-0 mr-3 h-5 w-5 transition-colors duration-200
          ${
            isActive
              ? "text-blue-600"
              : "text-gray-400 group-hover:text-gray-500"
          }
        `}
                  />
                  {item.name}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {userInfo?.first_name} {userInfo?.last_name}
            </p>
            <p className="text-xs text-gray-500">{userInfo?.job_title}</p>
          </div>
        </div>
        <button
          className="mt-3 w-full px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
