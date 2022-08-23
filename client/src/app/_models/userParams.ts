import { HRUser } from "./user";

export class UserParams {
    faculty: string;
    mingAge = 18; 
    maxAge = 30;
    pageNumber = 1; 
    pageSize = 15; 
    orderBy = 'lastActive';

    constructor(user: HRUser) {
        this.faculty = user.faculty;
    }

}