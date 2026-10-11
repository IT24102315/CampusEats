using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace CampusEats.Api;
[ApiController, Route("api/menu")]
public class MenuController(AppDbContext db) : ControllerBase {
 [HttpGet] public async Task<IActionResult> Get() => Ok(await db.MenuItems.AsNoTracking().OrderBy(m=>m.Id).ToListAsync());
 [HttpGet("{id:int}")] public async Task<IActionResult> Get(int id) {
  var item=await db.MenuItems.FindAsync(id); return item is null ? NotFound() : Ok(item);
 }
 [HttpPost, Authorize(Roles="Admin")] public async Task<IActionResult> Create(MenuInput input) {
  var item=new MenuItem {Name=input.Name.Trim(), Price=input.Price, Category=input.Category.Trim(), Available=input.Available};
  db.MenuItems.Add(item); await db.SaveChangesAsync(); return CreatedAtAction(nameof(Get),new {id=item.Id},item);
 }
 [HttpPut("{id:int}"), Authorize(Roles="Admin")] public async Task<IActionResult> Update(int id, MenuInput input) {
  var item=await db.MenuItems.FindAsync(id); if(item is null) return NotFound();
  item.Name=input.Name.Trim(); item.Price=input.Price; item.Category=input.Category.Trim(); item.Available=input.Available;
  await db.SaveChangesAsync(); return NoContent();
 }
 [HttpDelete("{id:int}"), Authorize(Roles="Admin")] public async Task<IActionResult> Delete(int id) {
  var item=await db.MenuItems.FindAsync(id); if(item is null) return NotFound();
  db.MenuItems.Remove(item); await db.SaveChangesAsync(); return NoContent();
 }
}
