using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Interfaces;
using AutoMapper;
using Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class LoginRegisterController : BaseController
    {
        public ITokenService _tokenService { get; }
        private readonly IMapper _mapper;
        
        private readonly SignInManager<HRUser> _signInManager;
        private readonly UserManager<HRUser> _userManager;
        
        public LoginRegisterController(UserManager<HRUser> userManager, ITokenService tokenService,
         IMapper mapper, SignInManager<HRUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _mapper = mapper;
            _tokenService = tokenService;
        }

    //CREATING THE METHODS 
    //endpoint for register that takes as a paramter a registerDTO object and returns a HRUser object/task
    [HttpPost("register")]
    public async Task<ActionResult<HRUserDTO>> RegisterUser(RegisterDTO registerDTO)
    {   
        if(await UserAlreadyExists(registerDTO.Username)) return BadRequest("Username is taken");

        //creatign anew user --> mapping from registerDTO to HRUser
        var hruser = _mapper.Map<HRUser>(registerDTO);

        hruser.UserName = registerDTO.Username.ToLower();

        //creating & adding the user into the database
        var result = await _userManager.CreateAsync(hruser, registerDTO.Password);

        if(!result.Succeeded) return BadRequest(result.Errors);

        //adding the user into the member role -> any new registered user will get the role "MEMBER"
        var roleResult = await _userManager.AddToRoleAsync(hruser, "Member");

        if(!roleResult.Succeeded) return BadRequest(result.Errors);

        return new HRUserDTO
        {
            Username = hruser.UserName,
            //creating the token for the current user 
            UserToken = await _tokenService.CreateToken(hruser),
            FullName = hruser.FullName,
            Faculty = hruser.Faculty
            
        };
    }

    //endpoint for the login 
    //from loginDTO we are taking the data in order to compare for the login
    [HttpPost("login")]
    public async Task<ActionResult<HRUserDTO>> LoginUser(LoginDTO loginDTO)
    {
        //get the user from the database 
        var hruser = await _userManager.Users
        .Include(p => p.Photo)
        .SingleOrDefaultAsync(value => value.UserName == loginDTO.Username.ToLower());

        if(hruser == null) return Unauthorized("Invalid username"); 

        //using the SingInManager to sign in the user 
        var result = await _signInManager
            .CheckPasswordSignInAsync(hruser, loginDTO.Password, false);

        if(!result.Succeeded) return Unauthorized();

        //returning the HRUserDTO 
        return new HRUserDTO
        {
            Username = hruser.UserName,
            //creating the token for the current user 
            UserToken = await _tokenService.CreateToken(hruser),
            //getting the photo url when the user logs in 
            PhotoUrl = hruser.Photo.FirstOrDefault(x => x.isMain)?.Url,
            FullName = hruser.FullName,
            Faculty = hruser.Faculty
        };
    }

        //making sure the username is unique 
        private async Task<bool> UserAlreadyExists(string username)
        {   //cheking if any username matches the current username 
            return await _userManager.Users.AnyAsync(x => x.UserName == username.ToLower());
        }
    }
}