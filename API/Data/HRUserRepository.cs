using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class HRUserRepository : IHRUserRepository
    {
        private readonly DataContext _dataContext;
        private readonly IMapper _mapper;

        public HRUserRepository(DataContext dataContext, IMapper mapper)
        {
            _mapper = mapper;
            _dataContext = dataContext;
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

        public async Task<IEnumerable<MemberDTO>> GetMembersAsync()
        {
            return await _dataContext.Users
            .ProjectTo<MemberDTO>(_mapper.ConfigurationProvider)
            .ToListAsync();
        }

    }
}