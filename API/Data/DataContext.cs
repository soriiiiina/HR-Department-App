using API.Entities;
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

        //LIKE FEATURE
        public DbSet<HRUserLike> Likes { get; set; }

        //we to overrride a method inside dbcontext
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<HRUserLike>() 
                //creating a primary key for the HRUserLike table
                .HasKey(key => new {key.SourceUSerId, key.LikedUserId});

            //translate: a source user can like many users 
            modelBuilder.Entity<HRUserLike>()
                .HasOne(s => s.SourceUser)
                .WithMany(l => l.LikedUsers)
                .HasForeignKey(s => s.SourceUSerId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<HRUserLike>()
                .HasOne(s => s.LikedUser)
                .WithMany(l => l.LikedByUsers)
                .HasForeignKey(s => s.LikedUserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}