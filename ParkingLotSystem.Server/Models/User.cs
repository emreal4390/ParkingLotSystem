using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ParkingLotSystem.Server.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [Column(TypeName = "varchar(100)")] // 🔥 NVARCHAR yerine VARCHAR olarak ayarla
        public string Email { get; set; }

        [Required]
        [Column(TypeName = "varchar(60)")]
        public string FullName { get; set; }

        [Required]
        [Column(TypeName = "varchar(32)")]
        public string Password { get; set; }

        [Required]
        [Column(TypeName = "varchar(20)")]
        public string Role { get; set; }

        public int SiteID { get; set; }

        [Required]
        [Column(TypeName = "varchar(36)")]
        public string SiteSecret { get; set; }

        //public virtual Site Site { get; set; }
    }

}
