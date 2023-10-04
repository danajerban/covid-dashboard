import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminPage() {
  const [query, setQuery] = useState("");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    confirmed: "",
    deaths: "",
    recovered: "",
    active: "",
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/admin/search?q=${query}`
      );
      setCountries(response.data);
    } catch (error) {
      console.error("Error searching countries:", error);
    }
  };

  const handleUpdate = async (countryId) => {
    try {
      await axios.post(
        `http://localhost:5000/admin/update/${countryId}`,
        formData,
        {
          withCredentials: true,
        }
      );
      alert("Data updated successfully");
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Error updating data");
    }
  };

  const handleDelete = async (countryId) => {
    try {
      await axios.delete(`http://localhost:5000/admin/delete/${countryId}`);
      setCountries(countries.filter((country) => country.id !== countryId));
      alert("Country deleted successfully");
    } catch (error) {
      console.error("Error deleting country:", error);
      alert("Error deleting country");
    }
  };

  const handleEdit = (country) => {
    setSelectedCountry(country);
  };

  const handleGoToHomepage = () => {
    navigate("/");
  };

  return (
    <div className="p-4">
      <button onClick={handleGoToHomepage}>Go to Homepage</button>
      <button onClick={handleLogout}>Logout</button>
      <input
        type="text"
        placeholder="Search countries"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {/* search results */}
      {countries.map((country) => (
        <div key={country.id}>
          <h2>{country.name}</h2>
          <button onClick={() => handleEdit(country)}>Edit OR </button>
          <button onClick={() => handleDelete(country.id)}>Delete</button>
        </div>
      ))}
      {/* edit form */}
      {selectedCountry && (
        <div className="edit-form">
          <h2>Edit Data for {selectedCountry.name}</h2>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <input
            type="number"
            placeholder="Confirmed"
            value={formData.confirmed}
            onChange={(e) =>
              setFormData({ ...formData, confirmed: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Deaths"
            value={formData.deaths}
            onChange={(e) =>
              setFormData({ ...formData, deaths: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Recovered"
            value={formData.recovered}
            onChange={(e) =>
              setFormData({ ...formData, recovered: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Active"
            value={formData.active}
            onChange={(e) =>
              setFormData({ ...formData, active: e.target.value })
            }
          />
          <button onClick={() => handleUpdate(selectedCountry.id)}>
            Update Data
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
