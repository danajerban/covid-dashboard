import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'
function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_LOCAL_URL}/register`, {
        username,
        password,
      });
      toast.success('Registered successfully, please log in!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
      navigate("/login");
    } catch (error) {
      toast.error('User cannot register as new admin!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
      console.error("Register error:", error);
    }
  };

  return (
    <div className="p-16 justify-center items-center flex flex-1">
      <form
        onSubmit={handleRegister}
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
              className="block w-full rounded-md border-gray-300 border p-1.5 text-gray-800 focus:outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-gray-600 sm:text-sm sm:leading-6"
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
              className="block w-full rounded-md border-gray-300 border p-1.5 text-gray-800 focus:outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-gray-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-5 flex w-full justify-center rounded-md bg-pink-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-pink-400 focus:outline-none"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
