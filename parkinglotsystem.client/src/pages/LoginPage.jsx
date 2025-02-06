import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "../index.css"; // CSS dosyanız ile stilleri ekleyelim

const LoginPage = ({ setUserRole }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            console.log("Giriş yapılıyor...", { email, password });

            const response = await axios.post("https://localhost:7172/api/auth/login", {
                email,
                password
            });

            console.log(" API Yanıtı:", response.data);

            if (!response.data || !response.data.token || !response.data.role) {
                console.error("❌ API'den gelen yanıt eksik:", response.data);
                return;
            }

            
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);

            console.log(" localStorage'a Kaydedildi: Token:", localStorage.getItem("token"));
            console.log(" localStorage'a Kaydedildi: Role:", localStorage.getItem("role"));

            setUserRole(response.data.role);
            window.location.href = "/";
        } catch (err) {
            console.error(" Giriş hatası:", err.response?.data || err);
            setError(err.response?.data || "hatalı mail ya da şifre");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Giriş Yap</h2>
                {error && <p className="error">{error}</p>}
                <input
                    type="email"
                    placeholder="E-posta adresi"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin} className="login-btn">Giriş Yap</button>
            </div>
        </div>
    );
};

//setUserRole prop’unun function olup olmadığını kontrol eder.
LoginPage.propTypes = {
    setUserRole: PropTypes.func.isRequired,
};

export default LoginPage;
