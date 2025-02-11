using ParkingLotSystem.Server.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

public class Site
{
    public int SiteID { get; set; }

    [Required]
    [Column(TypeName = "varchar(100)")]
    public string SiteName { get; set; }

    [Required]
    [Column(TypeName = "varchar(36)")]
    public string SiteSecret { get; set; }

    public virtual ICollection<User> Users { get; set; }
    public virtual ICollection<Vehicle> Vehicles { get; set; }
}
