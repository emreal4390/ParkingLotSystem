import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import CurrentVehicles from "./pages/CurrentVehicles.jsx";
import AllRecords from "./pages/AllRecords.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import "./index.css";

function App() {
    const [userRole, setUserRole] = useState(null);

    // Kullanıcının giriş yapıp yapmadığını kontrol et
    useEffect(() => {
        const role = localStorage.getItem("role");
        const token = localStorage.getItem("token");

        if (role && token) {
            console.log(" Kullanıcı rolü bulundu:", role);
            setUserRole(role);
        } else {
            console.warn(" Kullanıcı giriş yapmamış veya token eksik!");
        }
    }, []);


    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setUserRole(null); 
        window.location.href = "/login"; 
    };

    
    const backgroundStyle = {
        backgroundImage: "url('/images/background2.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        height: "100vh",
       
    };

    return (
        <div style={backgroundStyle}>
            <Router>
                {/* Navbar - Kullanıcı giriş yaptıysa gösterilecek */}
                {userRole && (
                    <nav className="navbar">
                        <div className="navbar-menu">
                            <Link to="/">Anasayfa</Link>
                            <Link to="/current">Otopark</Link>
                            <Link to="/records">Tüm Kayıtlar</Link>
                            <button className="logout-btn" onClick={handleLogout}>Çıkış Yap</button>
                        </div>
                    </nav>
                )}

                {/* Yönlendirmeler */}
                <Routes>
                    {!userRole ? (
                        // Kullanıcı giriş yapmamışsa sadece Login sayfası açık olsun
                        <>
                            <Route path="/login" element={<LoginPage setUserRole={setUserRole} />} />
                            <Route path="*" element={<Navigate to="/login" />} />
                        </>
                    ) : (
                        // Kullanıcı giriş yaptıysa ana sayfalar erişilebilir olsun
                        <>
                            <Route path="/" element={<Home />} />
                            <Route path="/current" element={<CurrentVehicles />} />
                            <Route path="/records" element={<AllRecords />} />
                            <Route path="*" element={<Navigate to="/" />} />
                        </>
                    )}
                </Routes>
            </Router>
        </div>
    );
}

export default App;
