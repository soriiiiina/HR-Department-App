using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class MemberUpdateDTO
    {
        //the properties the user is allowed to update
        //THIS IS A DTO WND WE WILL WANT TO MAP IT --> AUTOMAPPER PROFILES
        public string fullName { get; set; }
        public string phoneNumber { get; set; }
        public string faculty { get; set; }
        public string email { get; set; }
        public string statusOrQuote { get; set; }
        public DateTime DateOfBirth { get; set; }
    }
}