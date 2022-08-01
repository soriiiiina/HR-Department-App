using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class SeedData
    {
        public static async Task SeedHRUsers(DataContext dataContext)
        {
            //check if there are users 
            if(await dataContext.Users.AnyAsync()) return; 

            var hruserData = await System.IO.File.ReadAllTextAsync("Data/HRUserSeedData.json");
            //creating a normal list of hrusers of type HRUser
            var hrusers = JsonSerializer.Deserialize<List<HRUser>>(hruserData);

            //looping through all the users 
            foreach (var hruser in hrusers)
            {
                using var hmac = new HMACSHA512();

                hruser.UserName = hruser.UserName.ToLower();
                hruser.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("pa"));
                hruser.PasswordSalt = hmac.Key;

                dataContext.Users.Add(hruser);
            }

            await dataContext.SaveChangesAsync();


        }   
    }
}