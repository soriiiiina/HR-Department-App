using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers
{
    public class UserParams
    {
        //set a maximum page size 
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;
        //default pageSize 
        private int _pageSize = 10;

        public int PageSize 
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        } 

        public string CurrentUserName { get; set; }
        public string Faculty { get; set; } 
        public int minAge { get; set; } = 14;
        public int MaxAge { get; set; } = 150;

        public string OrderBy { get; set; } = "LastActive";
    }
}