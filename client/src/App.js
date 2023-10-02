import { BrowserRouter as Router, Route } from "react-router-dom";
import Homepage from "./components/Homepage";

function App() {
  return (
    <>
    <h1 className="text-3xl">Covid19 dashboard</h1>
    <div>
      <Homepage />
    </div>
    </>
  );
}

export default App;
