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
        <div style={{ marginTop: "80px", textAlign: "center" }}>
            <h1 style={{ color: "#FFCC00", fontSize: "28px", marginBottom: "20px" }}>Parking Lot Management</h1>
            <div style={{ marginBottom: "30px" }}>
                <button
                    className="btn btn-success"
                    style={{
                        backgroundColor: "#4CAF50",
                        color: "white",
                        padding: "10px 20px",
                        fontSize: "18px",
                        border: "none",
                        borderRadius: "8px",
                        marginRight: "10px",
                        cursor: "pointer",
                        transition: "transform 0.3s ease, background-color 0.3s ease",
                    }}
                    onClick={handleEntryClick}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#45a049")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#4CAF50")}
                >
                    ENTRY
                </button>
                <button
                    className="btn btn-danger"
                    style={{
                        backgroundColor: "#DC3545",
                        color: "white",
                        padding: "10px 20px",
                        fontSize: "18px",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "transform 0.3s ease, background-color 0.3s ease",
                    }}
                    onClick={handleExitClick}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#C82333")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#DC3545")}
                >
                    EXIT
                </button>
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
