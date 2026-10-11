using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Npgsql;
namespace CampusEats.Api;
[ApiController, Route("api/auth")]
public class AuthController(AppDbContext db, IConfiguration config) : ControllerBase {
 [HttpPost("register")] public async Task<IActionResult> Register(RegisterInput input) {
  var email=input.Email.Trim().ToLowerInvariant();
  if(await db.Users.AnyAsync(u=>u.Email==email)) return Conflict(new {message="Email already used"});
  if(Encoding.UTF8.GetByteCount(input.Password)>72) return BadRequest(new {message="Password exceeds 72 UTF-8 bytes"});
  var user=new User {Name=input.Name.Trim(),Email=email,PasswordHash=BCrypt.Net.BCrypt.HashPassword(input.Password),Role="Customer"};
  db.Users.Add(user);
  try { await db.SaveChangesAsync(); }
  catch(DbUpdateException ex) when(ex.InnerException is PostgresException {SqlState:"23505"}) {
   return Conflict(new {message="Email already used"});
  }
  return StatusCode(201,new {user.Id,user.Name,user.Email,user.Role});
 }
 [HttpPost("login")] public async Task<IActionResult> Login(LoginInput input) {
  var email=input.Email.Trim().ToLowerInvariant();
  var user=await db.Users.SingleOrDefaultAsync(u=>u.Email==email);
  if(user is null || !BCrypt.Net.BCrypt.Verify(input.Password,user.PasswordHash)) return Unauthorized(new {message="Invalid credentials"});
  var token=new JwtSecurityToken(issuer:config["Jwt:Issuer"],audience:config["Jwt:Audience"],
   claims:new[] {new Claim(ClaimTypes.NameIdentifier,user.Id.ToString()),new Claim(ClaimTypes.Email,user.Email),new Claim(ClaimTypes.Role,user.Role)},
   expires:DateTime.UtcNow.AddHours(2),signingCredentials:new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!)),SecurityAlgorithms.HmacSha256));
  return Ok(new {token=new JwtSecurityTokenHandler().WriteToken(token),user=new {user.Name,user.Email,user.Role}});
 }
}
