namespace ParkingLotSystem.Server.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }  // "Admin" veya "SüperAdmin"

        public int SiteId { get; set; } 
        public Site Site { get; set; }

    }
}
