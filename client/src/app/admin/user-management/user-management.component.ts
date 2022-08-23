import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { RolesModalComponent } from 'src/app/_modals/roles-modal/roles-modal.component';
import { HRUser } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';
import { LoginregisterService } from 'src/app/_services/loginregister.service';
import { MembersService } from 'src/app/_services/members.service';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  users!: Partial<HRUser[]>;
  bsModalRef!: BsModalRef;
  isAdmin!: boolean;

  constructor(private adminService: AdminService, private modalService: BsModalService, private memberService: MembersService, private loginRegisterService: LoginregisterService) { 
    this.loginRegisterService.currentHRUser$.pipe(take(1)).subscribe(hruser => {
      this.isAdmin = hruser ? hruser.roles.includes("Admin") : false;
    });
  }

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe(users => {
      console.log(users);
      this.users = users!;
    })
  }
  
  deleteUser(user: HRUser) {
    if(confirm(`Are you sure you want to delete user ${user.username}?`))
    {
      this.memberService.deleteAccount(user.username).subscribe(result => {
        this.users = this.users.filter(u => u?.username != user.username);
      });
    }
      
  }


  openRolesModal(user: HRUser) {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        user,
        roles: this.getRolesArray(user)
      }
    }
    this.bsModalRef = this.modalService.show(RolesModalComponent, config);
    this.bsModalRef.content.updateSelectedRoles.subscribe((values: any[]) => {
      const rolesToUpdate = {
        roles: [...values.filter(el => el.checked === true).map(el => el.name)]
      };
      if (rolesToUpdate) {
        this.adminService.updateUserRoles(user.username, rolesToUpdate.roles).subscribe(() => {
          user.roles = [...rolesToUpdate.roles];
        })
      }
    })
  }


private getRolesArray(user: HRUser) {
    const roles: any[] = [];
    const userRoles = user.roles;
    const availableRoles: any[] = [
      {name: 'Admin', value: 'Admin'},
      {name: 'TeamMember', value: 'TeamMember'},
      {name: 'Member', value: 'Member'}
    ];

    //looping through the available roles
    availableRoles.forEach(role => {
      let isMatch = false;
      //checking if the users role m,achies one of the available roles
      for (const userRole of userRoles) {
        if (role.name === userRole) {
          isMatch = true;
          role.checked = true;
          roles.push(role);
          break;
        }
      }
      if (!isMatch) {
        role.checked = false;
        roles.push(role);
      }
    })
    return roles;
  }
}
