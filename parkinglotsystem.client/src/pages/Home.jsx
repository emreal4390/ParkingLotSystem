import { useState, useEffect } from "react";
import axios from "axios";
import "../index.css"; // CSS dosyasýný içe aktarýyoruz

const Home = () => {
    const [licensePlate, setLicensePlate] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [apartmentNumber, setApartmentNumber] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        fetchVehicles();
    }, []);

    // Güncel otoparktaki araçlarý getir
    const fetchVehicles = () => {
        axios.get("https://localhost:7172/api/vehicle/active")
            .then(response => setVehicles(response.data))
            .catch(error => console.error("Failed to load vehicles:", error));
    };

    // Rastgele plaka oluþtur
    const generateRandomPlate = () => {
        const randomNumbers1 = Math.floor(10 + Math.random() * 90);
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const randomLetters = Array.from({ length: 3 }, () => letters[Math.floor(Math.random() * letters.length)]).join("");
        const randomNumbers2 = Math.floor(10 + Math.random() * 90);
        return `${randomNumbers1} ${randomLetters} ${randomNumbers2}`;
    };

    // "GÝRÝÞ" butonuna basýldýðýnda formu aç ve rastgele plaka üret
    const handleEntryClick = () => {
        setLicensePlate(generateRandomPlate());
        setShowForm(true);
    };

    // Yeni aracý API'ye kaydet
    const handleSubmit = () => {
        if (!ownerName || !apartmentNumber) {
            alert("Please enter name and apartment number.");
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
                alert("Vehicle added successfully!");
                setShowForm(false);
                setOwnerName("");
                setApartmentNumber("");
                fetchVehicles(); // Güncel listeyi yenile
            })
            .catch(error => console.error("Failed to add vehicle:", error));
    };

    // "ÇIKIÞ" butonuna basýlýnca rastgele bir aracý çýkýþ yaptýr
    const handleExitClick = () => {
        if (vehicles.length === 0) {
            alert("No vehicles in the parking lot.");
            return;
        }

        const randomVehicle = vehicles[Math.floor(Math.random() * vehicles.length)];

        axios.put(`https://localhost:7172/api/vehicle/${randomVehicle.id}/exit`)
            .then(() => {
                alert(`Vehicle ${randomVehicle.licensePlate} exited successfully!`);
                fetchVehicles(); // Güncel listeyi yenile
            })
            .catch(error => console.error("Exit failed:", error));
    };

    return (
        <div className="container">
            <h2>Vehicle Management</h2>

            {/* Giriþ ve Çýkýþ Butonlarý */}
            <div className="button-container">
                <button className="btn btn-success" onClick={handleEntryClick}>ENTRY</button>
                <button className="btn btn-danger" onClick={handleExitClick}>EXIT</button>
            </div>

            {/* Araç Giriþ Formu */}
            {showForm && (
                <div className="form-container">
                    <h3>Vehicle Information</h3>
                    <label>License Plate:</label>
                    <input type="text" value={licensePlate} disabled />

                    <label>Owner Name:</label>
                    <input type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />

                    <label>Apartment No:</label>
                    <input type="text" value={apartmentNumber} onChange={(e) => setApartmentNumber(e.target.value)} />

                    <button className="btn btn-primary" onClick={handleSubmit}>Save</button>
                </div>
            )}
        </div>
    );
};

export default Home;
