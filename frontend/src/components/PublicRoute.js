import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStatus } from '../hooks/useAuthStatus';
import { Spinner } from './Spinner';

export const PublicRoute = () => {
    const { loggedIn, checkingStatus } = useAuthStatus();
    if (checkingStatus) {
        return (< Spinner />);
    }
    return loggedIn ? <Navigate to="/" /> : <Outlet />
};