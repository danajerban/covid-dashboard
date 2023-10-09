import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/admin");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="p-4 justify-center items-center flex flex-1">
      <form
        onSubmit={handleLogin}
        className="flex flex-col border-2 border-pink-300 rounded-xl p-4 gap-4"
      >
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium leading-6 text-pink-600"
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
              className="block w-full rounded-md border-pink-300 border py-1.5 focus:outline-none text-pink-600 placeholder:text-gray-400 focus:ring-2 focus:ring-pink-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-6 text-pink-600"
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
              className="block w-full rounded-md border-pink-300 focus:outline-none border py-1.5 text-pink-600 placeholder:text-gray-400 focus:ring-2 focus:ring-pink-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-5 flex w-full justify-center rounded-md bg-pink-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-pink-500 focus:outline-none"
        >
          Log in
        </button>
      </form>
    </div>
  );
}

export default Login;
