using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using API.Extensions;

namespace Entities
{
    public class HRUser
    {
        //it autoincrements 
        public int Id { get; set; }
        public string FullName { get; set; }
        public string UserName { get; set; }
        public string StatusOrQuote { get; set; }
        public string PhoneNumber { get; set; }
        public string Faculty { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime Created { get; set; } = DateTime.Now;
        public DateTime LastActive { get; set; } = DateTime.Now;
        public ICollection<HRUserPhoto> Photo { get; set; }

        //for the like feature 
        //users liked by the currently loged in user
        public ICollection<HRUserLike> LikedByUsers { get; set; }
        //users that the currently loged in user likes
        public ICollection<HRUserLike> LikedUsers { get; set; }

        //for the messages feature
        public ICollection<Message> MessagesSent { get; set; }
        public ICollection<Message> MessagesReceived { get; set; }

    }
}