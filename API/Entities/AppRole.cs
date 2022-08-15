using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppRole : IdentityRole<int>
    {   
        // public int RoleId { get; set; }
        //contains all the roles 
        public ICollection<AppUserRole> UserRoles { get; set; }
    }
}