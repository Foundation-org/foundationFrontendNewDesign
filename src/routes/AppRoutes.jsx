import { Outlet, Navigate } from "react-router-dom";

const AppRoutes = ({ auth }) => {
  return auth.token === false ? <Outlet /> : <Navigate to="/dashboard" />;
};

export default AppRoutes;
