using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HRUsersController : ControllerBase
    {
        //by using _dataContext we will have access to our database 
        private readonly DataContext _dataContext;
        public HRUsersController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        //endpoint to get all of the users 
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HRUser>>> GetHRUsers() 
        {
            var hrusers = _dataContext.Users.ToListAsync();

            return await hrusers;
        }

        //endpoint to get a specific user by id --> we can spcify a root parameter 
        [HttpGet("{id}")]
        public async Task<ActionResult<HRUser>> GetHRUser(int id) 
        {
            var hruser = _dataContext.Users.FindAsync(id);

            return await hruser;
        }
    }
}