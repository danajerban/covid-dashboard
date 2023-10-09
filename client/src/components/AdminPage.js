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

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/admin/search?q=${query}`
      );
      setCountries(response.data);
      setSelectedCountry(null); // Reset selectedCountry on new search
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

  const closeForm = () => {
    setSelectedCountry(null);
  };

  return (
    <div className="flex flex-col items-center p-4 min-h-screen bg-gray-100">
      <div className="flex w-full max-w-lg">
        <input
          type="text"
          placeholder="Search countries"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-l-md border-0 py-2 px-4 text-pink-600 leading-tight focus:outline-none focus:shadow-outline"
        />
        <button
          onClick={handleSearch}
          className="bg-pink-600 text-white rounded-r-md px-4 py-2"
        >
          Search
        </button>
      </div>
      {/* search results - only render if selectedCountry is null*/}
      {!selectedCountry && (
        <div
          className="mt-4 w-full max-w-lg overflow-y-auto"
          style={{ maxHeight: "300px" }}
        >
          {countries.map((country) => (
            <div
              key={country.id}
              className="flex justify-between items-center mb-2 bg-white p-2 rounded-md"
            >
              <h2 className="text-pink-600">{country.name}</h2>
              <div>
                <button
                  onClick={() => handleEdit(country)}
                  className="bg-pink-600 text-white rounded-md px-4 py-1 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(country.id)}
                  className="bg-pink-300 text-white rounded-md px-4 py-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* edit form - if there is a selected country to edit*/}
      {selectedCountry && (
        <div className="edit-form mt-4 w-full max-w-lg bg-white p-4 rounded-md relative">
          <button
            onClick={closeForm}
            className="text-pink-400 rounded-full p-1 absolute top-2 right-2 hover:text-pink-700"
          >
            X
          </button>

          <h2 className="text-center text-pink-600 mb-4">
            Edit Data for {selectedCountry.name}
          </h2>
          <div className="space-y-2">
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full rounded-md border-0 py-2 px-4 text-pink-600 leading-tight focus:outline-none focus:shadow-outline"
            />{" "}
            <input
              type="number"
              placeholder="Confirmed"
              value={formData.confirmed}
              className="w-full rounded-md border-0 py-2 px-4 text-pink-600 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) =>
                setFormData({ ...formData, confirmed: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Deaths"
              value={formData.deaths}
              className="w-full rounded-md border-0 py-2 px-4 text-pink-600 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) =>
                setFormData({ ...formData, deaths: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Recovered"
              value={formData.recovered}
              className="w-full rounded-md border-0 py-2 px-4 text-pink-600 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) =>
                setFormData({ ...formData, recovered: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Active"
              value={formData.active}
              className="w-full rounded-md border-0 py-2 px-4 text-pink-600 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) =>
                setFormData({ ...formData, active: e.target.value })
              }
            />
            <button
              onClick={() => handleUpdate(selectedCountry.id)}
              className="mt-4 bg-pink-600 text-white w-full py-2 rounded-md"
            >
              Update Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
