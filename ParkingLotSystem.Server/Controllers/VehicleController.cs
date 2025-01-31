using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ParkingLotSystem.Data;
//using ParkingLotSystem.Server.Data;
using ParkingLotSystem.Server.Models;

namespace ParkingLotSystem.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehicleController : ControllerBase
    {
        private readonly ParkingLotSystemDbContext _context;

        public VehicleController(ParkingLotSystemDbContext context)
        {
            _context = context;
        }

        // Otoparktaki güncel araçları listeleme
        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetActiveVehicles()
        {
            return await _context.Vehicles
                .Where(v => v.ExitTime == null)
                .ToListAsync();
        }

        // Son 1 aylık geçmiş kayıtları listeleme
        [HttpGet("history")]
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetVehicleHistory()
        {
            var oneMonthAgo = DateTime.UtcNow.AddMonths(-1);
            return await _context.Vehicles
                .Where(v => v.EntryTime >= oneMonthAgo)
                .ToListAsync();
        }

        // Yeni araç girişi ekleme
        [HttpPost]
        public async Task<ActionResult<Vehicle>> AddVehicle(Vehicle vehicle)
        {
            vehicle.EntryTime = DateTime.UtcNow;
            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetActiveVehicles), new { id = vehicle.Id }, vehicle);
        }

        // Araç çıkışını kaydetme
        [HttpPut("{id}/exit")]
        public async Task<IActionResult> UpdateExitTime(int id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null) return NotFound();

            vehicle.ExitTime = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
