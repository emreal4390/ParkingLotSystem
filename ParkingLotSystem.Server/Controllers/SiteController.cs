using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ParkingLotSystem.Data;
using ParkingLotSystem.Server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ParkingLotSystem.Server.Controllers
{
    [Route("api/sites")]
    [ApiController]
    public class SiteController : ControllerBase
    {
        private readonly ParkingLotSystemDbContext _context;

        public SiteController(ParkingLotSystemDbContext context)
        {
            _context = context;
        }

        //  Tüm Siteleri Listeleme (Sadece SuperAdmin)
        [HttpGet]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<ActionResult<IEnumerable<Site>>> GetAllSites()
        {
            return await _context.Sites.ToListAsync();
        }

        //  Yeni Site Ekleme (Sadece SuperAdmin)
        [HttpPost]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<ActionResult<Site>> CreateSite(Site site)
        {
            site.SiteSecret = Guid.NewGuid().ToString(); // Her site için benzersiz bir GUID oluştur
            _context.Sites.Add(site);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAllSites), new { id = site.SiteID }, site);
        }

        
    }
}
