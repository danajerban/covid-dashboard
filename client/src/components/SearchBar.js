import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import  {toast} from 'react-toastify'
function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
 // for making things easier I implemented this logic for the search bar
 // 1 - it makes a request to the backend with the query that the user typed (country.name)
 // 2 - if the country exists it will redirect to the country page with the id of the country
 // 3 - countryPage with take this param and make a request to the backend to get the data of the country
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_LOCAL_URL}/search?q=${query}`
      );
      const firstCountry = response.data[0];
      if (firstCountry) {
        navigate(`/country/${firstCountry.id}`);
      } else {
        toast.error('Country not found, please check for typos!', {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
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
          className="bg-pink-600 text-white font-bold py-2 px-4 rounded-r-md hover:bg-pink-400 focus:outline-none focus:shadow-outline"
        >
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
