using System.Collections.Generic;
using System.Linq;
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
    }
}