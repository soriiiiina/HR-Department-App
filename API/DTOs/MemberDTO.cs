using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Entities;

namespace API.DTOs
{
    public class MemberDTO
    {
        //it autoincrements 
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Username { get; set; }
        public string PhotoUrl { get; set; }
         public string Email { get; set; }
         public string Faculty { get; set; }
        public string StatusOrQuote { get; set; }
        public string PhoneNumber { get; set; }
        //instea of the date of birth, we will return the user's age
        //automapper will automatically call the GetAge() function 
        public int Age { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public ICollection<PhotoDTO> Photo { get; set; }

        //for roles
        public ICollection<String> Roles {get; set;}
    }
}