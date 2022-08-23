using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers
{
    public class UserParams : PaginationParams
    {

        public string CurrentUserName { get; set; }
        public string Faculty { get; set; } 
        public int minAge { get; set; } = 18;
        public int MaxAge { get; set; } = 60;

        public string OrderBy { get; set; } = "LastActive";
    }
}