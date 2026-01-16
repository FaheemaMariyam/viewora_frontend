import { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import { logout } from "../api/authApi";
import axiosInstance from "../utils/axiosInstance";

import { setupNotifications } from "../firebase/notification";

export default function Navbar() {
  // const { user, loading, logoutUser } = useContext(AuthContext);
  const { user, loading, logoutUser, totalUnread, loadUnread } =
    useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  if (loading) return null;

  const handleLogout = async () => {
    await logout();
    logoutUser();
    navigate("/");
    setOpen(false);
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="sticky top-0 z-50 bg-brand-primary border-b border-gray-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex justify-between items-center">
        {/* Brand */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-8 h-8 flex items-center justify-center bg-white text-brand-primary font-bold text-lg rounded-md shadow-sm">
            V
          </div>

          <span className="text-xl font-bold text-white tracking-tight">
            Viewora
          </span>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {!user && (
            <>
              <button
                onClick={() => navigate("/login")}
                className="text-gray-300 hover:text-white transition"
              >
                Log In
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="px-4 py-2 bg-white text-brand-primary font-semibold rounded-md hover:bg-gray-100 transition shadow-sm"
              >
                Sign Up
              </button>
            </>
          )}

          {user && (
            <>
              <button
                onClick={() => navigate("/properties")}
                className={isActive("/properties") ? "text-white font-semibold" : "text-gray-300 hover:text-white transition"}
              >
                Properties
              </button>
              
              <button
                onClick={() => navigate("/notifications")}
                className="relative text-gray-300 hover:text-white transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                {totalUnread > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {totalUnread}
                  </span>
                )}
              </button>

              <button
                onClick={async () => {
                  await loadUnread();
                  navigate("/chats");
                }}
                className={isActive("/chats") ? "text-white font-semibold" : "text-gray-300 hover:text-white transition"}
              >
                <span className="relative">
                  Chats
                  {totalUnread > 0 && (
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      {totalUnread}
                    </span>
                  )}
                </span>
              </button>

              <div className="px-3 py-1 bg-white/10 rounded-full text-white text-xs capitalize">
                {user.role}
              </div>

              <button
                onClick={() => navigate("/profile")}
                className={isActive("/profile") ? "text-white font-semibold" : "text-gray-300 hover:text-white transition"}
              >
                Profile
              </button>

              <button
                onClick={handleLogout}
                className="text-red-300 hover:text-red-200 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-brand-primary px-4 py-4 space-y-3 text-sm text-white border-t border-gray-700">
          {!user && (
            <>
              <button onClick={() => { navigate("/login"); setOpen(false); }} className="block w-full text-left py-2 border-b border-gray-600">
                Log In
              </button>
              <button onClick={() => { navigate("/signup"); setOpen(false); }} className="block w-full text-left py-2 font-bold text-blue-200">
                Sign Up
              </button>
            </>
          )}
          {user && (
            <>
              <button onClick={() => { navigate("/properties"); setOpen(false); }} className="block w-full text-left py-2">Properties</button>
              <button onClick={() => { navigate("/chats"); setOpen(false); }} className="block w-full text-left py-2">Chats</button>
              <button onClick={() => { navigate("/profile"); setOpen(false); }} className="block w-full text-left py-2">Profile</button>
              <button onClick={handleLogout} className="block w-full text-left py-2 text-red-300">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
