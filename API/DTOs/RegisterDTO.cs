using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class RegisterDTO
    {//we add this required tag so that the fields can not be empty when register a user 
        [Required]
        public string Username { get; set; }

        [Required]
        [StringLength(8, MinimumLength = 2)]
        public string Password { get; set; }
        
    }
}