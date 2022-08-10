using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class HRUserDTO
    {
        public string Username { get; set; }
        public string UserToken { get; set; }
        public string PhotoUrl { get; set; }

        public string FullName { get; set; }
        public string Faculty { get; set; }
    }
}