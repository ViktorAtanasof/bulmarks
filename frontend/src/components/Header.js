import { useLocation, Link } from 'react-router-dom';

export const Header = () => {
    const location = useLocation();

    const pathMatchRoute = (route) => {
        if (route === location.pathname) {
            return true;
        };
    };

    return (
        <div className="bg-blue-50 border-b shadow-sm sticky top-0 z-50">
            <header className="flex justify-between items-center px-3 max-w-6xl mx-auto">
                <div>
                    <Link to={"/"}>
                        <img src={require('../assets/logo.png')} alt="logo" className="h-12 cursor-pointer" />
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
                            >Home</li>
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
                            >Landmarks</li>
                        </Link>
                        <Link to="/sign-in">
                            <li className={`
                            cursor-pointer
                            py-3 
                            text-sm 
                            font-semibold
                          text-slate-800 
                            border-b-[3px] 
                            border-b-transparent 
                            ${pathMatchRoute("/sign-in") && "font-bold border-b-green-600"}`}
                            >Sign In</li>
                        </Link>
                    </ul>
                </nav>
            </header>
        </div>
    );
};