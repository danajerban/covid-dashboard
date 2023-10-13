import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import Login from "./components/Login";
import AdminPage from "./components/AdminPage";
import Register from "./components/Register";
import CountryPage from "./components/CountryPage";
import Layout from "./components/Layout";
import { useState, useEffect } from "react";
import AuthControl from "./components/AuthControl";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// we need to use the state to keep track of the login status and pass it to the layout component (navbar)
// also the authControl component needs to know the login status to handle protected routes (admin panel)

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLoginStatus = (status) => {
    setIsLoggedIn(status);
  };
  return (
    <>
      <Router>
        <Layout isLoggedIn={isLoggedIn} onLoginStatusChange={handleLoginStatus}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route
              path="/login"
              element={<Login onLoginStatusChange={handleLoginStatus} />}
            />
            <Route path="/register" element={<Register />} />
            <Route
              path="/admin"
              element={
                <AuthControl isLoggedIn={isLoggedIn}>
                  <AdminPage />
                </AuthControl>
              }
            />
            <Route path="/country/:countryId" element={<CountryPage />} />
          </Routes>
        </Layout>
      </Router>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
