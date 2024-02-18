import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState, useRef, memo } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { FaSun, FaMoon } from "react-icons/fa6";
import logo from "../assets/logo/logo.webp";

export const Header = memo(() => {
  const [authData, setAuthData] = useState({
    isAuthenticated: false,
    displayName: "",
  });
  const [openMenu, setOpenMenu] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [theme, setTheme] = useState("light");
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();
  const avatarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        window.innerWidth > 768 &&
        avatarRef.current &&
        (avatarRef.current as HTMLElement).contains(event.target as Node) ===
          false &&
        !(event.target as HTMLElement).closest("a[href]")
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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 100) {
        setOpenMenu(false);
        if (window.innerWidth > 768) {
          setOpenProfile(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setAuthData({
        isAuthenticated: !!user,
        displayName: user?.displayName ?? "",
      });
    });
  }, [auth]);

  const handleOpenMenu = () => setOpenMenu(!openMenu);
  const handleOpenProfile = () => setOpenProfile(!openProfile);
  const handleThemeChange = () => setTheme(theme === "dark" ? "light" : "dark");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleLogout = () => {
    auth.signOut();
    navigate("/");
  };

  const pathMatchRoute = (route: string) => location.pathname === route;

  const avatarUrl = authData.isAuthenticated
    ? `https://api.dicebear.com/6.x/initials/svg?seed=${authData.displayName}`
    : `https://api.dicebear.com/6.x/initials/svg?seed=g`; // Guest

  return (
    <div className="bg-primary-color border-b shadow-sm sticky top-0 z-40 pt-2 transition-all duration-500 ease-in-out">
      <header className="md:flex justify-between items-center max-w-6xl md:px-3 md:mx-auto">
        <div>
          <Link className="inline-block w-auto" to="/">
            <img src={logo} alt="logo" className="h-12 cursor-pointer px-3" />
          </Link>
        </div>
        <button
          className={`text-secondary-color ml-auto md:py-3 md:px-5 text-2xl md:relative md:right-auto md:top-auto absolute right-12 top-5 p-0 ${
            theme === "dark"
          }`}
          onClick={handleThemeChange}
        >
          {theme === "dark" ? <FaMoon /> : <FaSun />}
        </button>
        <nav className="md:relative">
          <button
            className="text-3xl absolute right-2 top-4 cursor-pointer md:hidden text-secondary-color"
            onClick={handleOpenMenu}
          >
            {openMenu ? <AiOutlineClose /> : <AiOutlineMenu />}
          </button>
          <ul
            className={`absolute w-full bg-primary-color md:static md:flex md:space-x-10 transition-all duration-500 ease-in-out items-center ${
              openMenu
                ? "left-0 top-[13] opacity-100"
                : "opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto"
            }`}
          >
            <li
              className={`cursor-pointer text-sm font-semibold text-secondary-color border-b-[3px] border-b-transparent ${
                pathMatchRoute("/") && "!font-bold !border-b-accent-color"
              }`}
            >
              <Link className="inline-block w-full py-3 px-3" to="/">
                Home
              </Link>
            </li>
            <li
              className={`cursor-pointer text-sm font-semibold text-secondary-color border-b-[3px] border-b-transparent ${
                pathMatchRoute("/landmarks") &&
                "!font-bold !border-b-accent-color"
              }`}
            >
              <Link className="inline-block w-full py-3 px-3" to="/landmarks">
                Landmarks
              </Link>
            </li>
            <li
              className={`cursor-pointer text-sm font-semibold text-secondary-color border-b-[3px] border-b-transparent`}
            >
              <img
                src={avatarUrl}
                alt="avatar"
                className="w-9 h-9 rounded mr-10 hidden md:inline"
                onClick={handleOpenProfile}
                ref={avatarRef}
              />
            </li>
            {openProfile && (
              <ul
                className={`md:absolute bg-primary-color md:top-[50px] md:right-0 md:drop-shadow-xl md:rounded md:border-2 transition-all duration-500 ease-in-out`}
              >
                <li
                  className={`cursor-pointer text-sm font-semibold text-secondary-color border-b-[3px] border-b-transparent ${
                    (pathMatchRoute("/sign-in") ||
                      pathMatchRoute("/profile")) &&
                    "!font-bold !border-b-accent-color"
                  }`}
                >
                  <Link className="inline-block w-full py-3 px-3" to="/profile">
                    {authData.isAuthenticated ? "Profile" : "Sign in"}
                  </Link>
                </li>
                {authData.isAuthenticated && (
                  <>
                    <li
                      className={`cursor-pointer text-sm font-semibold text-secondary-color border-b-[3px] border-b-transparent ${
                        pathMatchRoute("/profile/favourites") &&
                        "!font-bold !border-b-accent-color"
                      }`}
                    >
                      <Link
                        className="inline-block w-full py-3 px-3"
                        to="/profile/favourites"
                      >
                        Favourites
                      </Link>
                    </li>
                    <li
                      className={`cursor-pointer text-sm font-semibold text-secondary-color border-b-[3px] border-b-transparent`}
                    >
                      <Link
                        to="/"
                        className="inline-block w-full py-3 px-3"
                        onClick={handleLogout}
                      >
                        Sign out
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            )}
          </ul>
        </nav>
      </header>
    </div>
  );
});
