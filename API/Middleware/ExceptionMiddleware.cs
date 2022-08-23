using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using API.Errors;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        public RequestDelegate _next { get; }
        public ILogger<ExceptionMiddleware> _logger { get; }
        public IHostEnvironment _environment { get; }

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger,

        IHostEnvironment environment)
        {
            _environment = environment;
            _logger = logger;
            _next = next;
        }

        public async Task InvokeAsync(HttpContext httpcontext)
        {
            try{
                await _next(httpcontext);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                httpcontext.Response.ContentType = "application/json"; 
                httpcontext.Response.StatusCode = (int) HttpStatusCode.InternalServerError;

                var response = _environment.IsDevelopment()
                    //if we are in development mode we get a lot of info about the error
                    ? new ApiExceptions(httpcontext.Response.StatusCode, ex.Message, ex.StackTrace?.ToString())
                    //is we are not in development mode, we dont get so many info
                    : new ApiExceptions(httpcontext.Response.StatusCode, "Internal Server Error");

                var options = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};

                var json = JsonSerializer.Serialize(response, options); 

                await httpcontext.Response.WriteAsync(json);
            }
        }
    }
}