import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import CurrentVehicles from "./pages/CurrentVehicles.jsx";
import AllRecords from "./pages/AllRecords.jsx";
import "./index.css";


const setUTF8Encoding = () => {
    const meta = document.createElement("meta");
    meta.setAttribute("charset", "UTF-8");
    document.head.appendChild(meta);
};


setUTF8Encoding();

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
                    <Link to="/">Anasayfa</Link>
                    <Link to="/current">Icerdeki Araclar</Link>
                    <Link to="/records">Tum Kayitlar</Link>
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
