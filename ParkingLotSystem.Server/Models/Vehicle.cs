using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ParkingLotSystem.Server.Models
{
    public class Vehicle
    {
        public int Id { get; set; }

        [Required]
        [Column(TypeName = "varchar(20)")]
        public string LicensePlate { get; set; }

        [Required]
        [Column(TypeName = "varchar(60)")]
        public string OwnerName { get; set; }

        [Required]
        [Column(TypeName = "varchar(20)")]
        public string ApartmentNumber { get; set; }

        public DateTime EntryTime { get; set; }
        public DateTime? ExitTime { get; set; }

        public int SiteID { get; set; }

        //public virtual Site Site { get; set; }
    }

}
