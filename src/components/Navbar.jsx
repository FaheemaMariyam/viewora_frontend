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
    <nav className="sticky top-0 z-50">
      <div
        className="
        backdrop-blur-xl
        bg-gradient-to-r from-slate-900/75 via-indigo-950/75 to-slate-900/75
        border-b border-white/10
        shadow-[0_2px_12px_rgba(0,0,0,0.35)]
        "
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex justify-between items-center">
          {/* Brand */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div
              className="
              w-8 h-8 rounded-md
              bg-gradient-to-br from-indigo-600 to-indigo-900
              text-white flex items-center justify-center
              font-semibold text-sm
              shadow-md
              "
            >
              V
            </div>

            <span className="text-xl font-semibold tracking-tight text-white/90">
              Viewora
            </span>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {!user && (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-white/80 hover:text-white transition"
                >
                  Login
                </button>

                <button
                  onClick={() => navigate("/signup")}
                  className="
                  px-4 py-1.5 rounded-full
                  bg-gradient-to-r from-indigo-600 to-indigo-800
                  text-white font-semibold
                  hover:from-indigo-500 hover:to-indigo-900
                  transition shadow-md
                  "
                >
                  Sign Up
                </button>
              </>
            )}

            {user && (
              <>
                <button
                  onClick={() => navigate("/properties")}
                  className={
                    isActive("/properties")
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                  }
                >
                  Properties
                </button>
                <button
  onClick={() => navigate("/notifications")}
  className="relative text-white/80 hover:text-white"
>
  🔔
  {totalUnread > 0 && (
    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1 rounded-full">
      {totalUnread}
    </span>
  )}
</button>

                <button
                  // onClick={() => navigate("/chats")}
                  onClick={async () => {
  await loadUnread();   //  sync unread count
  navigate("/chats");
}}

                  className={
                    isActive("/chats") || isActive("/broker")
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                  }
                >
                  {/* Chats */}
                  <span className="relative">
                    Chats
                    {totalUnread > 0 && (
                      <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-1 rounded-full">
                        {totalUnread}
                      </span>
                    )}
                  </span>
                </button>

                <div className="px-3 py-1 rounded-full bg-white/10 text-white/90 capitalize text-xs">
                  {user.role}
                </div>

                <button
                  onClick={() => navigate("/profile")}
                  className={
                    isActive("/profile")
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                  }
                >
                  Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="text-red-300 hover:text-red-400"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white text-2xl"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden px-4 pb-4 space-y-3 text-sm">
            {!user && (
              <>
                <button
                  onClick={() => {
                    navigate("/login");
                    setOpen(false);
                  }}
                  className="block text-white/80"
                >
                  Login
                </button>

                <button
                  onClick={() => {
                    navigate("/signup");
                    setOpen(false);
                  }}
                  className="block text-indigo-400"
                >
                  Sign Up
                </button>
              </>
            )}

            {user && (
              <>
                <button
                  onClick={() => {
                    navigate("/properties");
                    setOpen(false);
                  }}
                  className="block text-white/80"
                >
                  Properties
                </button>
                <button
                  onClick={() => {
                    navigate("/chats");
                    setOpen(false);
                  }}
                  className="block text-white/80"
                >
                  {/* Chats */}
                  <span className="relative">
                    Chats
                    {totalUnread > 0 && (
                      <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-1 rounded-full">
                        {totalUnread}
                      </span>
                    )}
                  </span>
                </button>
                <button
                  onClick={() => {
                    navigate("/profile");
                    setOpen(false);
                  }}
                  className="block text-white/80"
                >
                  Profile
                </button>

                <button onClick={handleLogout} className="block text-red-400">
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
