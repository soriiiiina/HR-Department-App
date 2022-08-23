using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using API.Entities;
using Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class SeedData
    {
        public static async Task SeedHRUsers(UserManager<HRUser> userManager, 
            RoleManager<AppRole> roleManager)
        {
            //check if there are users 
            if(await userManager.Users.AnyAsync()) return; 

            var hruserData = await System.IO.File.ReadAllTextAsync("Data/HRUserSeedData.json");
            //creating a normal list of hrusers of type HRUser
            var hrusers = JsonSerializer.Deserialize<List<HRUser>>(hruserData);

            if(hrusers == null) return; 

            var roles = new List<AppRole> 
            {
                new AppRole{Name = "Member"},
                new AppRole{Name = "Admin"},
                new AppRole{Name = "TeamMember"},
            };

            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            }

            //looping through all the users 
            foreach (var hruser in hrusers)
            {
                hruser.UserName = hruser.UserName.ToLower();
                
                await userManager.CreateAsync(hruser, "pa");

                await userManager.AddToRoleAsync(hruser, "Member");
            }

            var admin = new HRUser
            {
                UserName = "admin",
            };

            await userManager.CreateAsync(admin, "pa");

            await userManager.AddToRolesAsync(admin, new[] {"Admin", "TeamMember"});
        }   
    }
}