import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import {
  FaBars,
  FaTimes,
  FaUserCircle,
  FaLaptop,
  FaBox,
  FaSearch,
  FaUsers,
  FaListAlt,
} from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";

export default function SidebarLayout() {
  const { user, logout } = useContext(AuthContext);

  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef();

  const isAdmin = user?.role === "ADMIN"; // <<< ROLE CHECK

  useEffect(() => {
    const handler = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ==========================
  // ROLE-BASED NAV LINKS
  // ==========================
  const adminLinks = [
    {
      id: 1,
      label: "Admin Dashboard",
      icon: <MdSpaceDashboard />,
      path: "/admin/dashboard",
    },
    {
      id: 2,
      label: "Manage Users",
      icon: <FaUsers />,
      path: "/admin/users",
    },
  ];

  const userLinks = [
    { id: 1, label: "Dashboard", icon: <MdSpaceDashboard />, path: "/dashboard" },
    { id: 2, label: "Explore", icon: <FaSearch />, path: "/explore" },
    { id: 3, label: "Manage Items", icon: <FaBox />, path: "/product" },
    { id: 4, label: "Manage Categories", icon: <FaListAlt />, path: "/category" },
    { id: 5, label: "Order History", icon: <FaListAlt />, path: "/order-history" },
     { id: 6, label: "Sale Report", icon: <FaUsers />, path: "/report" },
  ];

  const navLinks = isAdmin ? adminLinks : userLinks;

  return (
    <div className="flex h-screen poppins bg-[#f4f5f7] overflow-hidden">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white/70 backdrop-blur-xl shadow-md p-4 flex items-center justify-between z-40">
        <FaBars className="text-2xl text-green-700" onClick={() => setOpen(true)} />
        <span className="font-semibold text-green-700">
          {user?.shopname?.toUpperCase()}
        </span>
      </div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`
          fixed md:static top-0 left-0
          h-screen overflow-y-auto
          bg-white/70 backdrop-blur-xl border-r border-gray-200
          shadow-[4px_0_20px_rgba(0,0,0,0.07)]
          flex flex-col justify-between
          transition-all duration-300 z-50

          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${collapsed ? "md:w-20 w-64" : "w-64"}
        `}
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
            <div className="flex items-center gap-3">
              <FaLaptop className="text-green-600 text-2xl" />
              {!collapsed && (
                <span className="font-bold text-xl tracking-wide text-gray-800">
                  {user?.shopname?.toUpperCase()}
                </span>
              )}
            </div>

            <button
              className="hidden md:block text-gray-600 hover:text-green-700 transition"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? "›" : "‹"}
            </button>

            <FaTimes
              className="md:hidden text-2xl text-gray-700 cursor-pointer"
              onClick={() => setOpen(false)}
            />
          </div>

          {/* User Info */}
          {!collapsed && (
            <div className="p-4 flex items-center gap-3 bg-white/60 border-b border-gray-200/50">
              <FaUserCircle className="text-4xl text-green-600" />
              <div className="max-w-[150px]">
                <p className="font-semibold text-gray-800 truncate">
                  {user?.shopname}
                </p>
                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-3 flex flex-col gap-1 px-2">
            {navLinks.map((nav) => {
              const active = location.pathname === nav.path;

              return (
                <Link
                  key={nav.id}
                  to={nav.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${
                      active
                        ? "bg-green-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                    }
                  `}
                  onClick={() => setOpen(false)}
                >
                  <span className="text-lg">{nav.icon}</span>
                  {!collapsed && <span>{nav.label}</span>}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Logout */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
          >
            <FaTimes /> {!collapsed && "Logout"}
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto h-screen mt-14 md:mt-0">
        <Outlet />
      </main>
    </div>
  );
}
