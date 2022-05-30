using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
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

            return services;
        }
    }
}