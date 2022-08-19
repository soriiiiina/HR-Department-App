using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
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
        private readonly IHRUserRepository _hruserRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        private readonly UserManager<HRUser> _userManeger;
        public HRUsersController(IHRUserRepository hruserRepository, IMapper mapper,
            IPhotoService photoService, UserManager<HRUser> userManager)
        {
            _userManeger = userManager;
            _photoService = photoService;
            _mapper = mapper;
            _hruserRepository = hruserRepository;
        }


        //endpoint to get all of the users 
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDTO>>> GetHRUsers([FromQuery] UserParams userParams)
        {
            var hruser = await _hruserRepository.GetHRUserByUsernameAsync(User.GetUsername());

            userParams.CurrentUserName = hruser.UserName;

            if (string.IsNullOrEmpty(userParams.Faculty))
                // userParams.Faculty = hruser.Faculty;
                userParams.Faculty = hruser.Faculty;

            var hrusers = await _hruserRepository.GetMembersAsync(userParams);

            Response.AddPaginationHeader(hrusers.CurrentPage, hrusers.PageSize,
                hrusers.TotalCount, hrusers.TotalPages);

            return Ok(hrusers);
        }

        //endpoint to get a specific user by username --> we can specify a root parameter 
        [HttpGet("{username}", Name = "GetUser")]
        public async Task<ActionResult<MemberDTO>> GetHRUser(string username)
        {
            return await _hruserRepository.GetMemberAsync(username);
        }


        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDTO memberUpdateDTO)
        {
            //getting the user's username from the token 
            var username = User.GetUsername();

            //getting the user
            var user = await _hruserRepository.GetHRUserByUsernameAsync(username);

            //mapping from the memberUpdateDTO to the actual user using automapper
            _mapper.Map(memberUpdateDTO, user);

            //updating --> the user object will be flat 
            _hruserRepository.Update(user);

            if (await _hruserRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update user");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDTO>> AddPhoto(IFormFile file)
        {   //getting the user
            var username = User.GetUsername();
            var user = await _hruserRepository.GetHRUserByUsernameAsync(username);
            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            //create a new photo 
            var photo = new HRUserPhoto
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            //if this is the first image the user is uploading 
            if (user.Photo.Count == 0)
            {
                photo.isMain = true;
            }

            //adding the photo 
            user.Photo.Add(photo);


            if (await _hruserRepository.SaveAllAsync())
            {
                // return CreatedAtRoute("GetUser", _mapper.Map<PhotoDTO>(photo));
                return CreatedAtRoute("GetUser", new { username = user.UserName }, _mapper.Map<PhotoDTO>(photo));
            }


            return BadRequest("Problem with adding the photo");
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await _hruserRepository.GetHRUserByUsernameAsync(User.GetUsername());

            var photo = user.Photo.FirstOrDefault(x => x.Id == photoId);

            if (photo.isMain) return BadRequest("This is already your main photo");

            var currentPhoto = user.Photo.FirstOrDefault(x => x.isMain);

            if (currentPhoto != null) currentPhoto.isMain = false;
            photo.isMain = true;

            if (await _hruserRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to set main photo");
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _hruserRepository.GetHRUserByUsernameAsync(User.GetUsername());

            var photoToDelete = user.Photo.FirstOrDefault(x => x.Id == photoId);

            if (photoToDelete == null) return NotFound();

            if (photoToDelete.isMain) return BadRequest("You cannot delete your main photo");

            if (photoToDelete.PublicId != null)
            {
                var result = await _photoService.DeletehotoAsync(photoToDelete.PublicId);

                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            user.Photo.Remove(photoToDelete);

            if (await _hruserRepository.SaveAllAsync()) return Ok();

            return BadRequest("Failed to delete the photo");
        }


        [HttpPost("user-delete/{username}")]
        public async Task<ActionResult> DeleteHRUser(string username)
        {
            //getting the user based on the username 
            var user = await _userManeger.FindByNameAsync(username);

            if(user != null) 
            {
                await _userManeger.DeleteAsync(user);
                return Ok();
            }

            return BadRequest("IT FAILED");

            // //verifying that the user is the currently logged in user 
            // if (username != user.UserName) return BadRequest("You are not allowed to delete");

            // if (user == null) return BadRequest("There is no user");

            // //delete user 
            // await _userManeger.DeleteAsync(user);

            // return Ok();

        }
    }
}