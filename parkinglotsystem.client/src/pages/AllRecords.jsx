import { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../index.css"; // CSS dosyanýzý import edin

const AllRecords = () => {
    const [records, setRecords] = useState([]);
    const [plate, setPlate] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [apartmentNo, setApartmentNo] = useState("");
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);
    const [minHours, setMinHours] = useState("");
    const [minMinutes, setMinMinutes] = useState("");
    const [maxHours, setMaxHours] = useState("");
    const [maxMinutes, setMaxMinutes] = useState("");

    const handleFilter = () => {
        const filterCriteria = {};

        if (plate.trim()) filterCriteria.plate = plate.trim();
        if (ownerName.trim()) filterCriteria.ownerName = ownerName.trim();
        if (apartmentNo.trim()) filterCriteria.apartmentNo = apartmentNo.trim();
        if (dateFrom) filterCriteria.dateFrom = dateFrom.toISOString();
        if (dateTo) filterCriteria.dateTo = dateTo.toISOString();

        // Süre hesaplama (saat * 60 + dakika)
        const minDuration = (parseInt(minHours || 0) * 60) + parseInt(minMinutes || 0);
        const maxDuration = (parseInt(maxHours || 0) * 60) + parseInt(maxMinutes || 0);

        if (minDuration > 0) filterCriteria.minDuration = minDuration;
        if (maxDuration > 0) filterCriteria.maxDuration = maxDuration;

        const query = new URLSearchParams(filterCriteria).toString();
        console.log(`API Request: https://localhost:7172/api/vehicle/history/filter?${query}`);

        axios
            .get(`https://localhost:7172/api/vehicle/history/filter?${query}`)
            .then((response) => {
                console.log("API Response:", response.data);
                setRecords(response.data);
            })
            .catch((error) => console.error("Failed to fetch filtered records:", error));
    };

    const formatDuration = (entryTime, exitTime) => {
        if (!exitTime) return "-"; // Çýkýþ yapmayan araçlar için

        const durationInMinutes = Math.round((new Date(exitTime) - new Date(entryTime)) / (1000 * 60));
        const hours = Math.floor(durationInMinutes / 60); // Kaç saat
        const minutes = durationInMinutes % 60; // Kaç dakika

        if (hours > 0) {
            return `${hours} saat ${minutes} dk`;
        } else {
            return `${minutes} min`;
        }
    };

    return (
        <div className="all-records">
            {/* Filtreleme Alaný */}
            <div className="filter-container">
                <input type="text" placeholder="Plaka" value={plate} onChange={(e) => setPlate(e.target.value)} />
                <input type="text" placeholder="Isim" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
                <input type="text" placeholder="DaireNo" value={apartmentNo} onChange={(e) => setApartmentNo(e.target.value)} />
                <DatePicker selected={dateFrom} onChange={(date) => setDateFrom(date)} placeholderText="Tarihten itibaren" />
                <DatePicker selected={dateTo} onChange={(date) => setDateTo(date)} placeholderText="Bu tarihe kadar" />

                {/* Minimum Duration */}
                <div>
                    <input type="number" placeholder="Minimum Saat" value={minHours} onChange={(e) => setMinHours(e.target.value)} />
                    <input type="number" placeholder="Minimum Dakika" value={minMinutes} onChange={(e) => setMinMinutes(e.target.value)} />
                </div>

                {/* Maximum Duration */}
                <div>
                    <input type="number" placeholder="Maximum Saat" value={maxHours} onChange={(e) => setMaxHours(e.target.value)} />
                    <input type="number" placeholder="Maximum Dakika" value={maxMinutes} onChange={(e) => setMaxMinutes(e.target.value)} />
                </div>

                <button onClick={handleFilter}>Filter</button>
            </div>

            {/* Tablo Alaný */}
            <table>
                <thead>
                    <tr>
                        <th>Plaka</th>
                        <th>Isim</th>
                        <th>DaireNo</th>
                        <th>Giris Zamani</th>
                        <th>Cikis Zamani</th>
                        <th>Gecirilen Sure</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((record) => (
                        <tr key={record.id}>
                            <td>{record.licensePlate}</td>
                            <td>{record.ownerName}</td>
                            <td>{record.apartmentNumber}</td>
                            <td>{new Date(record.entryTime).toLocaleString()}</td>
                            <td>{record.exitTime ? new Date(record.exitTime).toLocaleString() : "Hala Otoparkta"}</td>
                            <td>{formatDuration(record.entryTime, record.exitTime)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AllRecords;
