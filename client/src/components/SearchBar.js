// components/SearchBar.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/search?q=${query}`);
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
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a country"
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}

export default SearchBar;
