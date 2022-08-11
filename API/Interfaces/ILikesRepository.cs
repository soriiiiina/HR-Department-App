using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;
using Entities;

namespace API.Interfaces
{
    public interface ILikesRepository
    {   
         //finds an individual like
        Task<HRUserLike> GetUserLike(int sourceUserId, int likedUserId);

        //a list of users that the current user has liked
        Task<HRUser> GetUserWithLikes(int userId);

        //predicate - are we looking for a list of users that have been liked or liked by? 
     
        Task<PagedList<LikeDTO>> GetUserLikes(LikesParams likesParams); 
        
    }
}