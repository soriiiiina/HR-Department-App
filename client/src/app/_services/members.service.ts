import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { find, map, of, pipe } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';
import { LoginregisterService } from './loginregister.service';
import { take } from 'rxjs/operators';
import { HRUser } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberCacheMap = new Map();
  hruser!: HRUser;
  userParams!: UserParams;

  constructor(private http: HttpClient, private loginRegisterService: LoginregisterService) {
    this.loginRegisterService.currentHRUser$.pipe(take(1)).subscribe(user => {
      this.hruser = user!;
      this.userParams = new UserParams(user!);
    })
   }

   getUserParams() {
    return this.userParams;
   }

   setUserParams(params: UserParams) {
      this.userParams = params;
   }

   resetUserParams() {
    this.userParams = new UserParams(this.hruser);
    return this.userParams;
   }


  getMembers(userParams: UserParams) {
    //CACHING
    // console.log(Object.values(userParams).join('-'));

    //checking if the cache has the result of that query 
    //the key will beObject.values(userParams).join('-') & the value will be the response 
    var response = this.memberCacheMap.get(Object.values(userParams).join('-'));

    //if we have a response, we can return it
    if(response) {
      return of(response);
    }

    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.mingAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('faculty', userParams.faculty);
    params = params.append('orderBy', userParams.orderBy);

    //we go to the api, return the members, if the query is identical to other query
    //we will return from our cache (we wont make the same query to the database)
    return this.getPaginatedResult<Member[]>(this.baseUrl + 'hrusers', params)
    .pipe(map(response => {
      //setting the key and the response; the key is the same as above
      this.memberCacheMap.set(Object.values(userParams).join('-'), response);
      return response;
    }))
  }

  
  getMember(username: string) {
    //getting the member out of the lots of arrays -> flatten the response in an array of users
    const hrmember = [...this.memberCacheMap.values()]
    .reduce((arr, element) => arr.concat(element.result), [])
    //finding the fisrt appratition of the user
    .find((hrmember:Member) => hrmember.username === username);

    if(hrmember) {
      return of(hrmember);
    }

    //if we dont have a member, we will make out API call 
    return this.http.get<Member>(this.baseUrl + 'hrusers/' + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'hrusers', member).pipe(
      map(() => {
        //getting the member from the service by finiding the index 
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    )
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'hrusers/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'hrusers/delete-photo/' + photoId);
  }

  private getPaginatedResult<T>(url: any, params: any) {

    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

    //setting the members after getting them from the api 
    //when we are observing the response, we get the full reponse back (not just the body)
    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        paginatedResult.result = response.body!;
        if (response.headers.get('Pagination') !== null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
        }
        return paginatedResult;
      })
    );
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number) {
    //using HttpParams we cand serialize the paramter and adding them to the query 
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber!.toString());
    params = params.append('pageSize', pageSize!.toString());

    return params;
  }
}
