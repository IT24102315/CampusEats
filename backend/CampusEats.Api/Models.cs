using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
namespace CampusEats.Api;
public class MenuItem {
 public int Id { get; set; }
 public string Name { get; set; } = "";
 public decimal Price { get; set; }
 public string Category { get; set; } = "";
 public bool Available { get; set; } = true;
}
public class User {
 public int Id { get; set; }
 public string Name { get; set; } = "";
 public string Email { get; set; } = "";
 public string PasswordHash { get; set; } = "";
 public string Role { get; set; } = "Customer";
 public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options) {
 public DbSet<MenuItem> MenuItems => Set<MenuItem>();
 public DbSet<User> Users => Set<User>();
 protected override void OnModelCreating(ModelBuilder b) {
  b.Entity<User>().HasIndex(u => u.Email).IsUnique();
  b.Entity<MenuItem>().Property(m => m.Price).HasPrecision(10, 2);
  b.Entity<MenuItem>().HasData(
   new MenuItem { Id=1, Name="Kottu Roti", Price=750, Category="Mains" },
   new MenuItem { Id=2, Name="Fried Rice", Price=850, Category="Mains" },
   new MenuItem { Id=3, Name="Veg Sub", Price=600, Category="Snacks", Available=false },
   new MenuItem { Id=4, Name="Watalappan", Price=350, Category="Dessert" },
   new MenuItem { Id=5, Name="Iced Milo", Price=300, Category="Drinks" });
 }
}
public record MenuInput([Required, StringLength(80)] string Name,
 [Range(typeof(decimal), "0.01", "99999999.99")] decimal Price,
 [Required, StringLength(40)] string Category, bool Available = true);
public record RegisterInput([Required, StringLength(80, MinimumLength=2)] string Name,
 [Required, EmailAddress] string Email, [Required, StringLength(72, MinimumLength=8)] string Password);
public record LoginInput([Required, EmailAddress] string Email, [Required] string Password);
