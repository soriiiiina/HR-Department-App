using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();

            //creating a scope for the services 
            using var scope = host.Services.CreateScope();

            var services = scope.ServiceProvider;

            try 
            {
                var context = services.GetRequiredService<DataContext>(); 
                //the same as dotnet ef database update --> updates the database
                //we will just have to restart the application and the database will be created/updated
                await context.Database.MigrateAsync();
                //calling the method defined in the SeedData in order to deserialize the randonmly generated users 
                var userManager = services.GetRequiredService<UserManager<HRUser>>();
                var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
                await SeedData.SeedHRUsers(userManager, roleManager);
            }
            catch (Exception ex)
            {
                var logger = services.GetRequiredService<ILogger<Program>>();
                logger.LogError(ex, "An error occured during migration");
            }

            await host.RunAsync();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
