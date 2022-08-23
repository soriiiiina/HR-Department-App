using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class HRUserAppreciationDTO
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public int Age { get; set; }
        public string FullName { get; set; }
        public string PhotoUrl { get; set; }
        public string Faculty { get; set; }
    }
}