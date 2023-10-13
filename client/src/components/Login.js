import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'

function Login({onLoginStatusChange}) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_LOCAL_URL}/login`, {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      onLoginStatusChange(true);
      toast.success('Logged in successfully!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
      navigate("/");
    } catch (error) {
      toast.error('Bad credentials, try again!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
      console.error("Login error:", error);
    }
  };

  return (
    <div className="p-16 justify-center items-center flex flex-1">
      <form
        onSubmit={handleLogin}
        className="flex flex-col border-2 w-96 border-gray-300 rounded-xl p-8 gap-4"
      >
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium leading-6 text-gray-800"
          >
            Username
          </label>
          <div className="mt-2">
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full rounded-md border-gray-300 border p-1.5 focus:outline-none text-gray-800 placeholder:text-gray-400 focus:ring-1 focus:ring-gray-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-6 text-gray-800"
          >
            Password
          </label>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-md border-gray-300 focus:outline-none border p-1.5 text-gray-800 placeholder:text-gray-400 focus:ring-1 focus:ring-gray-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-5 flex w-full justify-center rounded-md bg-pink-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-pink-600 focus:outline-none"
        >
          Log in
        </button>
      </form>
    </div>
  );
}

export default Login;
