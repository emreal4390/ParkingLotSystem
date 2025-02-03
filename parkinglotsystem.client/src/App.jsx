import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import CurrentVehicles from "./pages/CurrentVehicles.jsx";
import AllRecords from "./pages/AllRecords.jsx";
import "./index.css"; // CSS dosyasýný içe aktarýyoruz

function App() {

    const backgroundStyle = {
        backgroundImage: "url('/images/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        height: "100vh",
    };
    return (
        <div style={backgroundStyle}>
            <Router>
                <div className="navbar">
                    <div className="navbar-menu">
                    <Link to="/">Home</Link>
                    <Link to="/current">Current Vehicles</Link>
                    <Link to="/records">All Records</Link>
                    </div>
                </div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/current" element={<CurrentVehicles />} />
                    <Route path="/records" element={<AllRecords />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
