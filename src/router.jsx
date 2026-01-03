
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Home from "./pages/home";
import ProtectedRoute from "./auth/ProtectedRoute";
import PendingApproval from "./pages/pendingApproval";
import PropertyList from "./pages/properties/PropertyList";
import PropertyDetail from "./pages/properties/PropertyDetails";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ChangePassword from "./pages/auth/ChangePassword";
import BrokerDashboard from "./pages/broker/BrokerDashboard";
import RoleBasedRoute from "./auth/RoleBasedRoute";
import Chats from "./pages/chat/Chats";
import SellerDashboard from "./pages/seller/SellerDashboard";
import AddProperty from "./pages/seller/AddProperty";
import SellerPropertyDetails from "./pages/seller/SellerPropertyDetails";
import EditProperty from "./pages/seller/EditProperty";

const Router = () => (
  <Routes>
    <Route path="/" element={<Home />} />

    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />

    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />

    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      }
    />

    <Route
      path="/change-password"
      element={
        <ProtectedRoute>
          <ChangePassword />
        </ProtectedRoute>
      }
    />

    <Route path="/pending-approval" element={<PendingApproval />} />
    <Route path="/properties" element={<PropertyList />} />
    <Route path="/properties/:id" element={<PropertyDetail />} />
  <Route
  path="/broker"
  element={
    <RoleBasedRoute role="broker">
      <BrokerDashboard />
    </RoleBasedRoute>
  }
/>
<Route
  path="/chats"
  element={
    <ProtectedRoute>
      <Chats />
    </ProtectedRoute>
  }
/>
<Route
  path="/seller"
  element={
    <RoleBasedRoute role="seller">
      <SellerDashboard />
    </RoleBasedRoute>
  }
/>
<Route
  path="/seller/add-property"
  element={
    <RoleBasedRoute role="seller">
      <AddProperty />
    </RoleBasedRoute>
  }
/>
<Route
  path="/seller/properties/:id"
  element={
    <RoleBasedRoute role="seller">
      <SellerPropertyDetails />
    </RoleBasedRoute>
  }
/>
<Route
  path="/seller/edit-property/:id"
  element={
    <RoleBasedRoute role="seller">
      <EditProperty />
    </RoleBasedRoute>
  }
/>

  </Routes>
);

export default Router;
