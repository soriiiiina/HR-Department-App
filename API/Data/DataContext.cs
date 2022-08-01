using Entities;
using Microsoft.EntityFrameworkCore;


namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        //we want to create a database set for the HRUser class 
        //Users is a table
        public DbSet<HRUser> Users { get; set; }
    }
}