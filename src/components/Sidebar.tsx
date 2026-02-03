// src/components/Sidebar.tsx
import React, { useEffect, useState } from "react";
import { TrendingUp, User, Menu } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { clearAuth } from "../store/slices/authSlice";
import { RootState } from "../store/store";
import { logout as logoutHandler } from "../services/authService";
import { ROUTE_CONFIG } from "../utils/helper";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  const [collapsed, setCollapsed] = useState(false);

  // 🔁 Persist sidebar state
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) {
      setCollapsed(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  const logout = async () => {
    try {
      await logoutHandler();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      dispatch(clearAuth());
      navigate("/login", { replace: true });
    }
  };

  return (
    <div
      className={`
    ${collapsed ? "w-20" : "w-60"}
    bg-white shadow-sm border-r border-gray-200
    flex flex-col
    transition-all duration-300 ease-in-out
  `}
    >
      {/* ─── Header ───────────────────────────────────── */}
      <div className="px-4 py-6 flex items-center justify-between">
        <div className="flex items-center overflow-hidden">
          {/* Logo */}
          <div
            className={`
        w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center
        transition-all duration-300 ease-in-out
        ${
          collapsed
            ? "opacity-0 scale-75 -translate-x-2"
            : "opacity-100 scale-100 translate-x-0"
        }
      `}
          >
            <TrendingUp className="w-5 h-5 text-white" />
          </div>

          {/* Text */}
          <span
            className={`
        ml-3 text-xl font-semibold text-gray-900 whitespace-nowrap
        transition-all duration-300 ease-in-out
        ${
          collapsed
            ? "opacity-0 translate-x-4 pointer-events-none"
            : "opacity-100 translate-x-0"
        }
      `}
          >
            InvestorCRM
          </span>
        </div>

        {/* Toggle */}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* ─── Navigation ───────────────────────────────── */}
      <nav className="px-3 pb-4 space-y-1 flex-1">
        {ROUTE_CONFIG?.filter((route) =>
          userInfo?.allowed_routes?.includes(route.path),
        ).map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => {
                const base =
                  "relative group w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200";
                const active =
                  "bg-blue-50 text-blue-700 border-r-2 border-blue-600";
                const inactive =
                  "text-gray-600 hover:bg-gray-50 hover:text-gray-900";
                const align = collapsed ? "justify-center" : "";

                return `${base} ${align} ${isActive ? active : inactive}`;
              }}
            >
              {({ isActive }) => (
                <>
                  {/* Icon */}
                  <item.icon
                    className={`
          h-5 w-5 flex-shrink-0 transition-colors duration-200
          ${
            isActive
              ? "text-blue-600"
              : "text-gray-400 group-hover:text-gray-500"
          }
          ${collapsed ? "" : "mr-3"}
        `}
                  />

                  {/* Label (expanded) */}
                  {!collapsed && item.label}

                  {/* Tooltip (collapsed only) */}
                  {collapsed && (
                    <span
                      className="
            pointer-events-none absolute left-full ml-3
            whitespace-nowrap rounded-md bg-gray-900 px-2 py-1
            text-xs font-medium text-white opacity-0
            group-hover:opacity-100 transition-opacity duration-200
            z-50
          "
                    >
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ─── Footer / User Section ───────────────────── */}
      <div className="p-4 border-t border-gray-200">
        <div
          className={`flex items-center ${collapsed ? "justify-center" : ""}`}
        >
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>

          {!collapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {userInfo?.first_name} {userInfo?.last_name}
              </p>
              <p className="text-xs text-gray-500">{userInfo?.job_title}</p>
            </div>
          )}
        </div>

        <button
          onClick={logout}
          className="mt-3 w-full px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
        >
          {collapsed ? "⎋" : "Logout"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
