using IRDb.Models;
using Microsoft.EntityFrameworkCore;

namespace IRDb.Database
{
    public class AppDbContext : DbContext
    {
        //Tar emot options och skickar till baskonstruktors i DbContext
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Movie> Movies { get; set; }
        //Connections string kan vara här som i tidigare mappar, annars kan den göras senare
    }
}
