import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
// import { Navigate, useLocation } from "react-router-dom";
// import { useContext } from "react";
// import { AuthContext } from "./AuthContext";

// const ProtectedRoute = ({ children }) => {
//   const { user, loading } = useContext(AuthContext);
//   const location = useLocation();

//   if (loading) return null;

//   //  Not logged in
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   // Broker should never stay on /profile
//   if (location.pathname === "/profile" && user.role === "broker") {
//     return <Navigate to="/broker" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;
