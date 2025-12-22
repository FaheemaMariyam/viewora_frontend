import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Home from "./pages/home";
import ProtectedRoute from "./auth/ProtectedRoute";

const Router = () => (
  <Routes>
    {/* Default route */}
    {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
    <Route path="/" element={<Home/>}/>

    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />

    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default Router;
