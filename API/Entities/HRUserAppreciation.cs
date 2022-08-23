using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Entities;

namespace API.Entities
{
    public class HRUserAppreciation
    {
        //User that likes other user
        public HRUser SourceUser { get; set; }
        public int  SourceUSerId { get; set; }

        //user that gets the like
        public HRUser LikedUser { get; set; }
        public int LikedUserId { get; set; }
    }
}