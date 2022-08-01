using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

        //method for computing the age of a user 
        // public int GetAge() 
        // {
        //     return DateOfBirth.CalculateAge();
        // }
    }
}