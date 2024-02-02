import { useLocation, Navigate, Outlet } from "react-router-dom";
// import useAuth from "../hooks/useAuth";

const RequireAuth = ({ auth }) => {
    // const persistedUser = auth;
    const location = useLocation();

    return (
        auth?.isGuestMode
            ? <Navigate to={location.pathname} state={{ from: location }} replace />
            : <Outlet />
            // : auth?.user

                // ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                // : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;