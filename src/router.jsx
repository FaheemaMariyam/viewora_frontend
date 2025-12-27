import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Home from "./pages/home";
import ProtectedRoute from "./auth/ProtectedRoute";
import PendingApproval from "./pages/pendingApproval";
import PropertyList from "./pages/properties/PropertyList";
import PropertyDetail from "./pages/properties/PropertyDetails";


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
    <Route path="/pending-approval" element={<PendingApproval />} />
      <Route path="/properties" element={<PropertyList />} />
      <Route
  path="/properties/:id"
  element={<PropertyDetail />}
/>
  </Routes>
);

export default Router;
