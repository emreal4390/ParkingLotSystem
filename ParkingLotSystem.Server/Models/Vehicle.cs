namespace ParkingLotSystem.Server.Models
{
    public class Vehicle
    {
        public int Id { get; set; }
        public string LicensePlate { get; set; }
        public string OwnerName { get; set; }
        public string ApartmentNumber { get; set; }
        public DateTime EntryTime { get; set; } = DateTime.UtcNow;
        public DateTime? ExitTime { get; set; }
        public bool IsGuest { get; set; }
    }
}
