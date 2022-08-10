import { HRUser } from "./user";

export class UserParams {
    faculty: string;
    mingAge = 18; 
    maxAge = 80;
    pageNumber = 1; 
    pageSize = 9; 
    orderBy = 'lastActive';

    constructor(user: HRUser) {
        this.faculty = user.faculty;
    }

}