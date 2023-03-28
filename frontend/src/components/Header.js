import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import logo from '../assets/logo/logo.webp';

export const Header = () => {
    const [pageState, setPageState] = useState('Sign in');
    const [showLogout, setShowLogout] = useState(null);
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setPageState('Profile');
                setShowLogout('Sign out');
            } else {
                setPageState('Sign in');
                setShowLogout(null);
            }
        });
    }, [auth])

    
    const onLogout = () => {
        auth.signOut();
        navigate('/');
    };
    
    const pathMatchRoute = (route) => {
        if (route === location.pathname) {
            return true;
        };
    };

    return (
        <div className="bg-blue-50 border-b shadow-sm sticky top-0 z-40">
            <header className="md:flex justify-between items-center max-w-6xl md:px-3 md:mx-auto">
                <div>
                    <Link className='inline-block w-auto' to={"/"}>
                        <img src={logo} alt="logo" className="h-12 cursor-pointer px-3" />
                    </Link>
                </div>
                <nav>
                    <div onClick={() => setOpen(!open)} className='text-3xl absolute right-2 top-4 cursor-pointer md:hidden'>
                        {open
                            ? <AiOutlineClose />
                            : <AiOutlineMenu />
                        }
                    </div>
                    <ul className={`absolute w-full bg-blue-50 md:static md:flex md:space-x-10 ${open ? 'left-0 top-[13]' : 'top-[-490px]'}`}>
                        <li className={`
                            cursor-pointer
                            py-3
                            px-3 
                            text-sm 
                            font-semibold
                            text-slate-800 
                            border-b-[3px] 
                            border-b-transparent 
                            ${pathMatchRoute("/") && "!font-bold !border-b-green-600"}`}
                        >
                            <Link to="/">Home</Link>
                        </li>
                        <li className={`
                            cursor-pointer
                            py-3
                            px-3 
                            text-sm 
                            font-semibold
                          text-slate-800 
                            border-b-[3px] 
                            border-b-transparent 
                            ${pathMatchRoute("/landmarks") && "!font-bold !border-b-green-600"}`}
                        >
                            <Link to="/landmarks">Landmarks</Link>
                        </li>
                        <li className={`
                            cursor-pointer
                            py-3
                            px-3 
                            text-sm 
                            font-semibold
                          text-slate-800 
                            border-b-[3px] 
                            border-b-transparent
                            ${(pathMatchRoute("/sign-in") || pathMatchRoute("/profile"))
                            && "!font-bold !border-b-green-600"}`}
                        >
                            <Link to="/profile">{pageState}</Link>
                        </li>
                        {auth.currentUser !== null && (
                            <li className='
                            cursor-pointer
                            py-3
                            px-3 
                            text-sm 
                            font-semibold
                          text-slate-800 
                            border-b-[3px] 
                            border-b-transparent'
                            >
                                <Link to="/" onClick={onLogout}>{showLogout}</Link>
                            </li>
                        )}
                    </ul>
                </nav>
            </header>
        </div>
    );
};