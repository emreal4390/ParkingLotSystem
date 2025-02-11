using Microsoft.EntityFrameworkCore;

using ParkingLotSystem.Server.Models;

namespace ParkingLotSystem.Data
{
    public class ParkingLotSystemDbContext : DbContext
    {
        public ParkingLotSystemDbContext(DbContextOptions<ParkingLotSystemDbContext> options)
            : base(options)
        {
        }

        // DbSet'ler, veritabanındaki her tabloyu temsil eder.
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<User> Users { get; set; }

        public DbSet<Site> Sites { get; set; }
    }
}
