using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;
using Entities;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<HRUser, MemberDTO>()
                .ForMember(destination => destination.PhotoUrl,
                options => options.MapFrom(source => source.Photo.FirstOrDefault(x => x.isMain).Url))
                .ForMember(destination => destination.Age, 
                options => options.MapFrom(source => source.DateOfBirth.CalculateAge()));
            CreateMap<HRUserPhoto, PhotoDTO>();
            CreateMap<MemberUpdateDTO, HRUser>();
            CreateMap<RegisterDTO, HRUser>();
            CreateMap<Message, MessageDTO>()
                //there is one property that we need to make manually
                .ForMember(dest => dest.SenderPhotoUrl, options => options.MapFrom(src => 
                    src.Sender.Photo.FirstOrDefault(x => x.isMain).Url))
                .ForMember(dest => dest.RecieverPhotoUrl, options => options.MapFrom(src => 
                    src.Reciever.Photo.FirstOrDefault(x => x.isMain).Url));
        }
    }
}