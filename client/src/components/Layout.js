import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

function Layout({ children }) {
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
              <p className="font-extrabold text-xl text-pink-600">
                Covid-19 Dashboard
              </p>
            </Link>
          </div>
          <SearchBar />
          <div className="flex space-x-4">
            <Link to="/login" className="text-pink-600">
              Login
            </Link>
            <Link to="/register" className="text-pink-600">
              Register
            </Link>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </>
  );
}

export default Layout;
