using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Helpers;
using Entities;

namespace API.Interfaces
{
    public interface IHRUserRepository
    {
        void Update(HRUser hruser);

        //saving all the changes 
        Task<bool> SaveAllAsync();

        Task<IEnumerable<HRUser>> GetHRUsersAsync();

        //getting an user by id     
        Task<HRUser> GetHRUserByIdAsync(int id); 
        Task<HRUser> GetHRUserByUsernameAsync(string username); 

        //FOR THE MEMBER DTO??? 
        Task<PagedList<MemberDTO>> GetMembersAsync(UserParams userParams);
        Task<MemberDTO> GetMemberAsync(string username);

    }
}