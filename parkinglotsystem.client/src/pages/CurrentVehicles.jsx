import { useEffect, useState } from "react";
import axios from "axios";
import "../index.css";

const CurrentVehicles = () => {
    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        axios.get("https://localhost:7172/api/vehicle/active")
            .then(response => setVehicles(response.data))
            .catch(error => console.error("Failed to load vehicles:", error));
    }, []);

    return (
        <div>
            
            <table>
                <thead>
                    <tr>
                        <th>Plaka</th>
                        <th>Isim</th>
                        <th>DaireNo</th>
                        <th>Giris Zamani</th>
                    </tr>
                </thead>
                <tbody>
                    {vehicles.length > 0 ? (
                        vehicles.map(vehicle => (
                            <tr key={vehicle.id}>
                                <td>{vehicle.licensePlate}</td>
                                <td>{vehicle.ownerName}</td>
                                <td>{vehicle.apartmentNumber}</td>
                                <td>{new Date(vehicle.entryTime).toLocaleString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">Otoparkta suan arac yok.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CurrentVehicles;
