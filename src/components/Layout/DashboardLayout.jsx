import React, { useState, useEffect } from "react";
import {
  FaTachometerAlt,
  FaBriefcase,
  FaUserFriends,
  FaBuilding,
  FaChartLine,
  FaCog,
  FaBoxOpen,
  FaUsers,
  FaChartBar,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaEye,
  FaEyeSlash,
  FaBars,
  FaUserCheck,
} from "react-icons/fa";
import { NavLink, Link } from "react-router-dom";
import NavAvatar from "../auth/NavAvatar";
import SearchInput from "../filters/SearchInput";
import { FaBarsStaggered } from "react-icons/fa6";

const DashboardLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Responsive behavior: Collapse on medium screens, hide on small screens
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 640) {
        setIsHidden(true);
      } else if (window.innerWidth < 768) {
        setIsCollapsed(true);
        setIsHidden(false);
      } else {
        setIsCollapsed(false);
        setIsHidden(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleHide = () => {
    setIsHidden(!isHidden);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isHidden ? "w-0" : isCollapsed ? "w-20" : "w-64"
        } bg-gray-800 text-white flex flex-col transition-all duration-300 ease-in-out`}
      >
        <div className="flex justify-between p-4 items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 p-[5px] bg-slate-100 rounded-xl w-max"
          >
            {/* Sidebar is Collapsed - Show "B" only */}
            {!isHidden && isCollapsed && (
              <span className="bg-slate-700 text-white px-3 py-1 rounded-lg text-2xl font-bold shadow-md">
                B
              </span>
            )}

            {/* Sidebar is Expanded - Show Full "BlackIn Tech" logo for large screens */}
            {!isHidden && !isCollapsed && windowWidth >= 768 && (
              <div className="flex items-center">
                <span className="bg-slate-700 text-white px-3 py-1 rounded-lg text-2xl font-bold shadow-md">
                  B
                </span>
                <span className="text-gray-900 text-2xl font-semibold border-b-2 border-slate-700 pb-[2px]">
                  lack
                  <span className="text-slate-700 text-2xl font-extrabold">
                    In
                  </span>
                  <span className="text-gray-900 text-2xl font-semibold">
                    Tech
                  </span>
                </span>
              </div>
            )}
          </Link>
        </div>
        {/* Sidebar Links */}
        {!isHidden && (
          <ul className="flex-grow flex flex-col gap-3 p-2">
            {[
              {
                to: "/dashboard",
                icon: <FaTachometerAlt />,
                label: "Dashboard",
              },
              { to: "/userportal", icon: <FaUserFriends />, label: "Users" },
              { to: "/assignbadge", icon: <FaUserCheck />, label: "AssignBadge" },
              { to: "/jobportal", icon: <FaBriefcase />, label: "Jobs" },
              { to: "/stat-reports", icon: <FaChartLine />, label: "Reports" },
              { to: "/data-settings", icon: <FaCog />, label: "Data Settings" },
              { to: "/test-dashboard", icon: <FaCog />, label: "Testing" },
            ].map(({ to, icon, label }) => (
              <li
                key={to}
                className={`flex items-center ${
                  isCollapsed ? "justify-center p-4" : "p-2"
                } rounded-lg transition-all duration-300`}
              >
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center w-full p-2 rounded-lg transition-colors duration-300 ${
                      isActive
                        ? "bg-gray-700 text-white"
                        : "text-gray-400 hover:text-white"
                    }`
                  }
                >
                  <span className={`text-lg ${isCollapsed ? "mx-auto" : ""}`}>
                    {icon}
                  </span>
                  {!isCollapsed && <span className="ml-4">{label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        )}
        <div className="p-2">
          {/* Collapse/Hide Buttons */}
          <button
            onClick={toggleCollapse}
            className={`group gap-5 trasition-all ease-in-out flex items-center justify-center w-full p-2 rounded-lg transition-all duration-300 hover:bg-gray-700 ${
              isCollapsed ? "py-4" : "py-2"
            }`}
          >
            {isCollapsed ? (
              <FaAngleDoubleRight
                className={`text-lg transition-transform duration-300 ${
                  isCollapsed ? "" : "translate-x-1"
                }`}
              />
            ) : (
              <>
                <FaAngleDoubleLeft
                  className={`text-lg transition-all duration-300 group-hover:mr-5 ${
                    isCollapsed ? "translate-x-1" : ""
                  }`}
                />
                <span
                  className={`ml-4 ${
                    isCollapsed ? "opacity-0" : "opacity-100"
                  } transition-opacity duration-300`}
                >
                  Collapse
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col min-h-screen">
        <header className=" flex items-center justify-between h-16 px-2">
          <div className="flex flex-tems-center gap-10">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              {/* Hidden Sidebar - Show "BT" for small screens */}
              {isHidden && windowWidth < 768 && (
                <div className="flex items-center gap-1">
                  <span className="bg-slate-700 text-white px-3 py-1 rounded-lg text-2xl font-bold shadow-md">
                    B
                  </span>
                  <span className="h-10 w-0.5 bg-slate-700"></span>
                  <span className="bg-slate-700 text-white px-3 py-1 rounded-lg text-2xl font-bold shadow-md">
                    T
                  </span>
                </div>
              )}
              {isHidden && windowWidth >= 768 && (
                <div className="flex items-center">
                  <span className="bg-slate-700 text-white px-3 py-1 rounded-lg text-2xl font-bold shadow-md">
                    B
                  </span>
                  <span className="text-gray-900 text-2xl font-semibold border-b-2 border-slate-700 pb-[2px]">
                    lack
                    <span className="text-slate-700 text-2xl font-extrabold">
                      In
                    </span>
                    <span className="text-gray-900 text-2xl font-semibold">
                      Tech
                    </span>
                  </span>
                </div>
              )}
            </Link>
            <SearchInput />
          </div>

          <div className="flex items-center gap-4">
            <NavAvatar />
            <div className="flex items-center size-max justify-center">
              {/* Hide/Show Sidebar Button */}
              {!isHidden && (
                <button
                  className="text-gray-700 hover:bg-gray-300 p-2 rounded-full"
                  onClick={toggleHide}
                >
                  <FaBarsStaggered className="text-lg" title="Hide Sidebar" />
                </button>
              )}
              {isHidden && (
                <button
                  className="text-gray-700 hover:bg-gray-300 p-2 rounded-full"
                  onClick={toggleHide}
                >
                  <FaBars className="text-lg" title="Show Sidebar" />
                </button>
              )}
            </div>
          </div>
        </header>
        <div className="flex-grow relative overflow-y-hidden">{children}</div>
        <footer className="bg-slate-100 py-4 w-full">
          <div className="mx-auto flex justify-between items-center px-4">
            <p className="text-sm">BlackinTech &copy; 2022</p>
            <ul className="flex gap-x-4">
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-700 hover:text-slate-900 transition-colors duration-300 ease-in-out"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-700 hover:text-slate-900 transition-colors duration-300 ease-in-out"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-700 hover:text-slate-900 transition-colors duration-300 ease-in-out"
                >
                  Terms
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-700 hover:text-slate-900 transition-colors duration-300 ease-in-out"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
