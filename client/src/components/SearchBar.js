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
        `http://localhost:5000/search?q=${query}`
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
  };

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className="flex border-2 border-pink-300 rounded-xl p-1 shadow-lg bg-pink-100"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a country"
          className="w-full rounded-l-md border-0 py-2 px-4 text-pink-600 placeholder-pink-200 leading-tight focus:outline-none focus:shadow-outline"
        />
        <button
          type="submit"
          className="bg-pink-600 text-white font-bold py-2 px-4 rounded-r-md hover:bg-pink-500 focus:outline-none focus:shadow-outline"
        >
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
