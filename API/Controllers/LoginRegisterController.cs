using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Interfaces;
using Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class LoginRegisterController : BaseController
    {
        private readonly DataContext _dataContext;
        public ITokenService _tokenService { get; }
        public LoginRegisterController(DataContext dataContext, ITokenService tokenService)
        {
            _tokenService = tokenService;
            _dataContext = dataContext;
        }

    //CREATING THE METHODS 
    //endpoint for register that takes as a paramter a registerDTO object and returns a HRUser object/task
    [HttpPost("register")]
    public async Task<ActionResult<HRUserDTO>> RegisterUser(RegisterDTO registerDTO)
    {   
        if(await UserAlreadyExists(registerDTO.Username)) return BadRequest("Username is taken");

        //providing the hashing algorithm 
        using var hmac = new HMACSHA512();

        var hruser = new HRUser
        {
            UserName = registerDTO.Username.ToLower(),
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDTO.Password)),
            PasswordSalt = hmac.Key
        };

        //adding the user into the database 
        _dataContext.Users.Add(hruser); 
        await _dataContext.SaveChangesAsync();

        return new HRUserDTO
        {
            Username = hruser.UserName,
            //creating the token for the current user 
            UserToken = _tokenService.CreateToken(hruser)
        };
    }

    //endpoint for the login 
    //from loginDTO we are taking the data in order to compare for the login
    [HttpPost("login")]
    public async Task<ActionResult<HRUserDTO>> LoginUser(LoginDTO loginDTO)
    {
        //get the user from the database 
        var hruser = await _dataContext.Users
        .SingleOrDefaultAsync(value => value.UserName == loginDTO.Username);

        if(hruser == null) return Unauthorized("Invalid username"); 

        //we need to calculate the computed hash using the password salt 
        using var hmac = new HMACSHA512(hruser.PasswordSalt);

        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDTO.Password));

        //comparing the passwords 
        for(int i = 0; i < computedHash.Length; i++)
        {
            if(computedHash[i] != hruser.PasswordHash[i]) return Unauthorized("Invalid password");
        }

        //returning the HRUserDTO 
        return new HRUserDTO
        {
            Username = hruser.UserName,
            //creating the token for the current user 
            UserToken = _tokenService.CreateToken(hruser)
        };
    }

        //making sure the username is unique 
        private async Task<bool> UserAlreadyExists(string username)
        {   //cheking if any username matches the current username 
            return await _dataContext.Users.AnyAsync(x => x.UserName == username.ToLower());
        }
    }
}