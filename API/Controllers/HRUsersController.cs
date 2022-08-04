using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Interfaces;
using AutoMapper;
using Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{   
    //all of the methods inside the class will be protected with authorization
    [Authorize]
    //the atributes are the same as for the BaseController class 
    public class HRUsersController : BaseController 
    {
        //by using _dataContext we will have access to our database 
        private readonly DataContext _dataContext;
        private readonly IHRUserRepository _hruserRepository;
        private readonly IMapper _mapper;
        public HRUsersController(IHRUserRepository hruserRepository, IMapper mapper)
        {
            _mapper = mapper;
            _hruserRepository = hruserRepository;
        }

        //endpoint to get all of the users 
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDTO>>> GetHRUsers() 
        {
            var hrusers = await _hruserRepository.GetMembersAsync();
            return Ok(hrusers);

        }

        //endpoint to get a specific user by username --> we can specify a root parameter 
        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDTO>> GetHRUser(string username) 
        {
            return await _hruserRepository.GetMemberAsync(username);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDTO memberUpdateDTO)
        {
            //getting the user's username from the token 
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            //getting the user
            var user = await _hruserRepository.GetHRUserByUsernameAsync(username);

            //mapping from the memberUpdateDTO to the actual user using automapper
            _mapper.Map(memberUpdateDTO, user);

            //updating --> the user object will be flat 
            _hruserRepository.Update(user);

            if (await _hruserRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update user");
        }
    }
}