using System;
using System.Collections.Generic;
using API.Entities;
using Microsoft.AspNetCore.Identity;

namespace Entities
{
    public class HRUser : IdentityUser<int>
    {
        //it autoincrements 
        public string FullName { get; set; }
        public string StatusOrQuote { get; set; }
        public string Faculty { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime Created { get; set; } = DateTime.Now;
        public DateTime LastActive { get; set; } = DateTime.Now;
        public ICollection<HRUserPhoto> Photo { get; set; }

        //for the like feature 
        //users liked by the currently loged in user
        public ICollection<HRUserAppreciation> LikedByUsers { get; set; }
        //users that the currently loged in user likes
        public ICollection<HRUserAppreciation> LikedUsers { get; set; }

        //for the messages feature
        public ICollection<Message> MessagesSent { get; set; }
        public ICollection<Message> MessagesReceived { get; set; }

        public ICollection<AppUserRole> UserRoles { get; set; }

    }
}