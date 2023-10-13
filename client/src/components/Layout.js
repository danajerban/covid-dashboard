import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import { toast } from "react-toastify";
function Layout({ children, isLoggedIn, onLoginStatusChange }) {
  // initially I checked for token in the layout component, but it's better to do it in the App.js
  // because we need to pass the login status to the layout component and the authControl component
  // so App.js is the parent for both
  // basically this is the navbar component which stays on the screen all the time
  // according to the login status we will show different links

  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   setIsLoggedIn(!!token);
  // }, []);

  const logout = () => {
    localStorage.removeItem("token");
    onLoginStatusChange(false);
    toast.info("Logged out!", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  return (
    <>
      <nav className="bg-pink-100 border-b border-pink-300">
        <div className="flex justify-between items-center p-2">
          <div className="flex items-center">
            <img
              src={`${process.env.PUBLIC_URL}/covid logo.png`}
              alt="Covid-19 logo"
              className="h-12 w-auto mr-4 ml-4"
            />

            <Link to="/">
              <p className="font-extrabold text-xl text-pink-600 hover:text-pink-900">
                Covid-19 Dashboard
              </p>
            </Link>
          </div>
          <SearchBar />
          <div className="flex space-x-4 mr-4">
            {isLoggedIn ? (
              <>
                <Link to="/admin" className="text-pink-600 hover:text-pink-900">
                  Admin Panel
                </Link>
                <span
                  onClick={logout}
                  className="cursor-pointer text-pink-600 hover:text-pink-900"
                >
                  Logout
                </span>
              </>
            ) : (
              <>
                <Link to="/login" className="text-pink-600 hover:text-pink-900">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-pink-600 hover:text-pink-900"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </>
  );
}

export default Layout;
