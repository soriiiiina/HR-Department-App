using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{   
    [Authorize]
    public class LikesController : BaseController
    {
        private readonly IHRUserRepository _userRepository;
        private readonly ILikesRepository _likesRepository;
        public LikesController(IHRUserRepository userRepository, ILikesRepository likesRepository)
        {
            _likesRepository = likesRepository;
            _userRepository = userRepository;
        }

        //method to like another user 
        [HttpPost("{username}")]
        public async Task<ActionResult> AddLike(string username) 
        {
            var sourceUserId = User.GetUserId();
            var likedUser = await _userRepository.GetHRUserByUsernameAsync(username);
            var sourceUser = await _likesRepository.GetUserWithLikes(sourceUserId);

            if(likedUser == null) return NotFound();

            if(sourceUser.UserName == username) return BadRequest("You can not like yourself");
            
            //verifying that the user hasn been already liked 
            var userLike = await _likesRepository.GetUserLike(sourceUserId, likedUser.Id);

            if(userLike != null) return BadRequest("You already liked this user");
            
            //if we dont have a like, we will create one 
            userLike = new HRUserAppreciation 
            {
                SourceUSerId = sourceUserId,
                LikedUserId = likedUser.Id
            };

            //add the user like
            sourceUser.LikedUsers.Add(userLike);

            if(await _userRepository.SaveAllAsync()) return Ok();

            return BadRequest("Failed to like user");
        }

      //get the user's likes 
      [HttpGet]
      public async Task<ActionResult<IEnumerable<HRUserAppreciationDTO>>> GetUserLikes([FromQuery]LikesParams likesParams)
      {
        likesParams.UserId = User.GetUserId();

        var users = await _likesRepository.GetUserLikes(likesParams);

        Response.AddPaginationHeader(users.CurrentPage, users.PageSize, 
            users.TotalCount, users.TotalPages);

        return Ok(users);
      }

    }

     
}