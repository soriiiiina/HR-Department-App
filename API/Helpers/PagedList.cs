
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace API.Helpers
{
    public class PagedList<T> : List<T>
    {
        public PagedList(IEnumerable<T> items, int count, int pageNumber, int pageSize)
        {
            CurrentPage = pageNumber;
            TotalPages = (int) (Math.Ceiling(count / ((double) pageSize)));
            PageSize = pageSize;
            TotalCount = count;
            AddRange(items);
        }

        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        //how many items are displayed on a page 
        public int PageSize { get; set; }
        //totalcount --> how many items are in this query in total
        public int TotalCount { get; set; }

        //static method that we can call from anywhere
        public static async Task<PagedList<T>> CreateAsync(IQueryable<T> sourceData, 
        int pageNumber, int pageSize) 
        {   
            //how many items do we have in total --> this accesses the database 
            //the first query that will be executed 
            var count = await sourceData.CountAsync();
            
            //second query that will be executed
            var items = await sourceData
            //skipp al the already seen items 
            .Skip((pageNumber-1)*pageSize)
            //how many items will be on a page 
            .Take(pageSize)
            .ToListAsync();

            //creates a new instance of itself 
            return new PagedList<T>(items, count, pageNumber, pageSize);
        }
    }
}