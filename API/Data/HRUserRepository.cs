using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class HRUserRepository : IHRUserRepository
    {
        private readonly DataContext _dataContext;
        private readonly IMapper _mapper;
        private readonly UserManager<HRUser> _userManeger;
        
        public HRUserRepository(DataContext dataContext, IMapper mapper, UserManager<HRUser> userManager)
        {
            _mapper = mapper;
            _dataContext = dataContext;
             _userManeger = userManager;
        }

        public async Task<HRUser> GetHRUserByIdAsync(int id)
        {
            return await _dataContext.Users.FindAsync(id);
        }

        public async Task<HRUser> GetHRUserByUsernameAsync(string username)
        {
            return await _dataContext.Users
            .Include(p => p.Photo)
            .SingleOrDefaultAsync(x => x.UserName == username);
        }

        public async Task<IEnumerable<HRUser>> GetHRUsersAsync()
        {
            return await _dataContext.Users
            .Include(r => r.UserRoles)
            .Include(p => p.Photo)
            .ToListAsync();
        }
        public async Task<bool> SaveAllAsync()
        {
            //if smething has changed/been saved, it is going to return a value > 0 
            return await _dataContext.SaveChangesAsync() > 0;
        }

        public void Update(HRUser hruser)
        {
            //it ads a flag to tell us if somtehing has been modified 
            _dataContext.Entry(hruser).State = EntityState.Modified;
        }

        public async Task<MemberDTO> GetMemberAsync(string username)
        {
            return await _dataContext.Users
            //finding the right user based on name 
                .Where(x => x.UserName == username)
                //ConfugurationProveder is the configuration that we provided in AutoMapperProfile
                .ProjectTo<MemberDTO>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();
        }

        public async Task<PagedList<MemberDTO>> GetMembersAsync(UserParams userParams)
        {
            var query = _dataContext.Users.AsQueryable();
            
            //NAME & FACULTY FILTERING
            //query to return all the users, except the currently logged in one 
            query = query.Where(u => u.UserName != userParams.CurrentUserName);
            //query for a specific faculty 
            
            //AGE FILTER 
            var minDateOfBirth = DateTime.Today.AddYears(-userParams.MaxAge - 1);
            var maxDateOfBirth = DateTime.Today.AddYears(-userParams.minAge);
            query = query.Where(u => u.DateOfBirth >= minDateOfBirth && u.DateOfBirth <= maxDateOfBirth);

            // SORTING 
            query = userParams.OrderBy switch 
            {   //case for "created"
                "created" => query.OrderByDescending(u => u.Created),
                //default case
                _ => query.OrderByDescending(u => u.LastActive)
            }; 


            //creating the PagedList with the desired paramters (and returning it) 
            return await PagedList<MemberDTO>.CreateAsync(query.ProjectTo<MemberDTO>(_mapper
                    .ConfigurationProvider)
                    .AsNoTracking(), 
                        userParams.PageNumber, userParams.PageSize);

        }
        public async Task<PagedList<MemberDTO>> GetTeamMembersAsync(UserParams userParams)
        {
            var query = _dataContext.Users.AsQueryable();
            
            //NAME & FACULTY FILTERING
            //query to return all the users, except the currently logged in one 
            query = query.Where(u => u.UserName != userParams.CurrentUserName);
            //query for a specific faculty 
            
            //AGE FILTER 
            var minDateOfBirth = DateTime.Today.AddYears(-userParams.MaxAge - 1);
            var maxDateOfBirth = DateTime.Today.AddYears(-userParams.minAge);
            query = query.Where(u => u.DateOfBirth >= minDateOfBirth && u.DateOfBirth <= maxDateOfBirth);

            var roleQuery = _dataContext.Roles.AsQueryable();
            var teamMemberRoleId = roleQuery.Where(r => r.Name == "TeamMember").Select(r => r.Id).SingleOrDefault();
            var adminRoleId = roleQuery.Where(r => r.Name == "Admin").Select(r => r.Id).SingleOrDefault();
            

            query = query.Where(u => u.UserRoles.Any(r => r.RoleId == teamMemberRoleId || r.RoleId == adminRoleId));



            // SORTING 
            query = userParams.OrderBy switch 
            {   //case for "created"
                "created" => query.OrderByDescending(u => u.Created),
                //default case
                _ => query.OrderByDescending(u => u.LastActive)
            }; 


            //creating the PagedList with the desired paramters (and returning it) 
            return await PagedList<MemberDTO>.CreateAsync(query.ProjectTo<MemberDTO>(_mapper
                    .ConfigurationProvider)
                    .AsNoTracking(), 
                        userParams.PageNumber, userParams.PageSize);

        }

        public async Task<IEnumerable<MemberDTO>> SearchByNameOrFaculty(string searchTerm)
        {
            return await _dataContext.Users
            .Where(u => u.FullName.Contains(searchTerm) 
                || u.Faculty.ToLower().Contains(searchTerm.ToLower()) 
                || u.UserName.Contains(searchTerm))
            .Include(r => r.UserRoles)
            .Include(p => p.Photo)
            .ProjectTo<MemberDTO>(_mapper.ConfigurationProvider)
            .ToListAsync();
        }

        public async Task<IEnumerable<MemberDTO>> SearchTeamMembersByNameOrFaculty(string searchTerm)
        {
            var roleQuery = _dataContext.Roles.AsQueryable();
            var teamMemberRoleId = roleQuery.Where(r => r.Name == "TeamMember").Select(r => r.Id).SingleOrDefault();
            var adminRoleId = roleQuery.Where(r => r.Name == "Admin").Select(r => r.Id).SingleOrDefault();

            return await _dataContext.Users
            .Where(u => u.FullName.Contains(searchTerm) 
                || u.Faculty.ToLower().Contains(searchTerm.ToLower()) 
                || u.UserName.Contains(searchTerm))
            .Where(u => u.UserRoles.Any(r => r.RoleId == teamMemberRoleId || r.RoleId == adminRoleId))
            .Include(r => r.UserRoles)
            .Include(p => p.Photo)
            .ProjectTo<MemberDTO>(_mapper.ConfigurationProvider)
            .ToListAsync();
        }
    }
}