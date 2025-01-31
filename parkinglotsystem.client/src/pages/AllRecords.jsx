import { useEffect, useState } from "react";
import axios from "axios";

const AllRecords = () => {
    const [allRecords, setAllRecords] = useState([]);

    useEffect(() => {
        axios.get("https://localhost:7172/api/vehicle/history")
            .then(response => setAllRecords(response.data))
            .catch(error => console.error("Failed to load records:", error));
    }, []);

    return (
        <div className="container">
            <h2>All Records</h2>
            <table>
                <thead>
                    <tr>
                        <th>License Plate</th>
                        <th>Owner</th>
                        <th>Apartment</th>
                        <th>Entry Time</th>
                        <th>Exit Time</th>
                        <th>Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {allRecords.length > 0 ? (
                        allRecords.map((record) => (
                            <tr key={record.id}>
                                <td>{record.licensePlate}</td>
                                <td>{record.ownerName}</td>
                                <td>{record.apartmentNumber}</td>
                                <td>{new Date(record.entryTime).toLocaleString()}</td>
                                <td>{record.exitTime ? new Date(record.exitTime).toLocaleString() : "Still in parking"}</td>
                                <td>
                                    {record.exitTime
                                        ? `${Math.round((new Date(record.exitTime) - new Date(record.entryTime)) / (1000 * 60))} min`
                                        : "-"}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No records available.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AllRecords;
