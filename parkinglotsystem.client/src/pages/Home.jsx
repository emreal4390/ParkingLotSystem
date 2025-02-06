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
        axios.get("https://localhost:7172/api/vehicle/active")
            .then(response => setVehicles(response.data))
            .catch(error => console.error("Failed to load vehicles:", error));
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

    const handleSubmit = () => {
        if (!ownerName || !apartmentNumber) {
            alert("Lutfen daire no giriniz.");
            return;
        }

        const newVehicle = {
            licensePlate,
            ownerName,
            apartmentNumber,
            entryTime: new Date().toISOString(),
            isGuest: false
        };

        axios.post("https://localhost:7172/api/vehicle", newVehicle)
            .then(() => {
                alert("Giris Basariyla Yapildi!");
                setShowForm(false);
                setOwnerName("");
                setApartmentNumber("");
                fetchVehicles();
            })
            .catch(error => console.error("Giris yapilamadi:", error));
    };

    // EXIT butonu: rastgele bir aracýn çýkýþýný gerçekleþtirir.
    const handleExitClick = () => {
        if (vehicles.length === 0) {
            alert("No vehicles in the parking lot.");
            return;
        }
        const randomVehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
        axios.put(`https://localhost:7172/api/vehicle/${randomVehicle.id}/exit`)
            .then(() => {
                alert(`Vehicle ${randomVehicle.licensePlate} Cikis Yapildi!`);
                fetchVehicles();
            })
            .catch(error => console.error("Exit failed:", error));
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
