// // import { createContext, useState, useEffect } from "react";
// // import { getProfile } from "../api/authApi";

// // export const AuthContext = createContext();

// // export const AuthProvider = ({ children }) => {
// //   const [isAuthenticated, setIsAuthenticated] = useState(false);
// //   const [loading, setLoading] = useState(true);

// //   //  MUST be inside component
// //   useEffect(() => {
// //   const checkAuth = async () => {
// //     try {
// //       await getProfile();
// //       setIsAuthenticated(true);
// //     } catch {
// //       setIsAuthenticated(false);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
// //   checkAuth();
// // }, []);


// //   const loginUser = () => {
// //     setIsAuthenticated(true);
// //   };

// //   const logoutUser = () => {
// //     setIsAuthenticated(false);
// //   };

// //   if (loading) return null; // prevents flicker

// //   return (
// //     <AuthContext.Provider value={{ isAuthenticated, loginUser, logoutUser }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };
// import { createContext, useState, useEffect } from "react";
// import { getProfile } from "../api/authApi";

// export const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         await getProfile();
//         setIsAuthenticated(true);
//       } catch {
//         setIsAuthenticated(false);
//       } finally {
//         setLoading(false);
//       }
//     };
//     checkAuth();
//   }, []);

//   const loginUser = () => setIsAuthenticated(true);
//   const logoutUser = () => setIsAuthenticated(false);

//   if (loading) return null;

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, loginUser, logoutUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }
import { createContext, useEffect, useState } from "react";
import { getProfile } from "../api/authApi";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const loginUser = async () => {
    const res = await getProfile();
    setUser(res.data);
  };

  const logoutUser = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
