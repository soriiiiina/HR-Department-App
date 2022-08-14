using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace API.Extensions
{
    public static class AppIdentityServiceExtensions
    {
        public static IServiceCollection AddingIdentityServices(this IServiceCollection services, IConfiguration config)
        {   
            //IDENTITY RELATED SERVICES
            services.AddIdentityCore<HRUser>(options => {
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 2;
                options.Password.RequireUppercase = false;
                options.Password.RequiredUniqueChars = 2;
            })
                    .AddRoles<AppRole>()
                    .AddRoleManager<RoleManager<AppRole>>()
                    .AddSignInManager<SignInManager<HRUser>>()
                    .AddRoleValidator<RoleValidator<AppRole>>()
                    .AddEntityFrameworkStores<DataContext>();
                    
            //Authentication middleware
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options => {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"])),
                    //the issuer is the api 
                    ValidateIssuer = false, 
                    //the audience is the angular app 
                    ValidateAudience = false
                };
            });

            //AUTHORIZATION - NEW POLICIES
            services.AddAuthorization(options => {
                options.AddPolicy("RequiredAdminRole", policy => policy.RequireRole("Admin"));
                options.AddPolicy("ModeratePhotoRole", policy => policy.RequireRole("Admin", "TeamMember"));
            });

            return services;
        }
    }
}