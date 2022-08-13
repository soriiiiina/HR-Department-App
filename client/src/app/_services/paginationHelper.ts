import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs";
import { PaginatedResult } from "../_models/pagination";

export function getPaginatedResult<T>(url: any, params: any, http: HttpClient) {

    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

    //setting the members after getting them from the api 
    //when we are observing the response, we get the full reponse back (not just the body)
    return http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        paginatedResult.result = response.body!;
        if (response.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
        }
        return paginatedResult;
      })
    );
  }

export function getPaginationHeaders(pageNumber: number, pageSize: number) {
    //using HttpParams we cand serialize the paramter and adding them to the query 
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber!.toString());
    params = params.append('pageSize', pageSize!.toString());

    return params;
  }