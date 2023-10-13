import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify'
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
        `${process.env.REACT_APP_BACKEND_LOCAL_URL}/admin/search?q=${query}`
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
        `${process.env.REACT_APP_BACKEND_LOCAL_URL}/admin/update/${countryId}`,
        formData,
        {
          withCredentials: true,
        }
      );
      toast.success('Data updated successfully!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error('Cannot update data!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    }
  };

  const handleDelete = async (countryId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_LOCAL_URL}/admin/delete/${countryId}`);
      setCountries(countries.filter((country) => country.id !== countryId));
      toast.success('Country deleted successfully!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    } catch (error) {
      console.error("Error deleting country:", error);
      toast.error('Cannot delete country!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
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
          placeholder="Search countries for editing"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-l-md border-0 py-2 px-4 text-pink-600 leading-tight focus:outline-none focus:shadow-outline"
        />
        <button
          onClick={handleSearch}
          className="bg-pink-600 text-white rounded-r-md px-4 py-2 hover:bg-pink-400"
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
                  className="bg-pink-600 text-white rounded-md px-4 py-1 mr-2 hover:bg-pink-400"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(country.id)}
                  className="bg-pink-300 text-white rounded-md px-4 py-1 hover:bg-pink-600"
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
            className="text-pink-500 rounded-full p-1 absolute top-2 right-2 hover:text-pink-900"
          >
            X
          </button>

          <h2 className="text-center text-gray-700 mb-4">
            Edit Data for {selectedCountry.name}
          </h2>
          <div className="space-y-2">
            {/* even though I could place a min/max for the calendar, I decided to
            leave it open for future use - used the dataset mentioned earlier */}
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full rounded-md border-0 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-gray-600"
            />{" "}
            <input
              type="number"
              required
              placeholder="Total confirmed"
              value={formData.confirmed}
              className="w-full rounded-md border-0 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-gray-600"
              onChange={(e) =>
                setFormData({ ...formData, confirmed: e.target.value })
              }
            />
            <input
              type="number"
              required
              placeholder="Total Deaths"
              value={formData.deaths}
              className="w-full rounded-md border-0 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-gray-600"
              onChange={(e) =>
                setFormData({ ...formData, deaths: e.target.value })
              }
            />
            <input
              type="number"
              required
              placeholder="Total Recovered"
              value={formData.recovered}
              className="w-full rounded-md border-0 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-gray-600"
              onChange={(e) =>
                setFormData({ ...formData, recovered: e.target.value })
              }
            />
            {/* even though active cases aren't being displayed, you can still edit them for future use maybe */}
            <input
              type="number"
              required
              placeholder="Total Active"
              value={formData.active}
              className="w-full rounded-md border-0 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-gray-600"
              onChange={(e) =>
                setFormData({ ...formData, active: e.target.value })
              }
            />
            <button
              onClick={() => handleUpdate(selectedCountry.id)}
              className="mt-4 bg-pink-600 text-white w-full py-2 rounded-md hover:bg-pink-400"
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
