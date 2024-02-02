import { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';


const AppRoutes = ({ auth }) => {
  // const location = useLocation()
  // useEffect(() => {
  //   console.log("🚀 ~ useEffect ~ location.pathname:", location.pathname)
  // },[])

  return auth.token === false ? <Outlet /> : <Navigate to="/quest/post/tUAiAnKP" />;
  // return auth.token === false ? <Outlet /> : <Navigate to={location.pathname} />;
};

export default AppRoutes;


// import { useLocation, Navigate, Outlet } from "react-router-dom";
// import useAuth from "../hooks/useAuth";

// const RequireAuth = ({ allowedRoles }) => {
//     const { auth } = useAuth();
//     const location = useLocation();

//     return (
//         auth?.roles?.find(role => allowedRoles?.includes(role))
//             ? <Outlet />
//             : auth?.user
//                 ? <Navigate to="/unauthorized" state={{ from: location }} replace />
//                 : <Navigate to="/login" state={{ from: location }} replace />
//     );
// }

// export default RequireAuth;