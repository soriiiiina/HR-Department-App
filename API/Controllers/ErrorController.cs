using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ErrorController : BaseController
    {
        public DataContext _context { get; }
        public ErrorController(DataContext context)
        {
            _context = context;
        }

        //generate 5 different methods that return different responses 
        [Authorize]
        [HttpGet("auth")]
        public ActionResult<string> GetSecret()
        {
            return "secret text";
        }
        
        [HttpGet("not-found")]
        public ActionResult<HRUser> GetNotFound()
        {
            //we are trying to get something that does no  exist for sure (an user with id=-1)
            var thing = _context.Users.Find(-1);

            if(thing==null) return NotFound(); 

            return Ok(thing);
        }
        
        [HttpGet("server-error")]
        public ActionResult<string> GetServerError()
        {   
            //this will return null 
            var thing = _context.Users.Find(-1);

            //we will get an error for trying to convert null in a string ==> NULL REFERENCE EXCEPTION
            var valueToReturn = thing.ToString();

            return valueToReturn;
        }
        
        [HttpGet("bad-request")]
        public ActionResult<string> GetBadRequest()
        {
            return BadRequest();
        }
    }
}