import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";

function Layout({ children, isLoggedIn, onLoginStatusChange }) {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   setIsLoggedIn(!!token);
  // }, []);

  const logout = () => {
    localStorage.removeItem('token');
    onLoginStatusChange(false);  
  };


  return (
    <>
      <nav className="bg-pink-100 border-b border-pink-300">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center">
            <img
              src={`${process.env.PUBLIC_URL}/covid logo.png`}
              alt="Covid-19 logo"
              className="h-12 w-auto mr-4"
            />

            <Link to="/">
              <p className="font-extrabold text-xl text-pink-600 hover:text-pink-900">
                Covid-19 Dashboard
              </p>
            </Link>
          </div>
          <SearchBar />
          <div className="flex space-x-4">
        {isLoggedIn ? (
          <>
            <Link to="/admin" className="text-pink-600 hover:text-pink-900">
              Admin Panel
            </Link>
            <span onClick={logout} className="cursor-pointer text-pink-600 hover:text-pink-900">
              Logout
            </span>
          </>
        ) : (
          <>
            <Link to="/login" className="text-pink-600 hover:text-pink-900">
              Login
            </Link>
            <Link to="/register" className="text-pink-600 hover:text-pink-900">
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
