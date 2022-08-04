import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';


@Injectable({
  providedIn: 'root'
})
export class MembersService {

  baseUrl = environment.apiUrl;
  //we will use the memebersService to store our data 
  members: Member[] = [];

  constructor(private http: HttpClient) { }

  getMembers() {
    //if we have the members, we will return them as an observable (de asta folosim of) 
    if(this.members.length > 0) return of(this.members);

    //setting the members after getting them from the api 
    return this.http.get<Member[]>(this.baseUrl + 'hrusers').pipe(
      map(members => {
        this.members = members;
        return members;
      })
    )
  }

  getMember(username : string) {
    const member = this.members.find(x => x.username === username);

    //find returns the member or undefined 
    if(member!== undefined) return of(member);

    //if we dont have a member, we will make out API call 
    return this.http.get<Member>(this.baseUrl + 'hrusers/' + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl+ 'hrusers', member).pipe(
      map(() => {
        //getting the member from the service by finiding the index 
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    )
  }
}
