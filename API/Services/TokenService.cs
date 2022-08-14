using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using API.Interfaces;
using Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    public class TokenService : ITokenService
    {
        //symmetric encryption = only one key is used to encryp and decrypt
        private readonly SymmetricSecurityKey _symmetricSecurityKey;
        private readonly UserManager<HRUser> _userManager;
        public TokenService(IConfiguration configuration, UserManager<HRUser> userManager)
        {
            _userManager = userManager;
            //also accessing the property TokenKey of the configuration parameter (IConfiguation is a Windows interface)
            _symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["TokenKey"]));
        }

        public BinaryReader JwtRegisterdClaimNames { get; private set; }

        public async Task<string> CreateToken(HRUser hruser)
        {   //A  TOKEN IS COMPOSED OF 3 PARTS (see video for explainations)
            //identifying what claims we will put in the token 
            var tokenClaims = new List<Claim>
            {
                //we will use NameId (name identifier) to store the user's id
                new Claim(JwtRegisteredClaimNames.NameId, hruser.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, hruser.UserName)
            };

            //getting the list of roles the user belongs to 
            var roles = await _userManager.GetRolesAsync(hruser);

            //adding the role to the token
            tokenClaims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            //create credentials
            var credentials = new SigningCredentials(_symmetricSecurityKey, SecurityAlgorithms.HmacSha512Signature);

            //describing the token 
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(tokenClaims),
                Expires = DateTime.Now.AddDays(7), 
                SigningCredentials = credentials
            };

            //creating a token handler
            var tokenHandler = new JwtSecurityTokenHandler(); 

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}