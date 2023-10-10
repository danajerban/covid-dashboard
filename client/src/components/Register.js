import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/register", {
        username,
        password,
      });
      navigate("/login");
    } catch (error) {
      console.error("Register error:", error);
    }
  };

  return (
    <div className="p-4 justify-center items-center flex flex-1">
      <form
        onSubmit={handleRegister}
        className="flex flex-col border-2 border-gray-300 rounded-xl p-4 gap-4"
      >
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-center leading-6 text-gray-800"
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
            className="block text-sm font-medium text-center leading-6 text-gray-800"
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
          className="mt-5 flex w-full justify-center rounded-md bg-pink-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-pink-400 focus:outline-none"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
