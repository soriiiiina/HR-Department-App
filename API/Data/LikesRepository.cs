using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class LikesRepository : ILikesRepository
    {
        private readonly DataContext _dataContext;
        public LikesRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        //finds an individual like
        public async Task<HRUserLike> GetUserLike(int sourceUserId, int likedUserId)
        {
            return await _dataContext.Likes.FindAsync(sourceUserId, likedUserId);
        }
        
        //a list of users that the user has liked (userId will be the source user)
        //a list of users that liked the currently logged in user (userId will be the oppsotie of source user)
        public async Task<PagedList<LikeDTO>> GetUserLikes(LikesParams likesParams)
        {
            var users = _dataContext.Users.OrderBy(u => u.UserName).AsQueryable();
            var likes = _dataContext.Likes.AsQueryable();

            //the users that the currently logged in user has liked
            if (likesParams.Predicate == "liked")
            {
                likes = likes.Where(like => like.SourceUSerId == likesParams.UserId);
                users = likes.Select(like => like.LikedUser);
            }

            //the list of users that liked the currently loggen in user 
            if (likesParams.Predicate == "likedBy")
            {
                likes = likes.Where(like => like.LikedUserId == likesParams.UserId);
                users = likes.Select(like => like.SourceUser);
            }

            var likedUsers = users.Select(user => new LikeDTO
            {   //manually mapping 
                Username = user.UserName,
                FullName = user.FullName,
                Age = user.DateOfBirth.CalculateAge(),
                PhotoUrl = user.Photo.FirstOrDefault(p => p.isMain).Url,
                Faculty = user.Faculty,
                Id = user.Id

            });

            //returning a PagedList
            return await PagedList<LikeDTO>.CreateAsync(likedUsers, 
                likesParams.PageNumber, likesParams.PageSize);
        }
        
        //a list of users that the current user has liked, userId - the id of the current user 
        public async Task<HRUser> GetUserWithLikes(int userId)
        {
            return await _dataContext.Users
                .Include(x => x.LikedUsers)
                .FirstOrDefaultAsync(x => x.Id == userId);
        }
    }
}