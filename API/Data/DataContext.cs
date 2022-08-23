using API.Entities;
using Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace API.Data
{
    public class DataContext : IdentityDbContext<HRUser, AppRole, int, IdentityUserClaim<int>, 
        AppUserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        //LIKE FEATURE
        public DbSet<HRUserAppreciation> Appreciation { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Connection> Connections { get; set; }
        public DbSet<Calendar> Calendar { get; set; }
        public DbSet<Tasks> Tasks { get; set; }

       

        //MESSAGES FEATUR
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            

            //LIKES FEATURE
            modelBuilder.Entity<HRUserAppreciation>() 
                //creating a primary key for the HRUserLike table
                .HasKey(key => new {key.SourceUSerId, key.LikedUserId});

            //translate: a source user can like many users 
            modelBuilder.Entity<HRUserAppreciation>()
                .HasOne(s => s.SourceUser)
                .WithMany(l => l.LikedUsers)
                .HasForeignKey(s => s.SourceUSerId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<HRUserAppreciation>()
                .HasOne(s => s.LikedUser)
                .WithMany(l => l.LikedByUsers)
                .HasForeignKey(s => s.LikedUserId)
                .OnDelete(DeleteBehavior.Cascade);

            //MESSAGES FEATURE  
            modelBuilder.Entity<Message>()
                .HasOne(q => q.Reciever)
                .WithMany(b => b.MessagesReceived)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>()
                //this one is for the sender
                .HasOne(q => q.Sender)
                //the sender has many messagess sent 
                .WithMany(b => b.MessagesSent)
                .OnDelete(DeleteBehavior.Restrict);

            //RELATIONSHIP BETWEEN HRUSER AND APPROLE
            modelBuilder.Entity<HRUser>()
                .HasMany(urole => urole.UserRoles)
                .WithOne(user => user.User)
                .HasForeignKey(ur => ur.UserId)
                .IsRequired();

            modelBuilder.Entity<AppRole>()
                .HasMany(urole => urole.UserRoles)
                .WithOne(user => user.Role)
                .HasForeignKey(ur => ur.RoleId)
                .IsRequired();
        }
    }
}