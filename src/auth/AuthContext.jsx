import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../api/authApi";

// ✅ export context
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const accessToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("access="))
    ?.split("=")[1];

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

  const logoutUser = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        accessToken,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
