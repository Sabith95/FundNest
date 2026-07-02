import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { ROUTES } from "../shared/constants";
import type { Role } from "../types/auth.types";


const getDashboardPath = (role?: Role): string =>{
    if(role === 'SUPER_ADMIN') return ROUTES.SUPER_ADMIN.DASHBOARD
    if(role === 'TENANT_ADMIN') return ROUTES.TENANT.DASHBOARD
    return ROUTES.USER.DASHBOARD
}

const PublicRoute = () =>{
    const {isAuthenticated, user} = useAppSelector((state) => state.auth)

    if(isAuthenticated) {
        return <Navigate to={getDashboardPath(user?.role)} replace />
    }

    return <Outlet />
}

export default PublicRoute