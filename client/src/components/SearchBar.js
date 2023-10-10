import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/search?q=${query}`
      );
      const firstCountry = response.data[0];
      if (firstCountry) {
        navigate(`/country/${firstCountry.id}`);
      } else {
        console.error("No countries found");
      }
    } catch (error) {
      console.error("Error searching countries:", error);
    }
    setQuery("");
  };

  return (
    <div className="relative w-2/4">
      <form
        onSubmit={handleSubmit}
        className="flex border-gray-200 rounded-2xl p-1"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a country"
          className="w-full rounded-l-md border-0 py-2 px-4 text-gray-600 leading-tight focus:outline-none focus:ring-1 focus:ring-gray-500"
        />
        <button
          type="submit"
          className="bg-pink-500 text-white font-bold py-2 px-4 rounded-r-md hover:bg-pink-400 focus:outline-none focus:shadow-outline"
        >
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
