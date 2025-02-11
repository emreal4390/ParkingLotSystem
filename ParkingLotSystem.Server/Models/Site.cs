using ParkingLotSystem.Server.Models;

public class Site
{
    public int SiteID { get; set; }
    public string SiteName { get; set; }
    public string SiteSecret { get; set; } // Guid değil, string olarak tanımlanmalı!


    // İlişkiler
    public ICollection<User> Users { get; set; }
    public ICollection<Vehicle> Vehicles { get; set; }
}
