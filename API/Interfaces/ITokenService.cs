using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Entities;

namespace API.Interfaces
{
    public interface ITokenService
    {
        //returning the JWT token which will be a string
        string CreateToken(HRUser hRUser);
    }
}