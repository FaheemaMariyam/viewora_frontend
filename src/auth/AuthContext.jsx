// import { createContext, useContext, useEffect, useState } from "react";
// import { getProfile } from "../api/authApi";

// export const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         const res = await getProfile();
//         setUser(res.data);
//       } catch {
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadUser();
//   }, []);

//   const loginUser = async () => {
//     try {
//       const res = await getProfile();
//       setUser(res.data);
//     } catch {
//       setUser(null);
//     }
//   };

//   const logoutUser = () => setUser(null);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         isAuthenticated: !!user,
//         loginUser,
//         logoutUser,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }
import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../api/authApi";
import axiosInstance from "../utils/axiosInstance";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔔 GLOBAL unread count
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await getProfile();
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // 🔔 Load unread count (used by Navbar)
  const loadUnread = async () => {
    if (!user) return;

    try {
      const url =
        user.role === "broker"
          ? "/api/interests/broker/interests/"
          : "/api/interests/client/interests/";

      const res = await axiosInstance.get(url);

      const count = res.data.reduce(
        (sum, i) => sum + (i.unread_count || 0),
        0
      );

      setTotalUnread(count);
    } catch {
      setTotalUnread(0);
    }
  };

  const loginUser = async () => {
    try {
      const res = await getProfile();
      setUser(res.data);
      await loadUnread();
    } catch {
      setUser(null);
    }
  };

  const logoutUser = () => {
    setUser(null);
    setTotalUnread(0);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        loginUser,
        logoutUser,
        totalUnread,
        setTotalUnread,
        loadUnread,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
