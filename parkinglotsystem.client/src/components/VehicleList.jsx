import { useEffect, useState } from "react";
import axios from "axios";
import "../index.css"; // CSS dosyasýný içe aktarýyoruz

const VehicleList = () => {
    const [vehicles, setVehicles] = useState([]);
    const [licensePlate, setLicensePlate] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [apartmentNumber, setApartmentNumber] = useState("");
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = () => {
        axios.get("https://localhost:7172/api/vehicle/active")
            .then(response => {
                setVehicles(response.data);
            })
            .catch(error => {
                console.error("API isteði baþarýsýz:", error);
            });
    };

    // Rastgele plaka oluþtur
    const generateRandomPlate = () => {
        const randomNumbers1 = Math.floor(10 + Math.random() * 90); // 10-99 arasý rakam
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const randomLetters = Array.from({ length: 3 }, () => letters[Math.floor(Math.random() * letters.length)]).join("");
        const randomNumbers2 = Math.floor(10 + Math.random() * 90); // 10-99 arasý rakam
        return `${randomNumbers1} ${randomLetters} ${randomNumbers2}`;
    };

    // Giriþ formunu aç ve rastgele plaka oluþtur
    const handleGirisClick = () => {
        setLicensePlate(generateRandomPlate());
        setShowForm(true);
    };

    // Yeni aracý API'ye ekle
    const handleSubmit = () => {
        if (!ownerName || !apartmentNumber) {
            alert("Lütfen isim ve apartman numarasýný girin.");
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
                setShowForm(false);
                setOwnerName("");
                setApartmentNumber("");
                fetchVehicles(); // Listeyi güncelle
            })
            .catch(error => {
                console.error("Araç eklenirken hata oluþtu:", error);
            });
    };

    return (
        <div className="container">
            <h2>Guncel Otoparktaki Araclar</h2>

            {/* GÝRÝÞ Butonu */}
            <button className="btn btn-success" onClick={handleGirisClick}>YENI ARAC GIRIS</button>

            {/* Giriþ Formu */}
            {showForm && (
                <div className="form-container">
                    <h3>Arac Girisi</h3>
                    <label>Plaka:</label>
                    <input type="text" value={licensePlate} disabled />

                    <label>Isim:</label>
                    <input type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />

                    <label>Apartman No:</label>
                    <input type="text" value={apartmentNumber} onChange={(e) => setApartmentNumber(e.target.value)} />

                    <button className="btn btn-primary" onClick={handleSubmit}>Kaydet</button>
                </div>
            )}

            {/* Araç Listesi */}
            <table>
                <thead>
                    <tr>
                        <th>Plaka</th>
                        <th>Isim</th>
                        <th>Daire</th>
                        <th>Giris Saati</th>
                    </tr>
                </thead>
                <tbody>
                    {vehicles.length > 0 ? (
                        vehicles.map((vehicle) => (
                            <tr key={vehicle.id}>
                                <td>{vehicle.licensePlate}</td>
                                <td>{vehicle.ownerName}</td>
                                <td>{vehicle.apartmentNumber}</td>
                                <td>{new Date(vehicle.entryTime).toLocaleString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">Otoparkta arac bulunmamaktadir.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default VehicleList;
