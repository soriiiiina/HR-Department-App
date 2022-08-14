import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { HRUser } from '../_models/user';
import { LoginregisterService } from '../_services/loginregister.service';
import { take } from 'rxjs/operators';

@Directive({
  selector: '[appHasRole]' //*appHasRole when we make use of this directive
})

export class HasRoleDirective implements OnInit{
  @Input() appHasRole!: string[]; 
  user!: HRUser;

  constructor(private viewContainerRef: ViewContainerRef, private templateRef: TemplateRef<any>,
    private loginRegisterService: LoginregisterService) {
      this.loginRegisterService.currentHRUser$.pipe(take(1)).subscribe(user => {
        this.user = user!;
      })
     }

  ngOnInit(): void {
    //clear the view if no roles 
    if (!this.user?.roles || this.user == null) {
      this.viewContainerRef.clear();
      return;
    }

    //if the user has a role that is in the list, the component will show
    if(this.user?.roles.some(r => this.appHasRole.includes(r))) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }

}
