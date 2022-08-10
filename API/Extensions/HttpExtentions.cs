using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using API.Helpers;
using Microsoft.AspNetCore.Http;

namespace API.Extensions
{
    public static class HttpExtentions
    {
        //adding the pagination headers into the response
        public static void  AddPaginationHeader(this HttpResponse httpResponse, int currentPage, 
            int itemsPerPage, int totalItems, int totalPages)
            {
                //creating a pagination header
                var paginationHeader = new PaginationHeader(currentPage, itemsPerPage, totalItems, totalPages);
                
                var options = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                };

                //adding the pagination to the response headers
                httpResponse.Headers.Add("Pagination", JsonSerializer.Serialize(paginationHeader, options));

                //we need to add a CORS header too
                httpResponse.Headers.Add("Access-Control-Expose-Headers", "Pagination");
            
            }
    }
}