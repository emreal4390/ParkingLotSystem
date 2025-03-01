﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ParkingLotSystem.Data;
//using ParkingLotSystem.Server.Data;
using ParkingLotSystem.Server.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace ParkingLotSystem.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public class VehicleController : ControllerBase
    {
        private readonly ParkingLotSystemDbContext _context;

        public VehicleController(ParkingLotSystemDbContext context)
        {
            _context = context;
        }

        // Otoparktaki güncel araçları listeleme
        [HttpGet("active")]
        [Authorize]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetActiveVehicles()
        {
            var userSiteId=GetUserSiteIdFromToken();
            return await _context.Vehicles
                .Where(v => v.ExitTime == null && v.SiteID==userSiteId)
                .ToListAsync();
        }

        // Son 1 aylık geçmiş kayıtları listeleme
        [HttpGet("history")]
        [Authorize]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetVehicleHistory()
        {
            var userSiteId=GetUserSiteIdFromToken();
            var oneMonthAgo = DateTime.UtcNow.AddMonths(-1);
            return await _context.Vehicles
                .Where(v => v.EntryTime >= oneMonthAgo&& v.SiteID==userSiteId)
                .ToListAsync();
        }

        // Yeni araç girişi ekleme
        [Authorize]
        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpPost]
        public async Task<ActionResult<Vehicle>> AddVehicle(Vehicle vehicle)
        {
            var userSiteId = GetUserSiteIdFromToken(); //  Token'dan SiteID çekiyoruz
            if (userSiteId == null)
            {
                return Unauthorized("Yetkilendirme hatası: Site bilgisi eksik!");
            }

            vehicle.SiteID = userSiteId.Value; //  Kullanıcının SiteID'sini araca atıyoruz
            vehicle.EntryTime = DateTime.UtcNow.AddHours(3);

            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetActiveVehicles), new { id = vehicle.Id }, vehicle);
        }

        [Authorize]
        [Authorize(Roles = "Admin,SuperAdmin")]
        private int? GetUserSiteIdFromToken()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity == null) return null;

            var siteIdClaim = identity.FindFirst("SiteID");

            if (siteIdClaim == null)
            {
                Console.WriteLine(" SiteID bulunamadı! Token içinde eksik olabilir.");
                return null;
            }

            bool isValid = int.TryParse(siteIdClaim.Value, out int siteId);

            if (!isValid)
            {
                Console.WriteLine($" SiteID geçersiz formatta: {siteIdClaim.Value}");
                return null;
            }

            Console.WriteLine($" SiteID bulundu: {siteId}");
            return siteId;
        }

        [Authorize]
        [Authorize(Roles = "SuperAdmin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVehicle(int id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null) return NotFound("Araç bulunamadı!");

            _context.Vehicles.Remove(vehicle);
            await _context.SaveChangesAsync();
            return NoContent();
        }





        // Araç çıkışını kaydetme
        [HttpPut("{id}/exit")]
        [Authorize]
        [Authorize(Roles = "Admin,SuperAdmin")]
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
            var userSiteId = GetUserSiteIdFromToken();
            var vehicles = _context.Vehicles
                .Where(v => v.SiteID == userSiteId)  // Bu şekilde kullanıcının siteID si kontrol edilerek sadece o siteye ait araçlardan filtreleme yapılır
                .AsQueryable();

            

            if (!string.IsNullOrEmpty(plate))
                vehicles = vehicles.Where(v => v.LicensePlate.Contains(plate));

            if (!string.IsNullOrEmpty(ownerName))
                vehicles = vehicles.Where(v => v.OwnerName.Contains(ownerName) );

            if (!string.IsNullOrEmpty(apartmentNo))
                vehicles = vehicles.Where(v => v.ApartmentNumber.Contains(apartmentNo));

            if (dateFrom.HasValue && dateTo.HasValue)
                vehicles = vehicles.Where(v => v.EntryTime >= dateFrom && v.ExitTime <= dateTo );

            if (minDuration.HasValue)
                vehicles = vehicles.Where(v => v.ExitTime != null &&
                    (EF.Functions.DateDiffMinute(v.EntryTime, v.ExitTime) >= minDuration) );

            if (maxDuration.HasValue)
                vehicles = vehicles.Where(v => v.ExitTime != null &&
                    (EF.Functions.DateDiffMinute(v.EntryTime, v.ExitTime) <= maxDuration) );

            return Ok(vehicles.ToList());
        }


    }

}
