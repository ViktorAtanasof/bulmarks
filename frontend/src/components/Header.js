import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState, useRef } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import logo from "../assets/logo/logo.webp";

export const Header = () => {
  const [pageState, setPageState] = useState("Sign in");
  const [showLogout, setShowLogout] = useState(null);
  const [open, setOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();
  const avatarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        window.innerWidth > 768 &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target) &&
        event.target.tagName !== "A"
      ) {
        setOpenProfile(false);
      }
    };
    // Check if the screen size is larger than the specified breakpoint
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    if (mediaQuery.matches) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      if (mediaQuery.matches) {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, []);

  useEffect(() => {
    setOpenProfile(window.innerWidth < 768);
  }, []);

  const controlNavbar = () => {
    if (window.scrollY >= 100) {
      setOpen(false);
      if (window.innerWidth > 768) {
        setOpenProfile(false);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setPageState("Profile");
        setShowLogout("Sign out");
      } else {
        setPageState("Sign in");
        setShowLogout(null);
      }
    });
  }, [auth]);

  const onLogout = () => {
    auth.signOut();
    navigate("/");
  };

  const pathMatchRoute = (route) => {
    if (route === location.pathname) {
      return true;
    }
  };

  return (
    <div className="bg-blue-50 border-b shadow-sm sticky top-0 z-40 pt-2">
      <header className="md:flex justify-between items-center max-w-6xl md:px-3 md:mx-auto">
        <div>
          <Link className="inline-block w-auto" to={"/"}>
            <img src={logo} alt="logo" className="h-12 cursor-pointer px-3" />
          </Link>
        </div>
        <nav className="md:relative">
          <div
            onClick={() => setOpen(!open)}
            className="text-3xl absolute right-2 top-4 cursor-pointer md:hidden"
          >
            {open ? <AiOutlineClose /> : <AiOutlineMenu />}
          </div>
          <ul
            className={`absolute w-full bg-blue-50 md:static md:flex md:space-x-10
                                    transition-all duration-500 ease-in-out items-center
                            ${
                              open
                                ? `left-0 top-[13] opacity-100`
                                : `opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto`
                            }`}
          >
            <li
              className={`
                            cursor-pointer
                            text-sm 
                            font-semibold
                            text-slate-800 
                            border-b-[3px] 
                            border-b-transparent 
                            ${
                              pathMatchRoute("/") &&
                              "!font-bold !border-b-green-600"
                            }`}
            >
              <Link className="inline-block w-full py-3 px-3" to="/">
                Home
              </Link>
            </li>
            <li
              className={`
                            cursor-pointer 
                            text-sm 
                            font-semibold
                          text-slate-800 
                            border-b-[3px] 
                            border-b-transparent 
                            ${
                              pathMatchRoute("/landmarks") &&
                              "!font-bold !border-b-green-600"
                            }`}
            >
              <Link className="inline-block w-full py-3 px-3" to="/landmarks">
                Landmarks
              </Link>
            </li>
            <li
              className={`
                            cursor-pointer 
                            text-sm 
                            font-semibold
                          text-slate-800 
                            border-b-[3px] 
                            border-b-transparent 
                           `}
            >
              <img
                src={`https://api.dicebear.com/6.x/initials/svg?seed=
                                ${
                                  auth.currentUser === null
                                    ? "G" // Guest
                                    : auth.currentUser.displayName
                                }`}
                alt="avatar"
                className="w-9 h-9 rounded mr-10 hidden md:inline"
                onClick={() => setOpenProfile(!openProfile)}
                ref={avatarRef}
              />
            </li>
            {openProfile && (
              <ul
                className="md:absolute bg-blue-50 md:top-[50px] md:right-0 md:drop-shadow-xl 
                            md:rounded md:border-2"
              >
                <li
                  className={`
                            cursor-pointer
                            text-sm 
                            font-semibold
                          text-slate-800 
                            border-b-[3px] 
                            border-b-transparent
                            ${
                              (pathMatchRoute("/sign-in") ||
                                pathMatchRoute("/profile")) &&
                              "!font-bold !border-b-green-600"
                            }`}
                >
                  <Link className="inline-block w-full py-3 px-3" to="/profile">
                    {pageState}
                  </Link>
                </li>
                {auth.currentUser !== null && (
                  <li
                    className={`
                            cursor-pointer 
                            text-sm 
                            font-semibold
                          text-slate-800 
                            border-b-[3px] 
                            border-b-transparent 
                            ${
                              pathMatchRoute("/profile/favourites") &&
                              "!font-bold !border-b-green-600"
                            }`}
                  >
                    <Link
                      className="inline-block w-full py-3 px-3"
                      to="/profile/favourites"
                    >
                      Favourites
                    </Link>
                  </li>
                )}
                {auth.currentUser !== null && (
                  <li
                    className="
                            cursor-pointer
                            text-sm 
                            font-semibold
                          text-slate-800 
                            border-b-[3px] 
                            border-b-transparent"
                  >
                    <Link
                      className="inline-block w-full py-3 px-3"
                      to="/"
                      onClick={onLogout}
                    >
                      {showLogout}
                    </Link>
                  </li>
                )}
              </ul>
            )}
          </ul>
        </nav>
      </header>
    </div>
  );
};
