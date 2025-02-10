import { useState, useEffect } from "react";
import axios from "axios";
import "../index.css";


const Home = () => {
    const [licensePlate, setLicensePlate] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [apartmentNumber, setApartmentNumber] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    

    useEffect(() => {
        fetchVehicles();
    }, []);

    
    const fetchVehicles = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.warn("Yetkilendirme hatası: Token bulunamadı!");
            return;
        }

        axios.get("https://localhost:7172/api/vehicle/active", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                console.log("Mevcut araçlar:", response.data);
                setVehicles(response.data);
            })
            .catch(error => console.error("Araçları yükleme başarısız:", error));
    };

    const generateRandomPlate = () => {
        const randomNumbers1 = Math.floor(10 + Math.random() * 90);
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const randomLetters = Array.from({ length: 3 }, () => letters[Math.floor(Math.random() * letters.length)]).join("");
        const randomNumbers2 = Math.floor(10 + Math.random() * 90);
        return `${randomNumbers1} ${randomLetters} ${randomNumbers2}`;
    };

    const handleEntryClick = () => {
        setLicensePlate(generateRandomPlate());
        setShowForm(true);
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error(" Yetkilendirme hatası: Token bulunamadı!");
         
            return;
        }

        try {
            const response = await axios.post(
                "https://localhost:7172/api/vehicle",
                {
                    licensePlate,
                    ownerName,
                    apartmentNumber
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(" Araç eklendi:", response.data);
           
            alert("Giris Basariyla Yapildi!");

            // **Formu temizle**
            setLicensePlate("");
            setOwnerName("");
            setApartmentNumber("");

        } catch (error) {
            console.error(" Araç eklenirken hata oluştu:", error);
           
        }
    };


    // **EXIT butonu: Rastgele bir aracın çıkışını gerçekleştirir.**
    const handleExitClick = () => {
        if (vehicles.length === 0) {
            alert("Otoparkta çıkış yapacak araç bulunmuyor!");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Yetkilendirme hatası: Lütfen giriş yapın.");
            return;
        }

        const randomVehicle = vehicles[Math.floor(Math.random() * vehicles.length)];

        axios.put(`https://localhost:7172/api/vehicle/${randomVehicle.id}/exit`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(() => {
                alert(`Araç ${randomVehicle.licensePlate} çıkış yaptı!`);
                

                // **Araç listesini güncelle**
                fetchVehicles();
            })
            .catch(error => {
                console.error("Çıkış işlemi başarısız:", error);
                
            });
    };

    return (
        <div className="home-container">
            

            <div className="button-container">
                {/* ENTRY Butonu */}
                <button className="button-image entry-button" onClick={handleEntryClick} />

                {/* EXIT Butonu */}
                <button className="button-image exit-button" onClick={handleExitClick} />
            </div>

            {showForm && (
                <div className="form-container">
                    <h3>Arac Bilgisi</h3>
                    <label>Plaka:</label>
                    <input type="text" value={licensePlate} disabled />

                    <label>Isim:</label>
                    <input type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />

                    <label>DaireNo:</label>
                    <input type="text" value={apartmentNumber} onChange={(e) => setApartmentNumber(e.target.value)} />

                    <button className="btn btn-primary" onClick={handleSubmit}>Kaydet</button>
                </div>
            )}
        </div>
    );
};

export default Home;
