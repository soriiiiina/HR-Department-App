import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { HRUser } from 'src/app/_models/user';
import { LoginregisterService } from 'src/app/_services/loginregister.service';
import {take} from 'rxjs/operators';


@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.css']
})
export class RolesModalComponent implements OnInit {
  
  //the properties that are mentioned into configuration in the user-management.ts
  @Input() updateSelectedRoles = new EventEmitter();
  user!: HRUser;
  roles: any[] = [];
  isAdmin!: boolean;

  constructor(public bsModalRef: BsModalRef, private loginRegisterService: LoginregisterService) {
    this.loginRegisterService.currentHRUser$.pipe(take(1)).subscribe(hruser => {
      this.isAdmin = hruser ? hruser.roles.includes("Admin") : false;
    });
   }

  ngOnInit(): void {
  }

  updateRoles() {
    this.updateSelectedRoles.emit(this.roles);
    this.bsModalRef.hide();
  }

}
