using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using AutoMapper;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using API.Helpers;

namespace API.Extensions
{
    public static class AppServiceExtentions
    {
        public static IServiceCollection AddingAplicationServices(this IServiceCollection services, IConfiguration config)
        {   
            //SERVICES DEFINED BY ME - the ordering is not so important 
            services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));

            services.AddScoped<ITokenService, TokenService>();     
            services.AddScoped<IHRUserRepository, HRUserRepository>();     
            services.AddScoped<IPhotoService, PhotoService>();
            
            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);   

            services.AddDbContext<DataContext>(options => 
            {
            options.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });          

            return services;
        }
        
    }
}