using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();

            //if the user didnt sent up a thoken (if the user is not authenticated)
            if (!resultContext.HttpContext.User.Identity.IsAuthenticated) return; 

            var hruserId = resultContext.HttpContext.User.GetUserId();

            //getting access to the repository
            var repository = resultContext.HttpContext.RequestServices.GetService<IHRUserRepository>();

            //get a hold of the user object
            var user = await repository.GetHRUserByIdAsync(hruserId);

            if(user != null)
                user.LastActive = DateTime.Now;

            await repository.SaveAllAsync();
        }
    }
}