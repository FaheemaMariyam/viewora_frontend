// import { Routes, Route, Navigate } from "react-router-dom";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Profile from "./pages/Profile";
// import Home from "./pages/home";
// import ProtectedRoute from "./auth/ProtectedRoute";
// import PendingApproval from "./pages/pendingApproval";
// import PropertyList from "./pages/properties/PropertyList";
// import PropertyDetail from "./pages/properties/PropertyDetails";
// import ChangePassword from "./pages/auth/ChangePassword";
// import ResetPassword from "./pages/auth/ResetPassword";

// const Router = () => (
//   <Routes>
//     {/* Default route */}
//     {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
//     <Route path="/" element={<Home/>}/>

//     <Route path="/login" element={<Login />} />
//     <Route path="/signup" element={<Signup />} />

//     <Route
//       path="/profile"
//       element={
//         <ProtectedRoute>
//           <Profile />
//         </ProtectedRoute>
//       }
//     />
//     <Route path="/pending-approval" element={<PendingApproval />} />
//       <Route path="/properties" element={<PropertyList />} />
//       <Route
//   path="/properties/:id"
//   element={<PropertyDetail />}
// />
// {/* <Route path="/forgot-password" element={<ForgotPassword />} />
// <Route path="/change-password" element={<ResetPassword />} /> */}
// <Route path="/forgot-password" element={<ForgotPassword />} />
// <Route path="/reset-password" element={<ResetPassword />} />

// <Route
//   path="/change-password"
//   element={
//     <ProtectedRoute>
//       <ChangePassword />
//     </ProtectedRoute>
//   }
// />

//   </Routes>
// );

// export default Router;
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
  </Routes>
);

export default Router;
