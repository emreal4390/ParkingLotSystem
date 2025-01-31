import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import CurrentVehicles from "./pages/CurrentVehicles";
import AllRecords from "./pages/AllRecords";

function App() {
    return (
        <Router>
            <div className="navbar">
                <Link to="/">Home</Link>
                <Link to="/current">Current Vehicles</Link>
                <Link to="/records">All Records</Link>
            </div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/current" element={<CurrentVehicles />} />
                <Route path="/records" element={<AllRecords />} />
            </Routes>
        </Router>
    );
}

export default App;
