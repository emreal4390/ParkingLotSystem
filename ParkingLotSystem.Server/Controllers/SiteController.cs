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

        // ✅ Tüm Siteleri Listeleme (Sadece SuperAdmin)
        [HttpGet]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<ActionResult<IEnumerable<Site>>> GetAllSites()
        {
            return await _context.Sites.ToListAsync();
        }

        // ✅ Yeni Site Ekleme (Sadece SuperAdmin)
        [HttpPost]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<ActionResult<Site>> CreateSite(Site site)
        {
            site.SiteSecret = Guid.NewGuid().ToString(); // Her site için benzersiz bir GUID oluştur
            _context.Sites.Add(site);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAllSites), new { id = site.SiteID }, site);
        }

        // ✅ Kullanıcının Kendi Sitesini Görmesi (Admin & SuperAdmin)
        [HttpGet("mysite")]
        [Authorize]
        public async Task<ActionResult<Site>> GetMySite()
        {
            var userSiteId = GetUserSiteIdFromToken();
            if (userSiteId == null)
            {
                return Unauthorized("Yetkilendirme hatası! Site bilgisi eksik.");
            }

            var site = await _context.Sites.FindAsync(userSiteId);
            if (site == null)
            {
                return NotFound("Site bulunamadı!");
            }

            return site;
        }

        // ✅ Kullanıcının SiteID Bilgisini Token'dan Alma
        private string GetUserSiteIdFromToken()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity == null)
                return null;

            var siteIdClaim = identity.FindFirst("SiteID");
            return siteIdClaim?.Value; // SiteID artık string olarak dönecek
        }
    }
}
