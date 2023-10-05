import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import Login from "./components/Login";
import AdminPage from "./components/AdminPage";
import Register from "./components/Register";
import CountryPage from "./components/CountryPage";

function App() {
  return (
    <>
      <h1 className="text-3xl">Covid19 dashboard</h1>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/country/:countryId" element={<CountryPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
