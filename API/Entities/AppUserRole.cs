using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Entities;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppUserRole : IdentityUserRole<int>
    {   
        //userul
        public HRUser User { get; set; }
        //rolulurile
        public AppRole Role { get; set; }

        
    }
}