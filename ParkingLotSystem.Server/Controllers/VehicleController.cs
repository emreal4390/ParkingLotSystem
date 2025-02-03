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
            vehicle.EntryTime = DateTime.UtcNow.AddHours(3); ;
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

            vehicle.ExitTime = DateTime.UtcNow.AddHours(3); ;
            await _context.SaveChangesAsync();
            return NoContent();
        }
        // Dinamik filtreleme özelliği
        [HttpGet("history/filter")]
        public IActionResult GetFilteredVehicleHistory(
    [FromQuery] string? plate,
    [FromQuery] string? ownerName,
    [FromQuery] string? apartmentNo,
    [FromQuery] DateTime? dateFrom,
    [FromQuery] DateTime? dateTo,
    [FromQuery] int? minDuration,
    [FromQuery] int? maxDuration)
        {
            var vehicles = _context.Vehicles.AsQueryable();

            if (!string.IsNullOrEmpty(plate))
                vehicles = vehicles.Where(v => v.LicensePlate.Contains(plate));

            if (!string.IsNullOrEmpty(ownerName))
                vehicles = vehicles.Where(v => v.OwnerName.Contains(ownerName));

            if (!string.IsNullOrEmpty(apartmentNo))
                vehicles = vehicles.Where(v => v.ApartmentNumber.Contains(apartmentNo));

            if (dateFrom.HasValue && dateTo.HasValue)
                vehicles = vehicles.Where(v => v.EntryTime >= dateFrom && v.ExitTime <= dateTo);

            if (minDuration.HasValue)
                vehicles = vehicles.Where(v => v.ExitTime != null &&
                    (EF.Functions.DateDiffMinute(v.EntryTime, v.ExitTime) >= minDuration));

            if (maxDuration.HasValue)
                vehicles = vehicles.Where(v => v.ExitTime != null &&
                    (EF.Functions.DateDiffMinute(v.EntryTime, v.ExitTime) <= maxDuration));

            return Ok(vehicles.ToList());
        }


    }

}
