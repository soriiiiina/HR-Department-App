using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class CreateMessageDTO
    {
        public string RecieverUsername { get; set; }
        public string Content { get; set; }
    }
}