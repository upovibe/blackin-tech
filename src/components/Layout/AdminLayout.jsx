import React, { useState, useEffect } from "react";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaUsers,
  FaChartBar,
  FaCog,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false); // Handles sidebar collapse
  const [isHidden, setIsHidden] = useState(false); // Handles full sidebar hide
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Track window width

  // Responsive behavior: Collapse on medium screens, hide on small screens
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 640) {
        setIsHidden(true); // Hide sidebar on small screens
      } else if (window.innerWidth < 768) {
        setIsCollapsed(true); // Collapse sidebar on medium screens
        setIsHidden(false); // Ensure it's not fully hidden
      } else {
        setIsCollapsed(false); // Full sidebar on larger screens
        setIsHidden(false); // Show sidebar on larger screens
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check on mount

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
            {/* Sidebar is Hidden - Show "BT" for small screens */}
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
                to: "/AdminLayout",
                icon: <FaTachometerAlt />,
                label: "AdminLayout",
              },
              { to: "/products", icon: <FaBoxOpen />, label: "Products" },
              { to: "/customers", icon: <FaUsers />, label: "Customers" },
              { to: "/reports", icon: <FaChartBar />, label: "Reports" },
              { to: "/settings", icon: <FaCog />, label: "Settings" },
            ].map(({ to, icon, label }) => (
              <li
                key={to}
                className={`flex items-center ${
                  isCollapsed ? "justify-center p-4" : "p-2"
                } rounded-lg transition-all duration-300 hover:bg-gray-600`}
              >
                <Link to={to} className="flex items-center w-full">
                  <span className={`text-lg ${isCollapsed ? "mx-auto" : ""}`}>
                    {icon}
                  </span>
                  {!isCollapsed && <span className="ml-4">{label}</span>}
                </Link>
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
      <div className="flex-grow">
        <header className="bg-white shadow-md flex items-center justify-between h-16 px-2">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
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

          <div className="flex items-center size-max justify-center">
            {/* Hide/Show Sidebar Button */}
            {!isHidden && (
              <button
                className="text-gray-700 hover:bg-gray-300 p-2 rounded-full"
                onClick={toggleHide}
              >
                <FaEyeSlash className="text-lg" title="Hide Sidebar" />
              </button>
            )}
            {isHidden && (
              <button
                className="text-gray-700 hover:bg-gray-300 p-2 rounded-full"
                onClick={toggleHide}
              >
                <FaEye className="text-lg" title="Show Sidebar" />
              </button>
            )}
          </div>
        </header>
        <div className="flex-grow relative overflow-y-auto">         
        {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
