using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ParkingLotSystem.Data;

using ParkingLotSystem.Server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ParkingLotSystem.Server.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ParkingLotSystemDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ParkingLotSystemDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        

        //  Kullanıcı Girişi 
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto loginDto)  //json verisini bir loginDto nesnesine dönüştürüyoruz
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);  //dbde emaille eşleşen kuulanıcıyı arar eğer eşleşme olursa user değişkenine atar 

            if (user == null || user.Password != loginDto.Password) // eğer eşleşme olmazsa null değerine atar ve hata mesajını döndürür
            {
                return Unauthorized("Invalid email or password.");
            }

            var token = GenerateJwtToken(user);  //giriş başarılı olursa jwt token oluşturulur. bu token front-end e gönderilerek kullanıcının kimliği doğrulanır.
            return Ok(new { token = token, role = user.Role });

        }

        //   JWT Token üretme metodu
        private string GenerateJwtToken(User user)
        {
            var keyString = _configuration["Jwt:Key"];  //appsettings.json dosyasından JWT:key alınır. bu anahtar token i imzalamak için kullanılır
            if (string.IsNullOrEmpty(keyString))
            {
                throw new Exception("JWT Key is missing in appsettings.json!");
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);  //token sha256 ile imzalanır

            var claims = new[]
            {
        new Claim(ClaimTypes.Name, user.FullName),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, user.Role)  //bu bilgiler localStorage içine kaydedilir.
    };

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.UtcNow.AddHours(2),  //jwt token'in süresi 2 saat sonra dolar e kullanıcıdan yeniden giriş yapması istenir.
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
