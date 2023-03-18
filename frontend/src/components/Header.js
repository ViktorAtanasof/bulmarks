import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

import logo from '../assets/logo/logo.png';

export const Header = () => {
    const [pageState, setPageState] = useState('Sign in');
    const location = useLocation();
    const auth = getAuth();
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if(user) {
                setPageState('Profile');
            } else {
                setPageState('Sign in');
            }
        });
    }, [auth])

    const pathMatchRoute = (route) => {
        if (route === location.pathname) {
            return true;
        };
    };

    return (
        <div className="bg-blue-50 border-b shadow-sm sticky top-0 z-40">
            <header className="flex justify-between items-center px-3 max-w-6xl mx-auto">
                <div>
                    <Link to={"/"}>
                        <img src={logo} alt="logo" className="h-12 cursor-pointer" />
                    </Link>
                </div>
                <nav>
                    <ul className="flex space-x-10">
                        <Link to="/">
                            <li className={`
                            cursor-pointer
                            py-3 
                            text-sm 
                            font-semibold
                            text-slate-800 
                            border-b-[3px] 
                            border-b-transparent 
                            ${pathMatchRoute("/") && "font-bold border-b-green-600"}`}
                            >
                                Home
                            </li>
                        </Link>
                        <Link to="/landmarks">
                            <li className={`
                            cursor-pointer
                            py-3 
                            text-sm 
                            font-semibold
                          text-slate-800 
                            border-b-[3px] 
                            border-b-transparent 
                            ${pathMatchRoute("/landmarks") && "font-bold border-b-green-600"}`}
                            >
                                Landmarks
                            </li>
                        </Link>
                        <Link to="/profile">
                            <li className={`
                            cursor-pointer
                            py-3 
                            text-sm 
                            font-semibold
                          text-slate-800 
                            border-b-[3px] 
                            border-b-transparent
                            ${(pathMatchRoute("/sign-in") || pathMatchRoute("/profile"))
                                && "font-bold border-b-green-600"}`}
                            >
                                {pageState}
                            </li>
                        </Link>
                    </ul>
                </nav>
            </header>
        </div>
    );
};