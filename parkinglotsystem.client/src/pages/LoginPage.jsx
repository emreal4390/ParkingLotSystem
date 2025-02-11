import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "../index.css"; 

const LoginPage = ({ setUserRole }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
   

    //kullanıcı adı ve şifre apiye gönderilerek doğruma yapılır
    const handleLogin = async () => {
        try {
            console.log("Giriş yapılıyor...", { email, password });

            const response = await axios.post("https://localhost:7172/api/auth/login", {
                email,
                password
            });

            console.log("API Yanıtı:", response.data);

            if (!response.data || !response.data.token || !response.data.role || response.data.siteID === undefined) {
                console.error("API'den gelen yanıt eksik:", response.data);
                alert("Yetkilendirme hatası! API'den eksik yanıt geldi.");
                return;
            }

            // LocalStorage içine kaydet
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("siteID", response.data.siteID); //  Kullanıcının SiteID'sini kaydet

            console.log("localStorage'a Kaydedildi: Token:", response.data.token);
            console.log("localStorage'a Kaydedildi: Role:", response.data.role);
            console.log("localStorage'a Kaydedildi: SiteID:", response.data.siteID);

            setUserRole(response.data.role);
            window.location.href = "/";
        } catch (err) {
            console.error("Giriş hatası:", err.response?.data || err);
            alert("Hatalı e-posta veya şifre!");
        }
    };


    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Giriş Yap</h2>
               
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
